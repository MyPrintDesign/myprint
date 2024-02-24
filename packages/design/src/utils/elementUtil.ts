import {
    Container, DisplayModel,
    CpElement,
    ElementOption,
    elementType, FormatterVariable,
    Panel,
    Position,
    RuntimeElementOption, PageUnit, PointLabel, CpHtmlElement, Point
} from "@cp-print/design/types/entity";
import {
    canMoveStatusList,
    defaultDragRectElement, elementTypeLineList,
    handleConstantsType
} from "@cp-print/design/constants/common";
import {mitt, to} from "./utils";
import {_defaultNum} from "@cp-print/design/utils/numberUtil";
import {reactive, CSSProperties, nextTick} from "vue";
import {formatDate} from "./timeUtil";
import numberUtil from "./numberUtil";
import {px2unit, unit2px, unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {arrayRemove} from "@cp-print/design/utils/arrays";
import {useAppStoreHook as appStore} from "@cp-print/design/stores/app";
import {updatePanel} from "@cp-print/design/components/moveable/moveable";

let runtime = {
    displayModel: 'design' as DisplayModel
}

export function displayModel(displayModel?: DisplayModel) {
    if (displayModel) {
        runtime.displayModel = displayModel
    }
    return runtime.displayModel
}

export function displayModelPreview() {
    return runtime.displayModel != 'preview'
}

export function setCurrentPanel(panel: Panel) {
    // currentPanel = panel
    // console.log(JSON.stringify(panel))
    // console.log("useappStore().SET_LOCALE(\"123\")")
    appStore().currentPanel = panel
    appStore().lastPageUnit = panel.pageUnit
}

export function getCurrentPanel(): Panel {
    // console.log("useappStore().SET_LOCALE(\"123\")")
    // console.log(JSON.stringify(appStore().currentPanel))
    return appStore().currentPanel as Panel
}

export function setCurrentElement(element: CpElement[]) {
    appStore().currentElement = element
}

export function valueUnit(value: number | undefined) {
    return value + getCurrentPanel().pageUnit
}

export function widthValueUnit(element: CpElement) {
    return element.runtimeOption.workEnvironment == 'Table' ? '100%' : (element.width + getCurrentPanel().pageUnit)
}

export function heightValueUnit(element: CpElement) {
    return element.runtimeOption.workEnvironment == 'Table' ? '100%' : (element.height + getCurrentPanel().pageUnit)
}

export function width(element: CpElement) {
    if (['DottedVerticalLine', 'VerticalLine'].includes(element.type)) {
        return element.option.borderWidth + 0.6
    }
    return element.width
}

export function height(element: CpElement) {
    if (['DottedHorizontalLine', 'HorizontalLine'].includes(element.type)) {
        return element.option.borderWidth + 2
    }
    return element.height
}

export function aspectRatioHeight(element: CpElement) {
    if (element.option.aspectRatio!) {
        return element.width / element.option.aspectRatio
    }
    return element.height
}

export function handleAspectRatioHeight(element: CpElement) {
    if (element.option.aspectRatio!) {
        element.height = element.width / element.option.aspectRatio
    }
}

export function clearPanel(panel?: Panel) {
    panel!.pageHeader = undefined
    panel!.pageFooter = undefined
    panel!.elementList = []
}

export function getTranslate(element: CpElement) {
    let translate = ''
    if (element.translateX || element.translateY) {
        translate = `translate(${valueUnit(element.translateX)}, ${valueUnit(element.translateY)})`
    }
    if (element.option.rotate != null) {
        translate = translate + `rotate(${element.option.rotate}deg)`
    }
    if (translate) {
        return translate
    }
    return 'none'
}

export function none(element?: CpElement) {
    if (element == null) {
        return
    }
    element.status = 'NONE'
    if (element.elementList != null) {
        for (let childrenElement of element.elementList) {
            none(childrenElement)
        }
    }
}

export function selectAllElement() {
    selectElementList(getCurrentPanel().elementList)
}

export function selectElementList(elementList?: Array<Container>) {
    for (let element of elementList!) {
        select(element)
        if (element.elementList && element.elementList.length > 0) {
            selectElementList(element.elementList)
        }
    }
}

export function select(element?: Container) {
    element!.status = 'SELECT'
}

export function selectRemove(element: Container) {
    element.status = 'SELECT_REMOVE'
}

export function handle(element: Container) {
    element.status = 'HANDLE'
}

export function computedHandles(element: Container): Array<handleConstantsType> | undefined {
    if (element.type == 'PageHeader') {
        return ['bm']
    }
    if (element.type == 'PageFooter') {
        return ['tm']
    }
    if (element.type == 'Table') {
        return ['lm', 'rm']
    }
    return undefined
}

export function computeDrag(element: Container): boolean {
    if (element.type == 'PageHeader') {
        return false
    }
    if (element.type == 'PageFooter') {
        return false
    }
    return true
}

export function computeTranslate(element: CpElement) {
    // complete 更改位置
    if (element.translateX != null) {
        element.x = numberUtil.sum(element.x, element.translateX)
        element.translateX = undefined
    }

    if (element.translateY != null) {
        element.y = numberUtil.sum(element.y, element.translateY)
        element.translateY = undefined
    }
}

export function recursionForElement(container: Panel, callback: (element: CpElement) => void) {
    recursionElement(container, callback)
    recursionElement(container.pageFooter!, callback)
    recursionElement(container.pageHeader!, callback)
}

export function recursionElement(container: Container, callback: (element: CpElement) => void) {
    if (container?.elementList?.length! > 0) {
        // console.log(container)
        for (let elementTmp of container!.elementList!) {
            callback(elementTmp)
            recursionElement(elementTmp, callback);
        }
    }
}

export function innerElementIs(point: Point, element: CpElement) {
    return point.x >= element.runtimeOption.x && point.x <= element.runtimeOption.x + element.runtimeOption.width
        && point.y >= element.runtimeOption.y && point.y <= element.runtimeOption.y + element.runtimeOption.height
}

export function disableHandleList(element: CpElement) {
    switch (element.type) {
        case 'Text':
            // console.log(element.contentType)
            if (element.contentType == 'QrCode') {
                return ['tm', 'bm', 'lm', 'rm']
            }
            break
        case 'Image':
            return ['tm', 'bm', 'lm', 'rm']
        case 'Table':
            return ['tl', 'tm', 'tr', 'bl', 'bm', 'br']
        case 'HorizontalLine':
        case 'DottedHorizontalLine':
            return ['tl', 'tm', 'tr', 'bl', 'bm', 'br']
        case 'VerticalLine':
        case 'DottedVerticalLine':
            return ['tl', 'lm', 'tr', 'bl', 'rm', 'br']
    }

    return null
}

export function parentInitElement(parent: Container, element: CpElement, index: number) {
    initElement(element, index)
    installParentElement(parent, element)
    if (element.elementList?.length > 0) {
        for (let i = 0; i < element.elementList.length; i++) {
            let elementTmp = element.elementList[i]
            parentInitElement(element, elementTmp, i);
        }
    }
}

export function initElement(element: CpElement, index: number) {
    if (element == null) {
        return
    }

    if (element.option == null) {
        element.option = {} as ElementOption
    }
    if (element.runtimeOption == null) {
        element.runtimeOption = {} as RuntimeElementOption
    }
    element.runtimeOption.index = index

    if (!element.id) {
        element.id = crypto.randomUUID()
    }
    let initWidth = 0, initHeight = 0, initBorderWidth = 0
    switch (element.type) {
        case 'Text':
            initWidth = 30
            initHeight = 8
            break
        case 'Table':
            initWidth = 200
            initHeight = 30
            element.runtimeOption.rowList = []
            const rowList: Array<CpElement> = []
            for (let i = 0; i < element.columnList.length; i++) {
                initElement(element.columnList[i], i)
                rowList.push(copyElementRefValueId(element.columnList[i]))
            }
            element.runtimeOption.rowList.push(rowList)
            break
        case 'Image':
            initWidth = 30
            initHeight = 30
            break
        case 'Rect':
            initWidth = 30
            initHeight = 30
            initBorderWidth = px2unit(1)
            break
        case 'HorizontalLine':
        case 'DottedHorizontalLine':
            initWidth = 30
            initBorderWidth = px2unit(1)
            initHeight = px2unit(initBorderWidth + 3)
            break
        case 'VerticalLine':
        case 'DottedVerticalLine':
            initHeight = 30
            initBorderWidth = px2unit(1)
            initWidth = px2unit(initBorderWidth + 3)
            break
    }
    // if (!element.status) {
    //     element.status = 'NONE'
    // }

    if (element.type == 'Text') {
        if (!element.contentType) {
            element.contentType = 'Text'
        }
    }

    if (['Text', 'TextTime', 'PageNum'].includes(element.type)) {
        if (!element.option.font) {
            element.option.font = 'default'
        }
        if (!element.option.fontSize) {
            element.option.fontSize = 13
        }
    }

    if (elementTypeLineList.includes(element.type)) {
        if (!element.option.lineHeight) {
            element.option.lineHeight = 0.9
        }
        if (!element.option.color) {
            element.option.color = '#000'
        }
    }

    if (['DottedHorizontalLine', 'DottedVerticalLine']) {
        if (!element.option.dottedStyle) {
            element.option.dottedStyle = 'dashed'
        }
    }

    if (element.width == null) {
        element.width = initWidth
    }
    // debugger
    if (element.height == null) {
        element.height = initHeight
    }

    if (element.option.opacity == null) {
        element.option.opacity = 1
    }
    // 初始化旋转
    if (!element.option.rotate) {
        element.option.rotate = 0
    }
    // rotatedPoint(element)
    if (element.option.padding == null) {
        element.option.padding = {} as Position
    }
    element.runtimeOption.init = {} as Container
    // console.log(appStore().lastPageUnit)
    element.runtimeOption.width = unit2px(element.width)
    element.runtimeOption.height = unit2px(element.height)
    element.runtimeOption.x = unit2px(element.x)
    element.runtimeOption.y = unit2px(element.y)

    element.runtimeOption.init.x = element.runtimeOption.x
    element.runtimeOption.init.y = element.runtimeOption.y
    element.runtimeOption.init.width = element.runtimeOption.width
    element.runtimeOption.init.height = element.runtimeOption.height
    element.runtimeOption.rotate = element.option.rotate
    element.runtimeOption.translate = {x: 0, y: 0}
    if (element.option.margin == null) {
        element.option.margin = {} as Position
    }
}

export function elementGroup(htmlElementList: Array<CpHtmlElement>) {
    const panel = getCurrentPanel()
    const idList = flatIdList(htmlElementList)
    const index = findGroup(idList)

    for (let htmlElementListElement of htmlElementList) {
        htmlElementListElement.element.groupIs = true
    }

    if (index >= 0) {
        panel.groupList[index] = idList
    } else {
        panel.groupList.push(idList)
    }
}

export function groupListToMap(groupList: string[][]) {
    const map = {} as Record<string, number>
    for (let i = 0; i < groupList.length; i++) {
        for (let groupListElement of groupList[i]) {
            map[groupListElement] = i
        }
    }
    return map
}

export function elementUngroup(htmlElementList: Array<CpHtmlElement>) {
    // console.log(htmlElementList)
    const panel = getCurrentPanel()
    const idList = flatIdList(htmlElementList)
    // console.log(idList)
    // console.log(panel.groupList)
    const index = findGroup(idList)

    for (let htmlElementListElement of htmlElementList) {
        htmlElementListElement.element.groupIs = false
    }

    if (index >= 0) {
        panel.groupList.splice(index, 1)
    }
}

export function elementUp(elementList: CpElement[], layer: number) {
    elementList.sort(function (a, b) {
        return a.runtimeOption.index - b.runtimeOption.index
    })

    for (let cpElement of elementList) {
        let newLayer = cpElement.runtimeOption.index - layer
        if (newLayer < 0) {
            newLayer = 0
        }

        const tmp = cpElement.runtimeOption.parent.elementList[cpElement.runtimeOption.index]

        for (let i = cpElement.runtimeOption.index; i > newLayer; i--) {
            console.log(i)
            cpElement.runtimeOption.parent.elementList[i] = cpElement.runtimeOption.parent.elementList[i - 1]
            cpElement.runtimeOption.parent.elementList[i].runtimeOption.index = i
        }
        cpElement.runtimeOption.parent.elementList[newLayer] = tmp
        tmp.runtimeOption.index = newLayer
    }

    nextTick()
        .then(()=>{
            updatePanel()
        })
}

export function elementDown(elementList: CpElement[], layer: number) {

}

function flatIdList(htmlElementList: Array<CpHtmlElement | CpHtmlElement[]>) {
    const idList: string[] = []
    for (let htmlElementListElement of htmlElementList) {
        if (Array.isArray(htmlElementListElement)) {
            for (let htmlElementListElementElement of htmlElementListElement) {
                idList.push(htmlElementListElementElement.element.id)
            }
        } else {
            idList.push(htmlElementListElement.element.id)
        }
    }
    return idList
}

function findGroup(idList: string[]) {
    const panel = getCurrentPanel()
    for (let i = 0; i < panel.groupList.length; i++) {
        const groupListKey = panel.groupList[i]
        if (groupListKey.some(item => {
            return idList.includes(item)
        })) {
            return i;
        }
    }
    return -1;
}

export function clearPanelParent(panel: Panel) {
    clearParent(panel.pageHeader!)
    clearParent(panel.pageFooter!)
    clearListParent(panel.elementList)
}

export function copyElementRefValueId(element: CpElement) {
    element = to(element, reactive({}) as CpElement)
    element.id = crypto.randomUUID()
    return element
}


export function clearListParent(elementList?: Array<CpElement>) {
    for (let element of elementList!) {
        clearParent(element)
        if (element.elementList != null) {
            clearListParent(element.elementList)
        }
    }
}

export function installPanelParentElement(panel: Panel) {
    installParentElement(panel, panel.pageHeader)
    installParentElement(panel, panel.pageFooter)
    installListParentElement(panel, panel.elementList)
}

export function installListParentElement(parent: Container, elementList?: Array<CpElement>) {
    for (let element of elementList!) {
        installParentElement(parent, element)
        if (element.elementList != null) {
            installListParentElement(element, element.elementList)
        }
    }

}

export function installParentElement(parent?: Container, element?: CpElement) {
    if (!element) {
        return
    }
    element.runtimeOption.parent = parent
}

export function clearParent(element: CpElement) {
    if (element.runtimeOption == null || element.runtimeOption.parent == undefined) {
        return
    }
    element.runtimeOption.parent = undefined
}

export function addElement(parent: Container, element: CpElement) {
    if (parent.elementList == null) {
        parent.elementList = []
    }
    parent.elementList.push(element)
    initElement(element, parent.elementList.length)
    installParentElement(parent, element)
}

export function removeElement(element: CpElement) {
    if (element.runtimeOption.parent == null) {
        return
    }
    if (element.runtimeOption.parent.elementList == null) {
        return
    }
    handleElementType(element)
        .handle('PageHeader', () =>
            (element.runtimeOption.parent as Panel).pageHeader = undefined
        )
        .handle('PageFooter', () =>
            (element.runtimeOption.parent as Panel).pageFooter = undefined
        )
        .handle('PrivateDragRectElement', () => {
                const elementList: Array<CpElement> = []

                for (let valueElement of getCurrentPanel().elementList!) {
                    if ('SELECT' == valueElement.status) {
                        elementList.push(valueElement)
                    }
                }

                for (let valueElement of elementList) {
                    arrayRemove(valueElement.runtimeOption.parent!.elementList, valueElement)
                }
                element.x = undefined!
            }
        )
        .end(() => {
            arrayRemove(element.runtimeOption.parent!.elementList, element)
        })
}

export function handleElementType(element: Container) {
    const handleList: any[] = []
    const handlers = {
        handle(type: elementType, callback: () => void) {
            handleList.push(type)
            if (element.type === type) {
                callback();
            }
            return handlers;
        },
        pageHeader(callback: () => void) {
            handleList.push('PageHeader')
            if (isPageHeader(element)) {
                callback();
            }
            return handlers;
        },
        pageFooter(callback: () => void) {
            handleList.push('PageFooter')
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

export function elementCommonPositionStyle(element: CpElement): CSSProperties {
    return {
        // width: element.runtimeOption.width + 'px',
        // left: element.runtimeOption.x + 'px',
        // top: element.runtimeOption.y + 'px',
        // maxWidth: widthValueUnit(element),
        // height: element.runtimeOption.height + 'px',
        // maxHeight: heightValueUnit(element),
        fontFamily: element.option.font,
        fontSize: element.option.fontSize + 'px',
    } as CSSProperties
}

export function elementCommonStyle(element: CpElement, cssStyle?: CSSProperties): CSSProperties {
    if (cssStyle == null) {
        cssStyle = elementCommonPositionStyle(element)
    }
    const option = element.option!
    let textDecoration = ''
    if (option.underline) {
        textDecoration = textDecoration + 'underline '
    }
    if (option.lineThrough) {
        textDecoration = textDecoration + 'line-through '
    }

    option.opacity != null && (cssStyle.opacity = option.opacity)
    option.color && (cssStyle.color = option.color)
    option.background && (cssStyle.background = option.background)
    option.bold && (cssStyle.fontWeight = option.bold ? 'bold' : 'normal')
    textDecoration && (cssStyle.textDecoration = textDecoration)
    option.italic && (cssStyle.fontStyle = option.italic ? 'italic' : 'normal')
    if (option.textAlign) {
        cssStyle.justifyContent = option.textAlign
    }

    if (option.verticalAlign) {
        cssStyle.alignItems = option.verticalAlign
    }

    if (option.borderAll) {
        cssStyle.border = '1px solid white'
        cssStyle.boxSizing = 'border-box'
    }

    return cssStyle
}

export function isPageHeaderFooter(element: Container) {
    return isPageHeader(element) || isPageFooter(element)
}

export function isPageHeader(element: Container) {
    return element != null && element.type == 'PageHeader'
}

export function isPageFooter(element: Container) {
    return element != null && element.type == 'PageFooter'
}

export function isPanel(element: Container) {
    return element.type == 'Panel'
}

export function getMouseOffsetTop(panel: Panel, element: CpElement) {

    const pageHeaderFooter = isPageHeaderFooter(element)

    const parent = element.runtimeOption!.parent as Container
    let top = panelDivPosition.top!
    if (!pageHeaderFooter || !isPageHeaderFooter(parent)) {
        top = top + unit2px(panel!.pageHeader?.height)
    }

    // console.log(parent)
    if (isPanel(parent)) {
        return top
    }
    if (isPageHeader(parent)) {
        return top
    }
    if (isPageFooter(parent)) {
        // console.log(panelDivPosition.top, mm2px(parent.y))
        return top + unit2px(parent.y)
    }
    return top
}

export function getMouseOffsetBottom(panel: Panel, element: CpElement) {

    const pageHeaderFooter = isPageHeaderFooter(element)

    const parent = element.runtimeOption!.parent as Container
    let bottom = panelDivPosition.bottom!
    if (!pageHeaderFooter || !isPageHeaderFooter(parent)) {
        bottom = bottom - unit2px(panel.pageHeader?.height)
    }
    if (isPanel(parent)) {
        return bottom
    }
    if (isPageHeader(parent)) {
        return bottom + unit2px(parent.height)
    }
    if (isPageFooter(parent)) {
        // console.log(panelDivPosition.bottom)
        return bottom
    }
    return bottom
}

export function clearOption(element: CpElement) {
    if (element == null) {
        return
    }
    // delete element.runtimeOption
}

// 返回相对于参考点旋转后的坐标
// export function rotatedPoint(element: CpElement) {
//     const {x, y, width, height} = element
//     const centerX = x! + width / 2;
//     const centerY = y! + height / 2;
//     const rotate = element.option!.rotate ? element.option!.rotate : 0
//     const runtimeOption = element.runtimeOption!
//     // runtimeOption.TL = _rotatedPoint(centerX, centerY, x!, y!, rotate);
//     // runtimeOption.TR = _rotatedPoint(centerX, centerY, x! + width, y!, rotate);
//     // runtimeOption.BL = _rotatedPoint(centerX, centerY, x!, y! + height, rotate);
//     // runtimeOption.BR = _rotatedPoint(centerX, centerY, x! + width, y! + height, rotate);
//
//     runtimeOption.bounds = {
//         top: Math.min(runtimeOption.TL.y!, runtimeOption.TR.y!, runtimeOption.BL.y!, runtimeOption.BR.y!),
//         bottom: Math.max(runtimeOption.TL.y!, runtimeOption.TR.y!, runtimeOption.BL.y!, runtimeOption.BR.y!),
//         left: Math.min(runtimeOption.TL.x!, runtimeOption.TR.x!, runtimeOption.BL.x!, runtimeOption.BR.x!),
//         right: Math.max(runtimeOption.TL.x!, runtimeOption.TR.x!, runtimeOption.BL.x!, runtimeOption.BR.x!)
//     } as Position
// }

// function _rotatedPoint(originX: number, originY: number, offsetX: number, offsetY: number, rotate = 0): Position {
//     const rad = (Math.PI / 180) * rotate;
//     const cos = Math.cos(rad);
//     const sin = Math.sin(rad);
//     let x = offsetX - originX;
//     let y = offsetY - originY;
//     return {
//         x: x * cos - y * sin + originX,
//         y: x * sin + y * cos + originY
//     } as any
// }


// 根据相对坐标返回角度，正方形为顺时针
export function getAngle(x: number, y: number) {
    let theta = Math.atan2(y, x); // 正切转弧度
    theta = Math.round((180 / Math.PI) * theta); // 弧度转角度
    if (theta < 0) theta = 360 + theta; // 控制角度在0~360度
    return theta; // 返回角度
}

export const panelDivPosition = reactive({}) as Position

export function initPanelDiv(panel: Panel, el: HTMLElement) {
    if (!panel.width) {
        return
    }
    // console.log(123)
    // console.log(stringify(panel, 'parent'))
    // console.log(el)
    const rect = el.getBoundingClientRect()
    // console.log(JSON.stringify(rect))
    panelDivPosition.left = rect.left
    panelDivPosition.top = rect.top
    panelDivPosition.right = rect.right
    panelDivPosition.bottom = rect.bottom
}

export function dragLimit(element: CpElement) {
    const {bounds, parent} = element.runtimeOption

    let top = -bounds.top
    let bottom = parent!.height - bounds.bottom

    if (parent!.type == 'Panel') {
        const panel = parent as Panel
        top = -bounds.top + _defaultNum(panel.pageHeader?.height!, 0)
        bottom = parent!.height - bounds.bottom - _defaultNum(panel.pageFooter?.height!, 0)
    }
    return {
        left: -bounds.left,
        right: parent!.width - bounds.right,
        top: top,
        bottom: bottom
    } as Position
}

export function formatter(element: CpElement, variable: FormatterVariable = {}): string {
    if (element.option!.formatter) {
        let contentData = ''
        if (element.type == 'TextTime') {
            const variableNames = extractVariableNames(element.option.formatter)
            if (variableNames == null || variableNames.length == 0) {
                contentData = '不支持的变量'
            } else {
                try {
                    contentData = formatDate(variable.nowDate ? variable.nowDate : new Date(), variableNames[0])
                } catch (e) {
                    contentData = '不支持的变量'
                }
            }
        } else {
            contentData = replaceVariables(element.option.formatter, variable);
        }
        // console.log(contentData)
        return contentData
    }
    return ''
}

export function extractVariableNames(template: string): string[] {
    const regex = /\{\{(.+?)\}\}/g;
    const matches = template.match(regex);
    if (!matches) {
        return []
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

        variables.push({name, defaultValue});
    }

    return variables;
}

export function replaceVariables(str: string, params: { [key: string]: any }): string {
    let result = str;
    const variables = parseVariables(str);

    for (const variable of variables) {
        const {name, defaultValue} = variable;
        const value = params[name] !== undefined ? params[name] : defaultValue;
        result = result.replace(new RegExp(`{{${name}:${defaultValue}}}`, 'g'), value);
    }

    return result;
}

export function selectedElementBatchOperation(callback: (element: CpElement) => void) {
    for (let valueElement of getCurrentPanel().elementList!) {
        if (canMoveStatusList.includes(valueElement.status)) {
            callback(valueElement)
        }
    }
    if (defaultDragRectElement.x != null) {
        callback(defaultDragRectElement)
    }

}

export function changePageSize(val?: any) {
    const panel = getCurrentPanel()
    if (val) {
        panel.width = unit2unit('mm', panel.pageUnit, val.width)
        panel.height = unit2unit('mm', panel.pageUnit, val.height)
    }
    // panel.pageSize = unit2unit('mm', panel.pageUnit,  val.value
    if (panel.pageHeader != null) {
        panel.pageHeader.width = unit2unit('mm', panel.pageUnit, panel.width)
        panel.pageHeader.runtimeOption.width = unit2px(panel.width)
    }
    if (panel.pageFooter != null) {
        panel.pageFooter.width = unit2unit('mm', panel.pageUnit, panel.width)
        panel.pageFooter.y = unit2unit('mm', panel.pageUnit, panel.height - panel.pageFooter.height)
        panel.pageFooter.runtimeOption.width = unit2px(panel.width)
    }
    mitt.emit('pageSize')
}

export function changePageUnit() {
    const panel = getCurrentPanel()
    // console.log(lastPageUnit)
    // console.log(panel.pageUnit)
    panel.width = unit2unit(appStore().lastPageUnit, panel.pageUnit, panel.width)
    panel.height = unit2unit(appStore().lastPageUnit, panel.pageUnit, panel.height)
    const {pageHeader, pageFooter, pageUnit} = panel

    for (let element of panel.elementList!) {
        computedChangePageUnit(pageUnit, element)
    }

    if (pageHeader) {
        computedChangePageUnit(pageUnit, pageHeader)
    }

    if (pageFooter) {
        computedChangePageUnit(pageUnit, pageFooter)
    }

    appStore().lastPageUnit = panel.pageUnit
}

function computedChangePageUnit(pageUnit: PageUnit, element: CpElement) {
    element.x = unit2unit(appStore().lastPageUnit, pageUnit, element.x)
    element.y = unit2unit(appStore().lastPageUnit, pageUnit, element.y)
    element.width = unit2unit(appStore().lastPageUnit, pageUnit, element.width)
    element.height = unit2unit(appStore().lastPageUnit, pageUnit, element.height)
    if (element.option.lineHeight != null) {
        element.option.lineHeight = unit2unit(appStore().lastPageUnit, pageUnit, element.option.lineHeight)
    }

    if (element.elementList) {
        for (let cpElement of element.elementList) {
            computedChangePageUnit(pageUnit, cpElement)
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
    } as Container
}

export function multipleElementGetValue(props: string) {
    const elementList = appStore().currentElement
    if (elementList.length == 0) {
        return undefined
    }

    const firstValue = elementList[0][props]
    for (let currentElementElement of elementList) {
        if (currentElementElement[props] != firstValue) {
            return undefined
        }
    }
    return firstValue
}

export function multipleElementSetValue(props: string, val: any) {

    if (Array.isArray(appStore().currentElement)) {
        for (let currentElementElement of appStore().currentElement as any) {
            currentElementElement[props] = val
        }
    } else {
        appStore().currentElement[props] = val
    }
}

export function newPanel(): Panel {
    return {} as Panel
}
