import {clearEventBubble} from "./event"
import {CpElement, Panel} from "@cp-print/design/types/entity";
import {displayRatio, unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {arrayIndexOf, arrayRemove} from "@cp-print/design/utils/arrays";
// @ts-ignore
import * as mittInit from 'mitt'

let collapsePanelZIndex = 1000

export const mitt = mittInit.default()

export function sortColumn(arr: any, dragData: any, b: any, flag: any) {
    arrayRemove(arr, dragData)
    // console.log(arr)
    let index = arrayIndexOf(arr, b)
    // console.log(index, flag)
    arr.splice(flag ? index : index + 1, 0, dragData)
    for (let i = 0; i < arr.length; i++) {
        arr[i].option.sort = i;
    }
}

export function click(ev: any, realFun: () => void) {
    clearEventBubble(ev)
    realFun()
}

export function parse<T>(str: string, target: T): T {
    let targetObj: any = JSON.parse(str)
    return to(targetObj, target);
}


export function to<T>(targetObj: any, target: T): T {
    // for (let targetObjKey in targetObj) {
    //     target[targetObjKey] = targetObj[targetObjKey]
    // }
    // return target;
    return Object.assign(target as any, targetObj);
}

// export function copyBasicType<T>(sourceObj: any, target: T) {
//     for (let targetObjKey in sourceObj) {
//         let pro = sourceObj[targetObjKey]
//         if (pro instanceof Object) {
//             copyBasicType(pro, target[targetObjKey] )
//             console.log(targetObjKey, 'true')
//         } else {
//             target[targetObjKey] = pro
//         }
//     }
// }

// export function swap<T>(targetObj: any, target: T) {
//     const tmp = {}
//     Object.assign(tmp, target);
//     Object.assign(target, targetObj);
//     Object.assign(targetObj, tmp);
// }

// export function toElement(targetObj: any): Element {
//     let element: Element
//     if (targetObj.type == 'Text') {
//         element = {} as TextElement
//     } else {
//         element = {} as Element
//     }
//
//     Object.assign(element, targetObj);
//     initElement(element)
//
//     return element
// }

// export function initElement(element: Element) {
//
// }

export function trend0(num: number) {
    return num < 0 ? 0 : num
}

export function trend1(num: number) {
    return num < 1 ? 1 : num
}

// console.log(window.devicePixelRatio)

export const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
// 获取绘图上下文
const context = canvas.getContext('2d')!
let image: any

export function dragImg(panel: Panel, element: CpElement, event: DragEvent) {
    // 创建一个新的canvas元素
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = unit2px(_width(element));
    if (element.type == 'PageFooter' || element.type == 'PageHeader') {
        canvas.width = unit2px(panel.width);
    }
    canvas.height = unit2px(_height(element));

// 设置填充颜色
    context.fillStyle = '#f0f2f5';
    // 计算图片相对于鼠标和元素的位置
    const target = event.target as HTMLDivElement
    const offsetX = event.clientX - target.getBoundingClientRect().left;
    const offsetY = event.clientY - target.getBoundingClientRect().top;

// 绘制矩形
    context.fillRect(0, 0, canvas.width, canvas.height);
    // context.fillText('松开放置', 0, 0,100);

    // 添加一个图标
    // context.font = "50px 'iconfont-color'";
    // context.fillStyle = "red";
    // context.fillText("\ue616", 10, 40);

// 创建一个新的Image对象
    image = new Image();

// 当Image对象加载完成后
    image.onload = function () {
        // 在页面上显示绘制的纯色图像
        // 将canvas的数据URL赋值给Image对象的src属性
    };
    image.style.position = 'absolute'
    image.style.left = '-1000px'
    image.style.top = '0'
    image.src = canvas.toDataURL();
    document.body.appendChild(image);

    event.dataTransfer!.setDragImage(image, offsetX, offsetY)
}

export function removeDragImg() {
    document.body.removeChild(image)
}

export function getRatio() {
    return displayRatio
}

export function mm2pxNoScale(mm: number) {
    // 获取每毫米的像素值
    return mm * displayRatio;
}


export function stringify(obj: any, ...ignore: any[]) {
    return JSON.stringify(obj, (key, value) => {
        if (ignore.includes(key)) return undefined
        return value
    })
}

export function getCollapsePanelZIndex(zIndex: number) {
    if (zIndex == collapsePanelZIndex) {
        return zIndex
    }
    return ++collapsePanelZIndex
}

export function rgbaToHex(rgba: string) {
    const rgbaValues = rgba.match(/\d+/g)!
    const r = Math.round(parseInt(rgbaValues[0]));
    const g = Math.round(parseInt(rgbaValues[1]));
    const b = Math.round(parseInt(rgbaValues[2]));

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    let hexA = ''
    if (rgbaValues[3]) {
        hexA = parseFloat(rgbaValues[3]).toString(16).padStart(2, '0');
    }

    return '#' + hexR + hexG + hexB + hexA;
}

let printCssStyleCache: any = undefined

export function printCssStyle() {
    if (printCssStyleCache) {
        return printCssStyleCache
    }

    let cssRuleList = ''
    let styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        let styleSheet = styleSheets[i];
        let cssRules = styleSheet.cssRules || styleSheet.rules;
        let isCss = false
        if (cssRules.length > 3) {
            let selectorText = (cssRules[2] as CSSStyleRule).selectorText
            if (selectorText && selectorText.startsWith('.cp-print-')) {
                // console.log(styleSheet)
                isCss = true
            }
        }

        if (isCss) {
            for (let j = 0; j < cssRules.length; j++) {
                cssRuleList = cssRuleList + cssRules[j].cssText;
                // 处理获取到的样式规则
            }
            return printCssStyleCache = cssRuleList
        }
    }
}

export function download(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName + '.pdf';
    a.style.position = 'fixed';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


export function _width(element: CpElement) {
    if (['DottedVerticalLine', 'VerticalLine'].includes(element.type)) {
        return element.option.borderWidth + 0.6
    }
    return element.width
}

export function _height(element: CpElement) {
    if (['DottedHorizontalLine', 'HorizontalLine'].includes(element.type)) {
        return element.option.borderWidth + 2
    }
    return element.height
}
