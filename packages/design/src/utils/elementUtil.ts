import {
    Container,
    DisplayModel,
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
    RuntimeElementOption,
    SvgData
} from '@myprint/design/types/entity';
import { canMoveStatusList, defaultDragRectElement, elementTypeLineList } from '@myprint/design/constants/common';
import { _defaultVal, mitt, parse, stringify } from './utils';
import { CSSProperties, reactive } from 'vue';
import { formatDate } from './timeUtil';
import { px2unit, unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { arrayRemove } from '@myprint/design/utils/arrays';
import { useAppStoreHook as appStore } from '@myprint/design/stores/app';
import { updatePanel } from '@myprint/design/plugins/moveable/moveable';
import { ActionEnum, record, Snapshot } from '@myprint/design/utils/historyUtil';

export function displayModel(displayModel?: DisplayModel) {
    if (displayModel) {
        appStore().displayModel = displayModel;
    }
    return appStore().displayModel;
}

export function displayModelDesign() {
    return appStore().displayModel == 'design';
}

export function setCurrentPanel(panel: Panel) {
    appStore().currentPanel = panel;
    appStore().lastPageUnit = panel.pageUnit;
}

export function getCurrentPanel(): Panel {
    return appStore().currentPanel as Panel;
}

export function getCurrentPanelUnit(): PageUnit {
    return _defaultVal(appStore().currentPanel.pageUnit, 'px');
}

export function setCurrentElement(element: MyElement[]) {
    appStore().currentElement = element;
    // console.log('change')
    mitt.emit('changeElement');
}

export function valueUnit(value: number | undefined) {
    return value + getCurrentPanel().pageUnit;
}

export function widthValueUnit(element: MyElement) {
    return element.runtimeOption.workEnvironment == 'DataTable' ? '100%' : (element.width + getCurrentPanel().pageUnit);
}

export function heightValueUnit(element: MyElement) {
    return element.runtimeOption.workEnvironment == 'DataTable' ? '100%' : (element.height + getCurrentPanel().pageUnit);
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

export function aspectRatioHeight(element: MyElement) {
    if (element.option.aspectRatio!) {
        return element.width / element.option.aspectRatio;
    }
    return element.height;
}

export function handleAspectRatioHeight(element: MyElement) {
    if (element.option.aspectRatio!) {
        element.height = element.width / element.option.aspectRatio;
    }
}

export function clearPanel(panel?: Panel) {
    panel!.pageHeader = undefined;
    panel!.pageFooter = undefined;
    panel!.elementList = [];
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

// export function selectAllElement() {
//     selectElementList(getCurrentPanel().elementList);
// }


// export function select(element?: Container) {
//     element!.runtimeOption.status = 'SELECT';
// }
//
// export function selectRemove(element: Container) {
//     element.runtimeOption.status = 'SELECT_REMOVE';
// }

export function handle(element: Container) {
    element.runtimeOption.status = 'HANDLE';
}

// export function computedHandles(element: Container): Array<handleConstantsType> | undefined {
//     if (element.type == 'PageHeader') {
//         return ['bm'];
//     }
//     if (element.type == 'PageFooter') {
//         return ['tm'];
//     }
//     if (element.type == 'DataTable') {
//         return ['lm', 'rm'];
//     }
//     return undefined;
// }

// export function computeDrag(element: Container): boolean {
//     if (element.type == 'PageHeader') {
//         return false;
//     }
//     if (element.type == 'PageFooter') {
//         return false;
//     }
//     return true;
// }

// export function computeTranslate(_element: MyElement) {
//     // complete 更改位置
//     // if (_element.translateX != null) {
//     //     _element.x = numberUtil.sum(_element.x, _element.translateX)
//     //     _element.translateX = undefined
//     // }
//     //
//     // if (_element.translateY != null) {
//     //     _element.y = numberUtil.sum(_element.y, _element.translateY)
//     //     _element.translateY = undefined
//     // }
// }

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

export function innerElementIs(point: Point, element: MyElement) {
    return point.x >= element.runtimeOption.x && point.x <= element.runtimeOption.x + element.runtimeOption.width
        && point.y >= element.runtimeOption.y && point.y <= element.runtimeOption.y + element.runtimeOption.height;
}

// export function disableHandleList(element: MyElement) {
//     switch (element.type) {
//         case 'Text':
//             // console.log(element.contentType)
//             if (element.contentType == 'QrCode') {
//                 return ['tm', 'bm', 'lm', 'rm'];
//             }
//             break;
//         case 'Image':
//             return ['tm', 'bm', 'lm', 'rm'];
//         case 'DataTable':
//             return ['tl', 'tm', 'tr', 'bl', 'bm', 'br'];
//         case 'HorizontalLine':
//         case 'DottedHorizontalLine':
//             return ['tl', 'tm', 'tr', 'bl', 'bm', 'br'];
//         case 'VerticalLine':
//         case 'DottedVerticalLine':
//             return ['tl', 'lm', 'tr', 'bl', 'rm', 'br'];
//     }
//
//     return null;
// }

export function parentInitElement(parent: Container, element: MyElement, index: number) {
    initElement(element, index);
    installParentElement(parent, element);
    if (element.elementList?.length > 0) {
        for (let i = 0; i < element.elementList.length; i++) {
            let elementTmp = element.elementList[i];
            parentInitElement(element, elementTmp, i);
        }
    }
}

export function initElement(element: MyElement, index: number) {
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
        element.id = crypto.randomUUID();

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

                if (element.bodyList == undefined) {
                    element.bodyList = [[]];

                    let indexView = {
                        type: 'Text',
                        option: <ElementOption>{
                            disableSort: true,
                            disableEnable: false,
                            enable: true,
                            formatter: '{{autoIncrement}}'
                        }
                    } as MyElement;
                    indexView.field = 'autoIncrement';
                    indexView.width = 10;
                    indexView.label = '序号';
                    indexView.height = element.headList[0].height;
                    indexView.columnBody = {
                        type: 'Text',
                        height: indexView.height,
                        data: '1',
                        option: { ...indexView.option }
                    } as MyElement;

                    element.headList.unshift(indexView);

                    let maxHeadHeight = -1, maxBodyHeight = -1;
                    for (let i = 0; i < element.headList.length; i++) {
                        const column = element.headList[i];
                        if (column.columnBody == undefined) {
                            column.columnBody = {
                                height: column.height,
                                data: column.data,
                                type: 'Text',
                                option: column.option
                            } as MyElement;
                        }
                        if (column.columnBody.type == null) {
                            column.columnBody.type = 'Text';
                        }
                        if (column.columnBody.data == null) {
                            column.columnBody.data = column.data;
                        }
                        if (column.columnBody.height == null) {
                            column.columnBody.height = column.height;
                        }
                        column.type = 'Text';
                        column.data = column.label;

                        element.bodyList[0].push(column.columnBody);

                        if (maxHeadHeight < column.height) {
                            maxHeadHeight = column.height;
                        }
                        if (maxBodyHeight < column.columnBody.height) {
                            maxBodyHeight = column.columnBody.height;
                        }

                        column.columnBody = undefined!;
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
                            point.x = unit2px(point.x);
                            point.y = unit2px(point.y);
                        }
                        dataJson.points = points;
                    }

                    if (controlPoints) {
                        for (let point of controlPoints) {
                            point.x = unit2px(point.x);
                            point.y = unit2px(point.y);
                        }
                        dataJson.controlPoints = controlPoints;
                    }

                    // console.log(tmpDataList)
                    element.data = JSON.stringify(dataJson);
                }
                break;
        }
    }

    if (element.type == 'Text') {
        if (!element.contentType) {
            element.contentType = 'Text';
        }
    }

    if (element.type == 'DataTable') {
        for (let i = 0; i < element.headList.length; i++) {
            const column = element.headList[i];
            parentInitElement(element, column, i);
            column.runtimeOption.workEnvironment = 'DataTable';
            for (let j = 0; j < element.bodyList.length; j++) {
                parentInitElement(element, element.bodyList[j][i], element.headList.length + i);
                element.bodyList[j][i].runtimeOption.workEnvironment = 'DataTable';
            }
        }
    }

    if (['Text', 'TextTime', 'PageNum', 'DataTable'].includes(element.type)) {
        if (!element.option.fontFamily) {
            element.option.fontFamily = 'default';
        }
        if (element.option.fontSize == null) {
            element.option.fontSize = 13;
        }
    }

    if (elementTypeLineList.includes(element.type)) {
        if (!element.option.lineHeight) {
            element.option.lineHeight = 0.9;
        }
        if (!element.option.color) {
            element.option.color = '#000';
        }
    }

    if (['DottedHorizontalLine', 'DottedVerticalLine']) {
        if (!element.option.dottedStyle) {
            element.option.dottedStyle = 'dashed';
        }
    }

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
    element.runtimeOption.width = unit2px(element.width);
    element.runtimeOption.height = unit2px(element.height);
    element.runtimeOption.x = unit2px(element.x);
    element.runtimeOption.y = unit2px(element.y);
    element.runtimeOption.rotate = element.option.rotate;

    element.runtimeOption.init.x = element.runtimeOption.x;
    element.runtimeOption.init.y = element.runtimeOption.y;
    element.runtimeOption.init.width = element.runtimeOption.width;
    element.runtimeOption.init.height = element.runtimeOption.height;
    element.runtimeOption.init.runtimeOption.rotate = element.runtimeOption.rotate;
    element.runtimeOption.translate = { x: 0, y: 0 };
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
    // console.log(htmlElementList)
    const panel = getCurrentPanel();
    const idList = flatIdList(htmlElementList);
    // console.log(idList)
    // console.log(panel.groupList)
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

export function element2PreviewWrapper(element: MyElement): PreviewWrapper {
    const previewWrapper = parse(stringify(element, 'parent', 'target', 'elementList'), reactive({}) as PreviewWrapper);
    previewWrapper.id = crypto.randomUUID();
    previewWrapper.heightIs = true;

    if (element.elementList != null && element.elementList.length > 0) {
        // const pList: PreviewWrapper[] = []
        previewWrapper.previewWrapperList = [];
        for (let myElement of element.elementList) {
            previewWrapper.previewWrapperList.push(element2PreviewWrapper(myElement));
        }
    }
    return previewWrapper;
}

export function copyPreviewWrapper(element: PreviewWrapper): PreviewWrapper {
    const previewWrapper = parse(stringify(element, 'parent', 'target', 'elementList'), reactive({}) as PreviewWrapper);
    previewWrapper.id = crypto.randomUUID();
    previewWrapper.heightIs = true;

    if (element.previewWrapperList != null && element.previewWrapperList.length > 0) {
        // const pList: PreviewWrapper[] = []
        previewWrapper.previewWrapperList = [];
        for (let myElement of element.previewWrapperList) {
            previewWrapper.previewWrapperList.push(copyPreviewWrapper(myElement));
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

export function addElement(parent: Container, element: MyElement) {
    if (parent.elementList == null) {
        parent.elementList = [];
    }
    parent.elementList.push(element);
    initElement(element, parent.elementList.length - 1);
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
        .handle('PrivateDragRectElement', () => {
                const elementList: Array<MyElement> = [];

                for (let valueElement of getCurrentPanel().elementList!) {
                    if ('SELECT' == valueElement.runtimeOption.status) {
                        elementList.push(valueElement);
                    }
                }

                for (let valueElement of elementList) {
                    arrayRemove(valueElement.runtimeOption.parent!.elementList, valueElement);
                }
                element.x = undefined!;
            }
        )
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

export function elementCommonPositionStyle(element: MyElement): CSSProperties {
    return {
        // width: element.runtimeOption.width + 'px',
        // left: element.runtimeOption.x + 'px',
        // top: element.runtimeOption.y + 'px',
        // maxWidth: widthValueUnit(element),
        // height: element.runtimeOption.height + 'px',
        // maxHeight: heightValueUnit(element),
        fontFamily: element.option.fontFamily,
        fontSize: element.option.fontSize + 'px'
    } as CSSProperties;
}

export function elementCommonStyle(element: MyElement, cssStyle?: CSSProperties): CSSProperties {
    if (cssStyle == null) {
        cssStyle = elementCommonPositionStyle(element);
    }
    const option = element.option!;
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

    if (option.verticalAlign) {
        cssStyle.alignItems = option.verticalAlign;
    }

    if (element.runtimeOption.workEnvironment != 'DataTable') {
        if (option.borderAll) {
            cssStyle.border = '1px solid var(--tcolor)';
            cssStyle.boxSizing = 'border-box';
        }
    } else {
        cssStyle.height = element.runtimeOption.init.height + 'px';
        cssStyle.maxHeight = element.runtimeOption.init.height + 'px';
        cssStyle.overflow = 'hidden';
    }

    // console.log(option.padding)
    if (option.padding) {
        if (option.padding.top) cssStyle.paddingTop = valueUnit(option.padding.top);
        if (option.padding.bottom) cssStyle.paddingBottom = valueUnit(option.padding.bottom);
        if (option.padding.left) cssStyle.paddingLeft = valueUnit(option.padding.left);
        if (option.padding.right) cssStyle.paddingRight = valueUnit(option.padding.right);
    }

    if (option.margin) {
        let subWidth = 0, subHeight = 0;
        if (option.margin.top) {
            cssStyle.marginTop = valueUnit(option.margin.top);
            subHeight += unit2px(option.margin.top);
        }
        if (option.margin.bottom) {
            cssStyle.marginBottom = valueUnit(option.margin.bottom);
            subHeight += unit2px(option.margin.bottom);
        }
        if (option.margin.left) {
            cssStyle.marginLeft = valueUnit(option.margin.left);
            subWidth += unit2px(option.margin.left);
        }
        if (option.margin.right) {
            cssStyle.marginRight = valueUnit(option.margin.right);
            subWidth += unit2px(option.margin.right);
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

export function formatter(element: MyElement, variable: FormatterVariable = {}): string {
    if (element.option!.formatter) {
        let contentData = '';
        if (element.type == 'TextTime') {
            const variableNames = extractVariableNames(element.option.formatter);
            if (variableNames == null || variableNames.length == 0) {
                contentData = '不支持的变量';
            } else {
                try {
                    contentData = formatDate(variable.nowDate ? variable.nowDate : new Date(), variableNames[0]);
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
    const regex = /\{\{(.+?)\}\}/g;
    const matches = template.match(regex);
    if (!matches) {
        return [];
    }
    // console.log(matches)
    return matches.map(match => match.slice(2, -2));
}

function parseVariables(str: string): { name: string, defaultValue: string }[] {
    const regex = /\{\{(.*?)\}\}/g; // 匹配 {{ 及其内部内容 }}
    const matches = str.match(regex); // 匹配结果数组

    if (!matches) {
        return []; // 没有匹配到任何变量
    }

    // 解析变量名和默认值
    const variables: { name: string, defaultValue: string }[] = [];
    for (const match of matches) {
        const parts = match.slice(2, -2).split(':'); // 去除 {{ 和 }} 并按冒号分割
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
        result = result.replace(new RegExp(`{{${name}:${defaultValue}}}`, 'g'), value);
    }

    return result;
}

export function selectedElementBatchOperation(callback: (element: MyElement) => void) {
    for (let valueElement of getCurrentPanel().elementList!) {
        if (canMoveStatusList.includes(valueElement.runtimeOption.status)) {
            callback(valueElement);
        }
    }
    if (defaultDragRectElement.x != null) {
        callback(defaultDragRectElement);
    }

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

    element.width = px2unit(width);
}

export function setElementHeightPx(height: number, element: MyElement) {
    element.runtimeOption.height = height;
    element.runtimeOption.init.height = height;

    element.height = px2unit(height);
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
    // 修改属性
    record(<Snapshot>{
        type: 'Element',
        action: ActionEnum.UPDATE_STYLE,
        elementList: appStore().currentElement
    });
    for (let currentElementElement of appStore().currentElement as MyElement[]) {

        setNestedPropertyValue(currentElementElement, props, val);

        if (currentElementElement.type == 'DataTable') {
            for (let myElement of currentElementElement.headList) {
                setNestedPropertyValue(myElement, props, val);
            }
            // console.log(currentElementElement.bodyList)
            for (let bodyRowList of currentElementElement.bodyList) {
                for (let myElement of bodyRowList) {
                    setNestedPropertyValue(myElement, props, val);
                }
            }
        }
    }
}

export function newPanel(): Panel {
    return {} as Panel;
}
