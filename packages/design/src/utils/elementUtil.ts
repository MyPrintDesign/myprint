import {
    Container, DisplayModel,
    Element,
    ElementOption,
    ElementRelation,
    elementType, FormatterVariable, PageUnit,
    Panel,
    Position,
    RuntimeElementOption
} from "@cp-print/design/types/entity";
import {
    canMoveStatusList,
    defaultDragRectElement,
    defaultElement,
    handleConstantsType
} from "@cp-print/design/constants/common";
import {to} from "./utils";
import {_defaultNum} from "@cp-print/design/utils/numberUtil";
import {reactive, ref, CSSProperties, Ref} from "vue";
import {formatDate} from "./timeUtil";
import numberUtil from "./numberUtil";
import {px2unit, unit2px, unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {arrayRemove} from "@cp-print/design/utils/arrays";

let currentPanel: Panel = {} as Panel
let currentElement = ref(defaultElement as Element)
let runtime = {
    displayModel: 'design' as DisplayModel
};
export let lastPageUnit = 'px' as PageUnit

export function displayModel(displayModel?: DisplayModel) {
    if (displayModel) {
        runtime.displayModel = displayModel
    }
    return runtime.displayModel
}

export function displayModelPreview() {
    return runtime.displayModel == 'preview'
}


export function setCurrentPanel(panel: Panel) {
    currentPanel = panel
    lastPageUnit = currentPanel.pageUnit
}

export function getCurrentPanel(): Panel {
    return currentPanel
}

export function setCurrentElement(element: Element) {
    currentElement.value = element
}

export function getCurrentElement(): Ref<Element> {
    return currentElement
}

export function valueUnit(value: number) {
    return value + getCurrentPanel().pageUnit
}

export function widthValueUnit(element: Element) {
    return element.runtimeOption.workEnvironment == 'Table' ? '100%' : (element.width + getCurrentPanel().pageUnit)
}

export function heightValueUnit(element: Element) {
    return element.runtimeOption.workEnvironment == 'Table' ? '100%' : (element.height + getCurrentPanel().pageUnit)
}

export function width(element: Element) {
    if (['DottedVerticalLine', 'VerticalLine'].includes(element.type)) {
        return element.option.borderWidth + 0.6
    }
    return element.width
}

export function height(element: Element) {
    if (['DottedHorizontalLine', 'HorizontalLine'].includes(element.type)) {
        return element.option.borderWidth + 2
    }
    return element.height
}

export function aspectRatioHeight(element: Element) {
    if (element.option.aspectRatio!) {
        return element.width / element.option.aspectRatio
    }
    return element.height
}

export function handleAspectRatioHeight(element: Element) {
    if (element.option.aspectRatio!) {
        element.height = element.width / element.option.aspectRatio
    }
}

export function clearPanel(panel: Panel) {
    panel.pageHeader = null
    panel.pageFooter = null
    panel.elementList = []
}

export function getTranslate(element: Element) {
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

export function none(element: Element) {
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
    selectElementList(currentPanel.elementList)
}

export function selectElementList(elementList: Array<Container>) {
    for (let element of elementList) {
        select(element)
        if (element.elementList && element.elementList.length > 0) {
            selectElementList(element.elementList)
        }
    }
}

export function select(element: Container) {
    element.status = 'SELECT'
}

export function selectRemove(element: Container) {
    element.status = 'SELECT_REMOVE'
}

export function handle(element: Container) {
    element.status = 'HANDLE'
}

export function computedHandles(element: Container): Array<handleConstantsType> {
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

export function computeTranslate(element: Element) {
    // complete 更改位置
    if (element.translateX != null) {
        element.x = numberUtil.sum(element.x, element.translateX)
        element.translateX = null
    }

    if (element.translateY != null) {
        element.y = numberUtil.sum(element.y, element.translateY)
        element.translateY = null
    }
}

export function disableHandleList(element: Element) {
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

export function parentInitElement(parent: ElementRelation, element: Element) {
    initElement(element)
    installParentElement(parent, element)
    if (element?.elementList?.length > 0) {
        for (let elementTmp of element.elementList) {
            parentInitElement(element, elementTmp);
        }
    }
}

export function initElement(element: Element) {
    if (element == null) {
        return
    }

    if (element.option == null) {
        element.option = {} as ElementOption
    }
    if (element.runtimeOption == null) {
        element.runtimeOption = {} as RuntimeElementOption
    }

    element.id = crypto.randomUUID()
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
            const rowList = []
            for (let i = 0; i < element.columnList.length; i++) {
                initElement(element.columnList[i])
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
    if (!element.status) {
        element.status = 'NONE'
    }

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


    if (['HorizontalLine', 'DottedHorizontalLine', 'VerticalLine', 'DottedVerticalLine'].includes(element.type)) {
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
    rotatedPoint(element)
    if (element.option.padding == null) {
        element.option.padding = {} as Position
    }

    if (element.option.margin == null) {
        element.option.margin = {} as Position
    }
}


export function clearPanelParent(panel: Panel) {
    clearParent(panel.pageHeader)
    clearParent(panel.pageFooter)
    clearListParent(panel.elementList)
}

export function copyElementRefValueId(element: Element) {
    element = to(element, reactive<Element>({}))
    element.id = crypto.randomUUID()
    return element
}


export function clearListParent(elementList: Array<Element>) {
    for (let element of elementList) {
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

export function installListParentElement(parent: ElementRelation, elementList: Array<Element>) {
    for (let element of elementList) {
        installParentElement(parent, element)
        if (element.elementList != null) {
            installListParentElement(element, element.elementList)
        }
    }

}

export function installParentElement(parent: ElementRelation, element: Element) {
    if (!element) {
        return
    }
    element.runtimeOption.parent = parent
}

export function clearParent(element: Element) {
    if (element.runtimeOption == null || element.runtimeOption.parent == null) {
        return
    }
    element.runtimeOption.parent = null
}

export function addElement(parent: ElementRelation, element: Element) {
    if (parent.elementList == null) {
        parent.elementList = []
    }
    parent.elementList.push(element)
    initElement(element)
    installParentElement(parent, element)
}

export function removeElement(element: Element) {
    if (element.runtimeOption.parent == null) {
        return
    }
    if (element.runtimeOption.parent.elementList == null) {
        return
    }
    handleElementType(element)
        .handle('PageHeader', () =>
            (element.runtimeOption.parent as Panel).pageHeader = null
        )
        .handle('PageFooter', () =>
            (element.runtimeOption.parent as Panel).pageFooter = null
        )
        .handle('PrivateDragRectElement', () => {
                const elementList = []

                for (let valueElement of getCurrentPanel().elementList) {
                    if ('SELECT' == valueElement.status) {
                        elementList.push(valueElement)
                    }
                }

                for (let valueElement of elementList) {
                    arrayRemove(valueElement.runtimeOption.parent.elementList, valueElement)
                }
                element.x = null
            }
        )
        .end(() => {
            arrayRemove(element.runtimeOption.parent.elementList, element)
        })
}

export function handleElementType(element: Container) {
    const handleList = []
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
            console.log(handleList)
            if (!handleList.includes(element.type)) {
                callback();
            }
        }
    };

    return handlers;
}

export function elementCommonPositionStyle(element: Element): CSSProperties {
    return {
        width: widthValueUnit(element),
        maxWidth: widthValueUnit(element),
        height: heightValueUnit(element),
        maxHeight: heightValueUnit(element),
        fontFamily: element.option.font,
        fontSize: element.option.fontSize + 'px',
    } as CSSProperties
}

export function elementCommonStyle(element: Element, cssStyle?: CSSProperties): CSSProperties {
    if (cssStyle == null) {
        cssStyle = elementCommonPositionStyle(element)
    }

    let textDecoration = ''
    if (element.option.underline) {
        textDecoration = textDecoration + 'underline '
    }
    if (element.option.lineThrough) {
        textDecoration = textDecoration + 'line-through '
    }

    element.option.opacity != null && (cssStyle.opacity = element.option.opacity)
    element.option.color && (cssStyle.color = element.option.color)
    element.option.background && (cssStyle.background = element.option.background)
    element.option.bold && (cssStyle.fontWeight = element.option.bold ? 'bold' : 'normal')
    textDecoration && (cssStyle.textDecoration = textDecoration)
    element.option.italic && (cssStyle.fontStyle = element.option.italic ? 'italic' : 'normal')
    if (element.option.textAlign) {
        cssStyle.justifyContent = element.option.textAlign
    }

    if (element.option.verticalAlign) {
        cssStyle.alignItems = element.option.verticalAlign
    }

    if (element.option.borderAll) {
        cssStyle.border = '1px solid #771082'
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

export function getMouseOffsetTop(panel: Panel, element: Element) {

    const pageHeaderFooter = isPageHeaderFooter(element)

    const parent = element.runtimeOption.parent as Container
    let top = panelDivPosition.top
    if (!pageHeaderFooter || !isPageHeaderFooter(parent)) {
        top = top + unit2px(panel.pageHeader?.height)
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

export function getMouseOffsetBottom(panel: Panel, element: Element) {

    const pageHeaderFooter = isPageHeaderFooter(element)

    const parent = element.runtimeOption.parent as Container
    let bottom = panelDivPosition.bottom
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

export function clearOption(element: Element) {
    if (element == null) {
        return
    }
    // delete element.runtimeOption
}

// 返回相对于参考点旋转后的坐标
export function rotatedPoint(element: Element) {
    const {x, y, width, height} = element
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const rotate = element.option.rotate ? element.option.rotate : 0

    element.runtimeOption.TL = _rotatedPoint(centerX, centerY, x, y, rotate);
    element.runtimeOption.TR = _rotatedPoint(centerX, centerY, x + width, y, rotate);
    element.runtimeOption.BL = _rotatedPoint(centerX, centerY, x, y + height, rotate);
    element.runtimeOption.BR = _rotatedPoint(centerX, centerY, x + width, y + height, rotate);

    element.runtimeOption.bounds = {
        top: Math.min(element.runtimeOption.TL.y, element.runtimeOption.TR.y, element.runtimeOption.BL.y, element.runtimeOption.BR.y),
        bottom: Math.max(element.runtimeOption.TL.y, element.runtimeOption.TR.y, element.runtimeOption.BL.y, element.runtimeOption.BR.y),
        left: Math.min(element.runtimeOption.TL.x, element.runtimeOption.TR.x, element.runtimeOption.BL.x, element.runtimeOption.BR.x),
        right: Math.max(element.runtimeOption.TL.x, element.runtimeOption.TR.x, element.runtimeOption.BL.x, element.runtimeOption.BR.x)
    } as Position
}

function _rotatedPoint(originX, originY, offsetX, offsetY, rotate = 0): Position {
    const rad = (Math.PI / 180) * rotate;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    let x = offsetX - originX;
    let y = offsetY - originY;
    return {
        x: x * cos - y * sin + originX,
        y: x * sin + y * cos + originY
    }
}


// 根据相对坐标返回角度，正方形为顺时针
export function getAngle(x: number, y: number) {
    let theta = Math.atan2(y, x); // 正切转弧度
    theta = Math.round((180 / Math.PI) * theta); // 弧度转角度
    if (theta < 0) theta = 360 + theta; // 控制角度在0~360度
    return theta; // 返回角度
}

export const panelDivPosition = reactive({}) as Position

export function initPanelDiv(panel: Panel, el) {
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

export function dragLimit(element: Element) {
    const {bounds, parent} = element.runtimeOption
    let top = -bounds.top
    let bottom = parent.height - bounds.bottom

    if (parent.type == 'Panel') {
        const panel = parent as Panel
        top = -bounds.top + _defaultNum(panel.pageHeader?.height, 0)
        bottom = parent.height - bounds.bottom - _defaultNum(panel.pageFooter?.height, 0)
    }
    return {
        left: -bounds.left,
        right: parent.width - bounds.right,
        top: top,
        bottom: bottom
    }
}

export function formatter(element: Element, variable: FormatterVariable = {}): string {
    if (element.option.formatter) {
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
}

export function extractVariableNames(template: string): string[] {
    const regex = /\{\{(.+?)\}\}/g;
    const matches = template.match(regex);
    if (!matches) {
        return null
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

export function selectedElementBatchOperation(callback: (element: Element) => void) {
    for (let valueElement of currentPanel.elementList) {
        if (canMoveStatusList.includes(valueElement.status)) {
            callback(valueElement)
        }
    }
    if (defaultDragRectElement.x != null) {
        callback(defaultDragRectElement)
    }

}

export function changePageSize(val) {
    const panel = getCurrentPanel()
    panel.width = unit2unit('mm', panel.pageUnit, val.width)
    panel.height = unit2unit('mm', panel.pageUnit, val.height)
    // panel.pageSize = unit2unit('mm', panel.pageUnit,  val.value
    if (panel.pageHeader != null) {
        panel.pageHeader.width = unit2unit('mm', panel.pageUnit, panel.width)
    }
    if (panel.pageFooter != null) {
        panel.pageFooter.width = unit2unit('mm', panel.pageUnit, panel.width)
        panel.pageFooter.y = unit2unit('mm', panel.pageUnit, panel.height - panel.pageFooter.height)
    }
}

export function changePageUnit() {
    const panel = getCurrentPanel()
    // console.log(lastPageUnit)
    // console.log(panel.pageUnit)
    panel.width = unit2unit(lastPageUnit, panel.pageUnit, panel.width)
    panel.height = unit2unit(lastPageUnit, panel.pageUnit, panel.height)
    for (let element of panel.elementList) {
        element.x = unit2unit(lastPageUnit, panel.pageUnit, element.x)
        element.y = unit2unit(lastPageUnit, panel.pageUnit, element.y)
        element.width = unit2unit(lastPageUnit, panel.pageUnit, element.width)
        element.height = unit2unit(lastPageUnit, panel.pageUnit, element.height)
        if (element.option.lineHeight != null) {
            element.option.lineHeight = unit2unit(lastPageUnit, panel.pageUnit, element.option.lineHeight)
        }
    }
    lastPageUnit = panel.pageUnit
}


