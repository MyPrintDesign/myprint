import {
    Container,
    ElementOption,
    elementType,
    FormatterVariable,
    MyElement,
    MyHtmlElement,
    PageUnit,
    Panel,
    Point,
    PointLabel,
    Position,
    PreviewWrapper,
    Provider,
    RuntimeElementOption,
    SvgData,
    TableCellElement,
    TableHeadProviderCellElement
} from '@myprint/design/types/entity';
import { elementTypeContainerList, fontMap } from '@myprint/design/constants/common';
import { _defaultVal, generateUUID, mitt, parse, stringify, to } from './utils';
import { CSSProperties, reactive, Ref } from 'vue-demi';
import { formatDate } from './timeUtil';
import { px2unit, unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { arrayRemove } from '@myprint/design/utils/arrays';
import { useAppStoreHook as appStore } from '@myprint/design/stores/app';
import { updatePanel } from '@myprint/design/plugins/moveable/moveable';
import {
    findTableHeadDeep,
    findUpperCell,
    handleTableCellInitHeight,
    recursionHandleTableHead
} from '@myprint/design/utils/table/dataTable';
import numberUtil, { _defaultNum } from '@myprint/design/utils/numberUtil';
import { isEmpty, isNil } from 'lodash';

// export function displayModel(displayModel?: DisplayModel) {
//     if (displayModel) {
//         appStore().displayModel = displayModel;
//     }
//     return appStore().displayModel;
// }

export function displayDesign(element: MyElement) {
    return !displayPreview(element);
}

export function displayPreview(element: MyElement) {
    return element.runtimeOption.previewIs;
}

// export function displayModelPrint() {
//     return appStore().displayModel == 'print';
// }

export function setCurrentPanel(panel: Panel) {
    appStore().currentPanel = panel;
    appStore().lastPageUnit = panel.pageUnit;
}

export function getCurrentPanel(panel?: Panel): Panel {
    return panel != null ? panel : appStore().currentPanel as Panel;
}

export function setPreviewData(previewData?: any[]) {
    appStore().previewData = previewData == null ? [] : previewData;
}

export function getPreviewData() {
    return appStore().previewData == null ? [] : appStore().previewData;
}

export function setProvider(provider?: Provider) {
    if (provider == null) {
        to({}, appStore().provider);
    } else {
        to(provider, appStore().provider);
    }
}

export function getProvider() {
    return appStore().provider == null ? {} as Provider : appStore().provider;
}

export function getRecursionParentPanel(element: MyElement): Panel {
    const panel = element.runtimeOption.parent as Panel;
    if (panel == null) {
        return null!;
    }
    if (panel.pageUnit != null) {
        return panel;
    }
    return getRecursionParentPanel(panel as any);
}

export function getCurrentPanelUnit(panel?: Panel): PageUnit {
    return _defaultVal(getCurrentPanel(panel).pageUnit, 'px');
}

export function setCurrentElement(element: MyElement[]) {
    appStore().currentElement = element;
    mitt.emit('changeElement');
}

export function valueUnit(value: number | undefined, panel?: Panel) {
    return value + getCurrentPanel(panel).pageUnit;
}

export function widthValueUnit(element: MyElement) {
    return element.runtimeOption.workEnvironment == 'DataTable' ? '100%' : (element.width + getCurrentPanel(element.runtimeOption.parent as Panel).pageUnit);
}

export function heightValueUnit(element: MyElement) {
    return element.runtimeOption.workEnvironment == 'DataTable' ? '100%' : (element.height + getCurrentPanel().pageUnit);
}

export function getPositionX(element: MyElement) {
    if (element.runtimeOption.parent!.x) {
        return numberUtil.sum(element.x, element.runtimeOption.parent!.x);
    }
    return element.x;
}

export function getPositionY(element: MyElement) {
    if (element.runtimeOption.parent!.y) {
        return element.y + element.runtimeOption.parent!.y;
    }
    return element.y;
}

export function width(element: MyElement) {
    if (['DottedVerticalLine', 'VerticalLine'].includes(element.type)) {
        return element.option.borderWidth + 0.6;
    }
    return element.width;
}

export function height(element: MyElement) {
    if (['DottedHorizontalLine', 'HorizontalLine'].includes(element.type)) {
        return element.option.borderWidth + 2;
    }
    return element.height;
}

export function clearPanel(panel: Panel) {
    panel.pageHeader = undefined;
    panel.pageFooter = undefined;
    panel.elementList = [];
    panel.auxiliaryLineList = [];
}

export function initPanel(panel: Panel, provider: Ref<Provider>) {
    panel.name == null && (panel.name = '新模版');
    panel.width == null && (panel.width = _defaultNum(provider.value.width, 210));
    panel.height == null && (panel.height = _defaultNum(provider.value.height, 297));
    panel.pageSize == null && (panel.pageSize = _defaultVal(provider.value.pageSize, 'A4'));
    panel.fontSizeUnit == null && (panel.fontSizeUnit = _defaultVal(provider.value.fontSizeUnit, 'px'));
    panel.pageUnit == null && (panel.pageUnit = _defaultVal(provider.value.pageUnit, 'mm'));
    panel.dragSnapPanelIs == null && (panel.dragSnapPanelIs = provider.value.dragSnapPanelIs);
    panel.dragSnapIs == null && (panel.dragSnapIs = provider.value.dragSnapIs);
    panel.elementList == undefined && (panel.elementList = []);
    panel.groupList == null && (panel.groupList = []);
    panel.auxiliaryLineList == null && (panel.auxiliaryLineList = []);
}

export function none(element?: MyElement) {
    if (element == null) {
        return;
    }
    element.runtimeOption.status = 'NONE';
    if (element.elementList != null) {
        for (let childrenElement of element.elementList) {
            none(childrenElement);
        }
    }
}

export function handle(element: Container) {
    element.runtimeOption.status = 'HANDLE';
}

export function recursionForElement(container: Panel, callback: (element: MyElement) => void) {
    recursionElement(container, callback);
    recursionElement(container.pageFooter!, callback);
    recursionElement(container.pageHeader!, callback);
}

export function recursionElement(container: Container, callback: (element: MyElement) => void) {
    if (container?.elementList?.length! > 0) {
        // console.log(container)
        for (let elementTmp of container!.elementList!) {
            callback(elementTmp);
            recursionElement(elementTmp, callback);
        }
    }
}

export function innerElementIs(point: Point, element: MyElement, parentElement: MyElement) {
    return (!(elementTypeContainerList.includes(element.type)  /*容器目前不支持嵌套*/
            && elementTypeContainerList.includes(parentElement.type))) && point.x >= parentElement.runtimeOption.x && point.x <= parentElement.runtimeOption.x + parentElement.runtimeOption.width
        && point.y >= parentElement.runtimeOption.y && point.y <= parentElement.runtimeOption.y + parentElement.runtimeOption.height;
}

export function parentInitElement(panel: Panel, parent: Container, element: MyElement, index: number) {
    initElement(panel, element, index);
    installParentElement(parent, element);
    if (element.elementList?.length > 0) {
        for (let i = 0; i < element.elementList.length; i++) {
            let elementTmp = element.elementList[i];
            parentInitElement(panel, element, elementTmp, i);
        }
    }
}

export function initElement(panel: Panel, element: MyElement, index: number) {
    if (element == null) {
        return;
    }

    if (element.option == null) {
        element.option = {} as ElementOption;
    }
    if (element.runtimeOption == null) {
        element.runtimeOption = {} as RuntimeElementOption;
    }
    element.runtimeOption.index = index;
    element.runtimeOption.status = 'NONE';

    let initWidth = 0, initHeight = 0, initBorderWidth = 0;

    if (!element.id) {
        element.id = generateUUID();

        switch (element.type) {
            case 'Text':
                initWidth = 30;
                initHeight = 8;
                break;
            case 'DataTable':
                initWidth = 200;
                initHeight = 30;
                if (element.option.tableHeightType == null) {
                    element.option.tableHeightType = 'AUTO';
                    // element.option.tableHeightType = "FIXED"
                }

                if (element.tableBodyList == undefined) {
                    let indexView = {
                        type: 'Text',
                        field: 'autoIncrement',
                        width: unit2unit('mm', getCurrentPanelUnit(), 10),
                        label: '序号',
                        height: element.columnList[0].height,
                        option: <ElementOption>{
                            disableSort: 1,
                            disableEnable: 0,
                            enable: 1,
                            formatter: '{{autoIncrement}}'
                        }
                    } as TableHeadProviderCellElement;

                    indexView.columnBody = {
                        type: 'Text',
                        height: indexView.height,
                        data: '1',
                        option: { ...indexView.option }
                    } as TableCellElement;

                    element.columnList.unshift(indexView);

                    const deep = findTableHeadDeep(element.columnList, 0) + 1;
                    // console.log(deep);
                    const tableHeadListList: TableCellElement[][] = [...Array.from({ length: deep }, (_) => [])];
                    recursionHandleTableHead(tableHeadListList, element.columnList, 0);

                    handleTableCellInitHeight(tableHeadListList);
                    // console.log(tableHeadListList);
                    element.tableHeadList = tableHeadListList;
                    element.tableBodyList = [[]];

                    const floorHeaderList = tableHeadListList[deep - 1];
                    let maxHeadHeight = -1, maxBodyHeight = -1;
                    // let tableWidth = 0;


                    for (let i = 0; i < floorHeaderList.length; i++) {
                        let tableHeadCellElement = floorHeaderList[i];
                        if (tableHeadCellElement == null) {
                            tableHeadCellElement = findUpperCell(tableHeadListList, i, deep - 1)!;
                        }
                        if (tableHeadCellElement == null) {
                            continue;
                        }

                        if (tableHeadCellElement.columnBody == undefined) {
                            tableHeadCellElement.columnBody = {
                                height: numberUtil.div(tableHeadCellElement.height, tableHeadCellElement.rowspan),
                                data: tableHeadCellElement.data,
                                type: 'Text',
                                option: tableHeadCellElement.option
                            } as TableCellElement;
                        }
                        if (tableHeadCellElement.columnBody.type == null) {
                            tableHeadCellElement.columnBody.type = 'Text';
                        }
                        if (tableHeadCellElement.columnBody.data == null) {
                            tableHeadCellElement.columnBody.data = tableHeadCellElement.data;
                        }
                        if (!tableHeadCellElement.columnBody.height) {
                            tableHeadCellElement.columnBody.height = numberUtil.div(tableHeadCellElement.height, tableHeadCellElement.rowspan);
                        }
                        // console.log(tableHeadCellElement.columnBody.width);
                        tableHeadCellElement.columnBody.width = tableHeadCellElement.width;
                        tableHeadCellElement.type = 'Text';
                        tableHeadCellElement.data = tableHeadCellElement.label;
                        tableHeadCellElement.columnBody.rowspan = 1;
                        tableHeadCellElement.columnBody.colspan = 1;

                        element.tableBodyList[0].push(tableHeadCellElement.columnBody as TableCellElement);

                        if (maxHeadHeight < tableHeadCellElement.height) {
                            maxHeadHeight = tableHeadCellElement.height;
                        }
                        if (maxBodyHeight < tableHeadCellElement.columnBody.height) {
                            maxBodyHeight = tableHeadCellElement.columnBody.height;
                        }

                        tableHeadCellElement.columnBody = undefined!;
                    }

                    if (element.option.tableHeightType == 'AUTO') {
                        element.height = maxHeadHeight + maxBodyHeight;
                    }
                }
                break;
            case 'Image':
                initWidth = 30;
                initHeight = 30;
                break;
            case 'Rect':
                initWidth = 30;
                initHeight = 30;
                initBorderWidth = px2unit(1);
                break;
            case 'HorizontalLine':
            case 'DottedHorizontalLine':
                initWidth = 30;
                initBorderWidth = px2unit(1);
                initHeight = px2unit(initBorderWidth + 3);
                break;
            case 'VerticalLine':
            case 'DottedVerticalLine':
                initHeight = 30;
                initBorderWidth = px2unit(1);
                initWidth = px2unit(initBorderWidth + 3);
                break;
            case 'SvgPolygonLine':
            case 'SvgBezierCurve':
            case 'SvgBezierCurveThree':
            case 'SvgLine':
                if (element.data) {
                    const data = JSON.parse(element.data) as SvgData;
                    const points = data.points as Point[];
                    const controlPoints = data.controlPoints as Point[];
                    const dataJson = {} as SvgData;
                    if (points) {
                        for (let point of points) {
                            point.x = unit2px(point.x, panel);
                            point.y = unit2px(point.y, panel);
                        }
                        dataJson.points = points;
                    }

                    if (controlPoints) {
                        for (let point of controlPoints) {
                            point.x = unit2px(point.x, panel);
                            point.y = unit2px(point.y, panel);
                        }
                        dataJson.controlPoints = controlPoints;
                    }

                    // console.log(tmpDataList)
                    element.data = JSON.stringify(dataJson);
                }
                break;
        }
    }

    if (element.type == 'Text' || element.type == 'TextTime') {
        if (!element.contentType) {
            element.contentType = 'Text';
        }
    }

    if (element.type == 'DataTable') {
        for (let i = 0; i < element.tableHeadList.length; i++) {
            const headList = element.tableHeadList[i];
            for (let j = 0; j < headList.length; j++) {
                const column = headList[j];
                if (column) {
                    parentInitElement(panel, element, column, i);
                    column.runtimeOption.workEnvironment = 'DataTable';
                    column.runtimeOption.cellType = 'Head';
                }
            }
        }

        for (let i = 0; i < element.tableBodyList.length; i++) {
            const bodyList = element.tableBodyList[i];
            for (let j = 0; j < bodyList.length; j++) {
                parentInitElement(panel, element, bodyList[j], element.tableHeadList.length);
                bodyList[j].runtimeOption.workEnvironment = 'DataTable';
                bodyList[j].runtimeOption.cellType = 'Body';
            }
        }

        if (!element.statisticsList) {
            element.statisticsList = [];
        }
        for (let i = 0; i < element.statisticsList.length; i++) {
            const statisticsList = element.statisticsList[i];
            for (let j = 0; j < statisticsList.length; j++) {
                parentInitElement(panel, element, statisticsList[j], element.tableHeadList.length);
                statisticsList[j].runtimeOption.workEnvironment = 'DataTable';
                statisticsList[j].runtimeOption.cellType = 'Statistics';
            }
        }
    }

    if (['Text', 'TextTime', 'PageNum', 'DataTable'].includes(element.type)) {
        if (!element.option.fontFamily) {
            element.option.fontFamily = 'heiti';
        }
        if (element.option.fontSize == null) {
            element.option.fontSize = 13;
        }
    }

    // if (elementTypeLineList.includes(element.type)) {
    //     if (!element.option.lineHeight) {
    //         element.option.lineHeight = 0.9;
    //     }
    //     if (!element.option.color) {
    //         element.option.color = '#000';
    //     }
    // }

    // if (['DottedHorizontalLine', 'DottedVerticalLine']) {
    //     if (!element.option.dottedStyle) {
    //         element.option.dottedStyle = 'dashed';
    //     }
    // }

    if (element.width == null) {
        element.width = initWidth;
    }

    if (element.height == null) {
        element.height = initHeight;
    }

    if (element.option.opacity == null) {
        element.option.opacity = 1;
    }
    // 初始化旋转
    if (!element.option.rotate) {
        element.option.rotate = 0;
    }

    if (element.option.padding == null) {
        element.option.padding = {} as Position;
    }

    element.runtimeOption.init = {} as Container;
    element.runtimeOption.init.runtimeOption = {} as RuntimeElementOption;
    element.runtimeOption.width = unit2px(element.width, panel);
    element.runtimeOption.height = unit2px(element.height, panel);
    element.runtimeOption.x = unit2px(element.x, panel);
    element.runtimeOption.y = unit2px(element.y, panel);
    element.runtimeOption.rotate = element.option.rotate;
    element.runtimeOption.init.x = element.runtimeOption.x;
    element.runtimeOption.init.y = element.runtimeOption.y;
    element.runtimeOption.init.width = element.runtimeOption.width;
    element.runtimeOption.init.height = element.runtimeOption.height;
    element.runtimeOption.init.runtimeOption.rotate = element.runtimeOption.rotate;
    // element.runtimeOption.translate = { x: 0, y: 0 };
    if (element.option.margin == null) {
        element.option.margin = {} as Position;
    }
}

export function elementGroup(htmlElementList: Array<MyHtmlElement>) {
    const panel = getCurrentPanel();
    const idList = flatIdList(htmlElementList);
    const index = findGroup(idList);

    for (let htmlElementListElement of htmlElementList) {
        htmlElementListElement.element.groupIs = true;
    }

    if (index >= 0) {
        panel.groupList[index] = idList;
    } else {
        panel.groupList.push(idList);
    }
}

export function groupListToMap(groupList: string[][]) {
    const map = {} as Record<string, number>;
    for (let i = 0; i < groupList.length; i++) {
        for (let groupListElement of groupList[i]) {
            map[groupListElement] = i;
        }
    }
    return map;
}

export function elementUngroup(htmlElementList: Array<MyHtmlElement>) {
    const panel = getCurrentPanel();
    const idList = flatIdList(htmlElementList);
    const index = findGroup(idList);

    for (let htmlElementListElement of htmlElementList) {
        htmlElementListElement.element.groupIs = false;
    }

    if (index >= 0) {
        panel.groupList.splice(index, 1);
    }
}

export function elementDown(elementList: MyElement[], layer: number) {
    elementList.sort(function(a, b) {
        return a.runtimeOption.index - b.runtimeOption.index;
    });

    for (let myElement of elementList) {
        let newLayer = myElement.runtimeOption.index - layer;
        const parentElementList = myElement.runtimeOption.parent!.elementList!;
        if (newLayer < 0) {
            newLayer = 0;
        }

        const tmp = parentElementList[myElement.runtimeOption.index];

        for (let i = myElement.runtimeOption.index; i > newLayer; i--) {
            // console.log(i)
            parentElementList[i] = parentElementList[i - 1];
            parentElementList[i].runtimeOption.index = i;
        }
        parentElementList[newLayer] = tmp;
        tmp.runtimeOption.index = newLayer;
    }
    updatePanel(elementList);
}

export function elementUp(elementList: MyElement[], layer: number) {
    elementList.sort(function(a, b) {
        return a.runtimeOption.index - b.runtimeOption.index;
    });

    for (let myElement of elementList) {
        let newLayer = myElement.runtimeOption.index + layer;
        const parentElementList = myElement.runtimeOption.parent!.elementList!;
        if (newLayer > parentElementList.length - 1) {
            newLayer = parentElementList.length - 1;
        }
        // console.log('123,', newLayer)

        const tmp = parentElementList[myElement.runtimeOption.index];

        for (let i = myElement.runtimeOption.index; i < newLayer; i++) {
            // console.log(i)
            parentElementList[i] = parentElementList[i + 1];
            parentElementList[i].runtimeOption.index = i;
        }
        parentElementList[newLayer] = tmp;
        tmp.runtimeOption.index = newLayer;
    }
    updatePanel(elementList);
}

function flatIdList(htmlElementList: Array<MyHtmlElement | MyHtmlElement[]>) {
    const idList: string[] = [];
    for (let htmlElementListElement of htmlElementList) {
        if (Array.isArray(htmlElementListElement)) {
            for (let htmlElementListElementElement of htmlElementListElement) {
                idList.push(htmlElementListElementElement.element.id);
            }
        } else {
            idList.push(htmlElementListElement.element.id);
        }
    }
    return idList;
}

function findGroup(idList: string[]) {
    const panel = getCurrentPanel();
    for (let i = 0; i < panel.groupList.length; i++) {
        const groupListKey = panel.groupList[i];
        if (groupListKey.some(item => {
            return idList.includes(item);
        })) {
            return i;
        }
    }
    return -1;
}

export function element2PreviewWrapper(element: MyElement | PreviewWrapper): PreviewWrapper {
    const previewWrapper = parse(stringify(element, 'parent', 'target', 'elementList', 'previewWrapperList', 'nestColumnList'), reactive({}) as PreviewWrapper);
    previewWrapper.id = generateUUID();
    previewWrapper.heightIs = true;
    previewWrapper.runtimeOption.parent = element.runtimeOption.parent;
    previewWrapper.runtimeOption.previewIs = true;

    // const oldPreviewWrapper = element as PreviewWrapper;
    // if (oldPreviewWrapper.previewWrapperList != null) {
    //     // const pList: PreviewWrapper[] = []
    //     previewWrapper.previewWrapperList = [];
    //     for (let myElement of oldPreviewWrapper.previewWrapperList) {
    //         previewWrapper.previewWrapperList.push(element2PreviewWrapper(myElement));
    //     }
    // }

    if (element.elementList != null) {
        // const pList: PreviewWrapper[] = []
        previewWrapper.previewWrapperList = [];
        for (let myElement of element.elementList) {
            previewWrapper.previewWrapperList.push(element2PreviewWrapper(myElement));
        }
    }

    if (element.tableHeadList != null && element.tableHeadList.length > 0) {
        for (let i = 0; i < element.tableHeadList.length; i++) {
            const rowList = element.tableHeadList[i];
            for (let j = 0; j < rowList.length; j++) {
                if (rowList[j] == null) {
                    continue;
                }
                previewWrapper.tableHeadList[i][j].runtimeOption.parent = rowList[j].runtimeOption.parent;
            }
        }
    }

    if (element.tableBodyList != null) {
        // const pList: PreviewWrapper[] = []
        for (let i = 0; i < element.tableBodyList.length; i++) {
            const rowList = element.tableBodyList[i];
            for (let j = 0; j < rowList.length; j++) {
                if (rowList[j] == null) {
                    continue;
                }
                previewWrapper.tableBodyList[i][j].runtimeOption.parent = rowList[j].runtimeOption.parent;
            }
        }
    }

    if (element.statisticsList != null) {
        // const pList: PreviewWrapper[] = []
        for (let i = 0; i < element.statisticsList.length; i++) {
            const rowList = element.statisticsList[i];
            for (let j = 0; j < rowList.length; j++) {
                if (rowList[j] == null) {
                    continue;
                }
                previewWrapper.statisticsList[i][j].runtimeOption.parent = rowList[j].runtimeOption.parent;
            }
        }
    }
    return previewWrapper;
}

export function installPanelParentElement(panel: Panel) {
    installParentElement(panel, panel.pageHeader);
    installParentElement(panel, panel.pageFooter);
    installListParentElement(panel, panel.elementList);
}

export function installListParentElement(parent: Container, elementList?: Array<MyElement>) {
    for (let element of elementList!) {
        installParentElement(parent, element);
        if (element.type == 'DataTable') {
            for (let tableHeadListElement of element.tableHeadList) {
                for (let tableCellElement of tableHeadListElement) {
                    installParentElement(element, tableCellElement);
                }
            }
            for (let tableHeadListElement of element.tableBodyList) {
                for (let tableCellElement of tableHeadListElement) {
                    installParentElement(element, tableCellElement);
                }
            }
            for (let tableHeadListElement of element.statisticsList) {
                for (let tableCellElement of tableHeadListElement) {
                    installParentElement(element, tableCellElement);
                }
            }
        }
        if (element.elementList != null) {
            installListParentElement(element, element.elementList);
        }
    }

}

export function installParentElement(parent?: Container, element?: MyElement) {
    if (!element) {
        return;
    }
    element.runtimeOption.parent = parent;
}

export function clearParent(element: MyElement) {
    if (element.runtimeOption == null || element.runtimeOption.parent == undefined) {
        return;
    }
    element.runtimeOption.parent = undefined;
}

export function addElement(panel: Panel, parent: Container, element: MyElement) {
    if (parent.elementList == null) {
        parent.elementList = [];
    }
    parent.elementList.push(element);
    initElement(panel, element, parent.elementList.length - 1);
    installParentElement(parent, element);
}

export function removeElement(element: MyElement) {
    if (element.runtimeOption.parent == null) {
        return;
    }
    if (element.runtimeOption.parent.elementList == null) {
        return;
    }
    handleElementType(element)
        .handle('PageHeader', () =>
            (element.runtimeOption.parent as Panel).pageHeader = undefined
        )
        .handle('PageFooter', () =>
            (element.runtimeOption.parent as Panel).pageFooter = undefined
        )
        // .handle('PrivateDragRectElement', () => {
        //         const elementList: Array<MyElement> = [];
        //
        //         for (let valueElement of getCurrentPanel().elementList!) {
        //             if ('SELECT' == valueElement.runtimeOption.status) {
        //                 elementList.push(valueElement);
        //             }
        //         }
        //
        //         for (let valueElement of elementList) {
        //             arrayRemove(valueElement.runtimeOption.parent!.elementList, valueElement);
        //         }
        //         element.x = undefined!;
        //     }
        // )
        .end(() => {
            arrayRemove(element.runtimeOption.parent!.elementList, element);
        });
}

export function handleElementType(element: Container) {
    const handleList: any[] = [];
    const handlers = {
        handle(type: elementType, callback: () => void) {
            handleList.push(type);
            if (element.type === type) {
                callback();
            }
            return handlers;
        },
        pageHeader(callback: () => void) {
            handleList.push('PageHeader');
            if (isPageHeader(element)) {
                callback();
            }
            return handlers;
        },
        pageFooter(callback: () => void) {
            handleList.push('PageFooter');
            if (isPageFooter(element)) {
                callback();
            }
            return handlers;
        },
        end(callback: () => void) {
            // console.log(handleList)
            if (!handleList.includes(element.type)) {
                callback();
            }
        }
    };

    return handlers;
}

function getFontSizeUnit(panel?: Panel) {
    const currentPanel = getCurrentPanel(panel);
    return currentPanel.fontSizeUnit == null ? 'px' : currentPanel.fontSizeUnit;
}

export function defaultPreviewData(previewData: any) {
    return previewData == null || previewData.length == 0 ? [{}] : previewData;
}

export function elementCommonPositionStyle(element: MyElement): CSSProperties {
    const fontFamily = element.option.fontFamily || 'heiti';
    return {
        // width: element.runtimeOption.width + 'px',
        // left: element.runtimeOption.x + 'px',
        // top: element.runtimeOption.y + 'px',
        // maxWidth: widthValueUnit(element),
        // height: element.runtimeOption.height + 'px',
        // maxHeight: heightValueUnit(element),
        fontFamily: fontMap[fontFamily],
        fontSize: element.option.fontSize + getFontSizeUnit(getRecursionParentPanel(element))
    } as CSSProperties;
}

export function elementBarCodeValueStyle(element: MyElement, cssStyle?: CSSProperties): CSSProperties {
    if (cssStyle == null) {
        cssStyle = {} as CSSProperties;
    }

    const option = element.option!;
    const panel = element.runtimeOption.parent as Panel;
    let textDecoration = '';
    if (option.underline) {
        textDecoration = textDecoration + 'underline ';
    }
    if (option.lineThrough) {
        textDecoration = textDecoration + 'line-through ';
    }

    option.opacity != null && (cssStyle.opacity = option.opacity);
    option.color && (cssStyle.color = option.color);
    option.background && (cssStyle.background = option.background);
    option.bold && (cssStyle.fontWeight = option.bold ? 'bold' : 'normal');
    textDecoration && (cssStyle.textDecoration = textDecoration);
    option.italic && (cssStyle.fontStyle = option.italic ? 'italic' : 'normal');
    if (option.textAlign) {
        cssStyle.justifyContent = option.textAlign;
    }

    if (option.lineBreak == 0) {
        cssStyle.whiteSpace = 'nowrap';
    }

    if (option.lineHeight != null) {
        cssStyle.lineHeight = valueUnit(option.lineHeight, panel);
    }

    if (option.verticalAlign) {
        cssStyle.alignItems = option.verticalAlign;
    }
    return cssStyle;
}

export function elementCommonStyle(element: MyElement, cssStyle?: CSSProperties): CSSProperties {
    if (cssStyle == null) {
        cssStyle = elementCommonPositionStyle(element);
    }
    const option = element.option!;
    const panel = getRecursionParentPanel(element) as Panel;
    let textDecoration = '';
    if (option.underline) {
        textDecoration = textDecoration + 'underline ';
    }
    if (option.lineThrough) {
        textDecoration = textDecoration + 'line-through ';
    }

    option.opacity != null && (cssStyle.opacity = option.opacity);
    option.color && (cssStyle.color = option.color);
    option.background && (cssStyle.background = option.background);
    option.bold && (cssStyle.fontWeight = option.bold ? 'bold' : 'normal');
    textDecoration && (cssStyle.textDecoration = textDecoration);
    option.italic && (cssStyle.fontStyle = option.italic ? 'italic' : 'normal');
    if (option.textAlign) {
        cssStyle.justifyContent = option.textAlign;
    }

    if (option.lineBreak == 0) {
        cssStyle.whiteSpace = 'nowrap';
    }

    if (option.lineHeight != null) {
        cssStyle.lineHeight = valueUnit(option.lineHeight, panel);
    }

    if (option.verticalAlign) {
        cssStyle.alignItems = option.verticalAlign;
    }

    if (element.runtimeOption.workEnvironment == 'DataTable') {
        let extHeight = 0;
        const parent = (element.runtimeOption.parent as MyElement);
        // if (parent == null) {
        //     console.log(element);
        // }
        if (parent != null) {
            if (parent.option.borderAll) {
                // 加上边框高度
                if ((element as TableCellElement).rowspan > 1) {
                    extHeight = (element as TableCellElement).rowspan - 1;
                }
            }
            if (parent.option.tableBodyHeightType == 'FIXED') {
                cssStyle.height = (element.runtimeOption.init.height + extHeight) + 'px';
                cssStyle.maxHeight = (element.runtimeOption.init.height + extHeight) + 'px';
                cssStyle.overflow = 'hidden';
            }
        } else {
        }

        if (element.type == 'Text' && element.contentType == 'Barcode') {
            cssStyle.width = element.runtimeOption.width + 'px';
            cssStyle.maxWidth = element.runtimeOption.width + 'px';
        }
        // cssStyle.maxWidth = (element.runtimeOption.init.width - 1) + 'px';
    } else {
        if (option.borderAll) {
            cssStyle.border = '1px solid black';
            cssStyle.boxSizing = 'border-box';
        }
    }

    if (!isNil(option.borderRadius)) {
        cssStyle.borderRadius = valueUnit(option.borderRadius, panel);
    }

    if (!isNil(option.padding)) {
        if (option.padding.top) cssStyle.paddingTop = valueUnit(option.padding.top, panel);
        if (option.padding.bottom) cssStyle.paddingBottom = valueUnit(option.padding.bottom, panel);
        if (option.padding.left) cssStyle.paddingLeft = valueUnit(option.padding.left, panel);
        if (option.padding.right) cssStyle.paddingRight = valueUnit(option.padding.right, panel);
    }

    if (option.margin) {
        let subWidth = 0, subHeight = 0;
        if (option.margin.top) {
            cssStyle.marginTop = valueUnit(option.margin.top, panel);
            subHeight += unit2px(option.margin.top, panel);
        }
        if (option.margin.bottom) {
            cssStyle.marginBottom = valueUnit(option.margin.bottom, panel);
            subHeight += unit2px(option.margin.bottom, panel);
        }
        if (option.margin.left) {
            cssStyle.marginLeft = valueUnit(option.margin.left, panel);
            subWidth += unit2px(option.margin.left, panel);
        }
        if (option.margin.right) {
            cssStyle.marginRight = valueUnit(option.margin.right, panel);
            subWidth += unit2px(option.margin.right, panel);
        }
        if (subWidth > 0) {
            cssStyle.width = `calc(100% - ${subWidth}px)`;
        }
        if (subHeight > 0) {
            cssStyle.height = `calc(100% - ${subHeight}px)`;
        }

    }
    return cssStyle;
}

export function isPageHeader(element: Container) {
    return element != null && element.type == 'PageHeader';
}

export function isPageFooter(element: Container) {
    return element != null && element.type == 'PageFooter';
}

export function formatter(element: MyElement, variable: FormatterVariable = {} as FormatterVariable): string {
    if (element.option.formatter) {
        let contentData: any;
        if (element.type == 'TextTime') {
            const variableNames = extractVariableNames(element.option.formatter);
            if (variableNames == null || variableNames.length == 0) {
                contentData = '不支持的变量';
            } else {
                try {
                    variable[variableNames[0]] = formatDate(variable.nowDate ? variable.nowDate : new Date(), variableNames[0]);
                    contentData = replaceVariables(element.option.formatter, variable);
                } catch (e) {
                    contentData = '不支持的变量';
                }
            }
        } else {
            contentData = replaceVariables(element.option.formatter, variable);
        }
        // console.log(contentData)
        return contentData;
    }
    return element.data;
}

export function extractVariableNames(template: string): string[] {
    const regex = /\{\{(.+?)}}/g;
    const matches = template.match(regex);
    if (!matches) {
        return [];
    }
    // console.log(matches)
    return matches.map(match => match.slice(2, -2));
}

function parseVariables(str: string): { name: string, defaultValue: string }[] {
    const regex = /\{\{(.*?)}}/g; // 匹配 {{ 及其内部内容 }}
    const matches = str.match(regex); // 匹配结果数组

    if (!matches) {
        return []; // 没有匹配到任何变量
    }

    // 解析变量名和默认值
    const variables: { name: string, defaultValue: string }[] = [];
    for (const match of matches) {
        const parts = match.slice(2, -2).split('::'); // 去除 {{ 和 }} 并按冒号分割
        const name = parts[0].trim(); // 变量名
        const defaultValue = parts[1] ? parts[1].trim() : ''; // 默认值（如果有的话）

        variables.push({ name, defaultValue });
    }

    return variables;
}

export function replaceVariables(str: string, params: { [key: string]: any }): string {
    let result = str;
    const variables = parseVariables(str);

    for (const variable of variables) {
        const { name, defaultValue } = variable;
        const value = params[name] !== undefined ? params[name] : defaultValue;
        result = result.replace(new RegExp(isEmpty(defaultValue) ? `{{${name}}}` : `{{${name}::${defaultValue}}}`, 'g'), value);
    }

    return result;
}

export function changePageSize(val?: any) {
    const panel = getCurrentPanel();
    if (val) {
        panel.width = unit2unit('mm', panel.pageUnit, val.width);
        panel.height = unit2unit('mm', panel.pageUnit, val.height);
    }
    // panel.pageSize = unit2unit('mm', panel.pageUnit,  val.value
    if (panel.pageHeader != null) {
        panel.pageHeader.width = unit2unit('mm', panel.pageUnit, panel.width);
        panel.pageHeader.runtimeOption.width = unit2px(panel.width);
    }
    if (panel.pageFooter != null) {
        panel.pageFooter.width = unit2unit('mm', panel.pageUnit, panel.width);
        panel.pageFooter.y = unit2unit('mm', panel.pageUnit, panel.height - panel.pageFooter.height);
        panel.pageFooter.runtimeOption.width = unit2px(panel.width);
    }
    mitt.emit('changePageSize');
}

export function changePageUnit() {
    const panel = getCurrentPanel();
    // console.log(lastPageUnit)
    // console.log(panel.pageUnit)
    panel.width = unit2unit(appStore().lastPageUnit, panel.pageUnit, panel.width);
    panel.height = unit2unit(appStore().lastPageUnit, panel.pageUnit, panel.height);
    const { pageHeader, pageFooter, pageUnit } = panel;

    for (let element of panel.elementList!) {
        computedChangePageUnit(pageUnit, element);
    }

    if (pageHeader) {
        computedChangePageUnit(pageUnit, pageHeader);
    }

    if (pageFooter) {
        computedChangePageUnit(pageUnit, pageFooter);
    }

    appStore().lastPageUnit = panel.pageUnit;
}

function computedChangePageUnit(pageUnit: PageUnit, element: MyElement) {
    element.x = unit2unit(appStore().lastPageUnit, pageUnit, element.x);
    element.y = unit2unit(appStore().lastPageUnit, pageUnit, element.y);
    element.width = unit2unit(appStore().lastPageUnit, pageUnit, element.width);
    element.height = unit2unit(appStore().lastPageUnit, pageUnit, element.height);
    if (element.option.lineHeight != null) {
        element.option.lineHeight = unit2unit(appStore().lastPageUnit, pageUnit, element.option.lineHeight);
    }

    if (element.elementList) {
        for (let myElement of element.elementList) {
            computedChangePageUnit(pageUnit, myElement);
        }
    }
}

export function computedShapeBound(points: Array<PointLabel>): Container {
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for (let i = 1; i < points.length; i++) {
        let point = points[i];
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    } as Container;
}

export function setElementWidthHeightPx(width: number, height: number, element: MyElement) {
    setElementWidthPx(width, element);
    setElementHeightPx(height, element);
}

export function setElementWidthPx(width: number, element: MyElement) {
    element.runtimeOption.width = width;
    element.runtimeOption.init.width = width;
    element.width = px2unit(width, getRecursionParentPanel(element));
}

export function setElementHeightPx(height: number, element: MyElement) {
    element.runtimeOption.height = height;
    element.runtimeOption.init.height = height;
    element.height = px2unit(height, getRecursionParentPanel(element));
}

export function setElementOffsetWidthPx(offsetWidth: number, element: MyElement) {
    element.runtimeOption.width = element.runtimeOption.init.width + offsetWidth;
    element.width = px2unit(element.runtimeOption.width, getRecursionParentPanel(element));
}

export function recursionUpdateCellParentWidth(columnElement: TableCellElement, offsetX: number, panel: Panel) {
    columnElement.runtimeOption.width = columnElement.runtimeOption.init.width + offsetX;
    columnElement.width = px2unit(columnElement.runtimeOption.width, panel);
    // console.log(columnElement.runtimeOption.cellParent);
    if (columnElement.runtimeOption.cellParent != null) {
        recursionUpdateCellParentWidth(columnElement.runtimeOption.cellParent, offsetX, panel);
    }
}

export function recursionUpdateCellParentInitWidth(columnElement: TableCellElement) {
    columnElement.runtimeOption.init.width = columnElement.runtimeOption.width;

    if (columnElement.runtimeOption.cellParent != null) {
        recursionUpdateCellParentInitWidth(columnElement.runtimeOption.cellParent);
    }
}

export function multipleElementGetValueList(props: string) {
    const elementList = appStore().currentElement;
    const valueList = new Set();
    if (elementList.length == 0) {
        return [...valueList];
    }

    for (let currentElementElement of elementList) {
        valueList.add(getNestedPropertyValue(currentElementElement, props));
    }

    return [...valueList];
}

export function multipleElementGetValue(props: string) {
    const elementList = appStore().currentElement;
    if (elementList.length == 0) {
        return undefined;
    }

    const firstValue = getNestedPropertyValue(elementList[0], props);
    for (let currentElementElement of elementList) {
        if (getNestedPropertyValue(currentElementElement, props) != firstValue) {
            return undefined;
        }
    }
    return firstValue;
}

function getNestedPropertyValue(obj: any, propertyPath: any) {
    const properties = propertyPath.split('.');
    let currentObj = obj;

    for (let prop of properties) {
        if (currentObj.hasOwnProperty(prop)) {
            currentObj = currentObj[prop];
        } else {
            return undefined; // 如果属性不存在，返回 undefined
        }
    }

    return currentObj;
}

function setNestedPropertyValue(obj: any, propertyPath: any, value: any) {
    const properties = propertyPath.split('.');
    // console.log(obj)
    let currentObj = obj;

    for (let i = 0; i < properties.length - 1; i++) {
        if (!currentObj.hasOwnProperty(properties[i])) {
            currentObj[properties[i]] = {};
        }
        currentObj = currentObj[properties[i]];
    }

    currentObj[properties[properties.length - 1]] = value;
}


export function multipleElementSetValue(props: string, val: any) {
    // console.log(val);
    // 修改属性
    // record(<Snapshot>{
    //     type: 'Element',
    //     action: ActionEnum.UPDATE_STYLE,
    //     elementList: appStore().currentElement
    // });
    for (let currentElementElement of appStore().currentElement as MyElement[]) {

        setNestedPropertyValue(currentElementElement, props, val);

        if (currentElementElement.type == 'DataTable') {
            for (let myElement of currentElementElement.tableHeadList) {
                for (let tableCellElement of myElement) {
                    if (tableCellElement != null) {
                        setNestedPropertyValue(tableCellElement, props, val);
                    }

                }
            }
            // console.log(currentElementElement.bodyList)
            for (let bodyRowList of currentElementElement.tableBodyList) {
                for (let myElement of bodyRowList) {
                    setNestedPropertyValue(myElement, props, val);
                }
            }
            for (let bodyRowList of currentElementElement.statisticsList) {
                for (let myElement of bodyRowList) {
                    setNestedPropertyValue(myElement, props, val);
                }
            }
        }
    }
}

export function autoComputedPanelHeight() {
    const panel = getCurrentPanel();
    if (panel.pageSize != 'AutoHeight') {
        return;
    }
    if (panel.elementList == null || panel.elementList.length == 0) {
        return;
    }
    let maxY = 0;
    for (let myElement of panel.elementList) {
        const tmpY = myElement.y + myElement.height;
        maxY = Math.max(tmpY, maxY);
    }
    panel.height = maxY;
}

export function getPrintRealHeight(panel?: Panel) {
    panel = getCurrentPanel(panel);
    if (panel.pageSize == 'AutoHeight') {
        return panel.runtimeOption.printRealHeight;
    }
    return panel.height;

}
