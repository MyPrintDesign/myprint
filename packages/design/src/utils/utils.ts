import { clearEventBubble } from './event';
import { MyElement, Panel, TableCellElement } from '@myprint/design/types/entity';
import { displayRatio, unit2px } from '@myprint/design/utils/devicePixelRatio';
// import {arrayIndexOf, arrayRemove} from "@myprint/design/utils/arrays";
// @ts-ignore
import * as mittInit from 'mitt';
import { fontList } from '@myprint/design/constants/common';
import { Emitter } from 'mitt';
import { EventTypes } from '@myprint/design/types/eventType';
import { findFromLeftCell } from '@myprint/design/utils/table/dataTable';

let collapsePanelZIndex = 1000;

export const mitt = mittInit.default() as Emitter<EventTypes>;

export function sortColumn(myElement: MyElement, baseColIndex: number, row: number, sourceIndex: number, targetIndex: number) {
    const col = baseColIndex;
    const diffCol = targetIndex - sourceIndex;
    // console.log(col, targetCol);
    // console.log(myElement.tableHeadList, baseColIndex, row, col, targetCol);
    // const source = myElement.tableHeadList[sourceIndex];
    // 删除原来的
    // console.log(myElement.tableHeadList[row]);
    console.log(row, col, diffCol);
    const baseCell = myElement.tableHeadList[row][col];
    const { cell: targetCell, col: targetCol } = findFromLeftCell(myElement.tableHeadList, row, baseColIndex, diffCol)!;
    // console.log(targetCell, targetCol);
    // console.log(baseCell, targetColTmp);
    const colspan = baseCell.colspan;
    const targetColspan = targetCell.colspan;
    // console.log(myElement.tableHeadList);
    changeTableList(myElement.tableHeadList, row, col, targetCol, colspan, targetColspan);
    changeTableList(myElement.tableBodyList, 0, col, targetCol, colspan, targetColspan);
    // console.log(myElement.tableHeadList);

    // myElement.headList.splice(targetIndex, 0, source);

    // for (let bodyRowList of myElement.bodyList) {
    //
    //     const source = bodyRowList[sourceIndex];
    //     bodyRowList.splice(sourceIndex, 1);
    //
    //     bodyRowList.splice(targetIndex, 0, source);
    // }

    // for (let i = 0; i < arr.length; i++) {
    //     console.log(arr[i])
    //     arr[i].option.sort = i;
    // }
}

function changeTableList(list: any[][], row: number, col: number, targetCol: number, colspan: number, targetColspan: number) {

    const cacheSourceCellList: TableCellElement[][] = [];
    for (let i = row; i < list.length; i++) {
        const rowList = list[i];
        const cacheSourceCellListTmp: TableCellElement[] = [];
        for (let j = 0; j < colspan; j++) {
            cacheSourceCellListTmp.push(rowList[col]);
            rowList.splice(col, 1);
        }
        cacheSourceCellList.push(cacheSourceCellListTmp);
    }
    // 新位置插入
    // debugger
    for (let i = row; i < list.length; i++) {
        const rowList = list[i];
        for (let j = 0; j < colspan; j++) {
            const skipColSpan = targetCol > col ? (targetColspan - 1) - (colspan - 1) : 0;
            rowList.splice(targetCol + skipColSpan + j, 0, cacheSourceCellList[i - row][j]);
        }
    }
}

export function click(ev: any, realFun: () => void) {
    clearEventBubble(ev);
    realFun();
}

export function parse<T>(str: string, target: T): T {
    let targetObj: any = JSON.parse(str);
    return to(targetObj, target);
}


export function to<T>(source: any, target: T): T {
    // for (let targetObjKey in targetObj) {
    //     target[targetObjKey] = targetObj[targetObjKey]
    // }
    // return target;
    return Object.assign(target as any, source);
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
    return num < 0 ? 0 : num;
}

export function trend1(num: number) {
    return num < 1 ? 1 : num;
}

// console.log(window.devicePixelRatio)

export const canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
// 获取绘图上下文
const context = canvas.getContext('2d')!;
let image: any;

export function dragImg(panel: Panel, element: MyElement, event: DragEvent) {
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
    const target = event.target as HTMLDivElement;
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
    image.onload = function() {
        // 在页面上显示绘制的纯色图像
        // 将canvas的数据URL赋值给Image对象的src属性
    };
    image.style.position = 'absolute';
    image.style.left = '-1000px';
    image.style.top = '0';
    image.src = canvas.toDataURL();
    document.body.appendChild(image);

    event.dataTransfer!.setDragImage(image, offsetX, offsetY);
}

export function removeDragImg() {
    document.body.removeChild(image);
}

export function getRatio() {
    return displayRatio;
}

export function mm2pxNoScale(mm: number) {
    // 获取每毫米的像素值
    return mm * displayRatio;
}


export function stringify(obj: any, ...ignore: any[]) {
    return JSON.stringify(obj, (key, value) => {
        if (ignore.includes(key)) return undefined;
        return value;
    });
}

export function getCollapsePanelZIndex(zIndex: number) {
    if (zIndex == collapsePanelZIndex) {
        return zIndex;
    }
    return ++collapsePanelZIndex;
}

export function rgbaToHex(rgba: string) {
    const rgbaValues = rgba.match(/\d+/g)!;
    const r = Math.round(parseInt(rgbaValues[0]));
    const g = Math.round(parseInt(rgbaValues[1]));
    const b = Math.round(parseInt(rgbaValues[2]));

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    let hexA = '';
    if (rgbaValues[3]) {
        hexA = parseFloat(rgbaValues[3]).toString(16).padStart(2, '0');
    }

    return '#' + hexR + hexG + hexB + hexA;
}

let printCssStyleCache: any = undefined;

export function printCssStyle() {
    if (printCssStyleCache) {
        return printCssStyleCache;
    }

    let cssRuleList =
        `
    @media print {
        body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }
`;
    let styleSheets = document.styleSheets;
    // console.log(styleSheets)
    for (let i = 0; i < styleSheets.length; i++) {
        let styleSheet = styleSheets[i];
        let cssRules = styleSheet.cssRules || styleSheet.rules;
        // let isCss = false
        for (let j = 0; j < cssRules.length; j++) {
            let cssRule = cssRules[j];
            let selectorText = (cssRule as CSSStyleRule).selectorText;
            if (selectorText && selectorText.startsWith('.my-print-')) {
                // console.log(cssRule.cssText)
                cssRuleList = cssRuleList + cssRule.cssText;
            }
        }
    }
    return printCssStyleCache = cssRuleList;
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


export function _width(element: MyElement) {
    if (['DottedVerticalLine', 'VerticalLine'].includes(element.type)) {
        return element.option.borderWidth + 0.6;
    }
    return element.width;
}

export function _height(element: MyElement) {
    if (['DottedHorizontalLine', 'HorizontalLine'].includes(element.type)) {
        return element.option.borderWidth + 2;
    }
    return element.height;
}


export function getFontFamilyName(val: string) {
    for (let fontListElement of fontList) {
        for (let downList of fontListElement) {
            if (val == downList.value) {
                return downList.label;
            }
        }
    }

    return '默认';
}


export function douglasPeucker(points, epsilon) {
    if (points.length <= 2) {
        return points;
    }

    let dMax = 0;
    let index = 0;

    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
        const d = perpendicularDistance(points[i], points[0], points[end]);

        if (d > dMax) {
            index = i;
            dMax = d;
        }
    }

    if (dMax > epsilon) {
        const firstPart = douglasPeucker(points.slice(0, index + 1), epsilon);
        const secondPart = douglasPeucker(points.slice(index, end + 1), epsilon);

        return firstPart.slice(0, -1).concat(secondPart);
    } else {
        return [points[0], points[end]];
    }
}

function perpendicularDistance(point, lineStart, lineEnd) {
    const [x, y] = point;
    const [startX, startY] = lineStart;
    const [endX, endY] = lineEnd;

    const A = x - startX;
    const B = y - startY;
    const C = endX - startX;
    const D = endY - startY;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = startX;
        yy = startY;
    } else if (param > 1) {
        xx = endX;
        yy = endY;
    } else {
        xx = startX + param * C;
        yy = startY + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}

// 函数类型
export function isFunction(func: any) {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

export function _defaultVal(val, _default) {
    return val ? val : _default;
}

export function n2br(val: any) {
    return typeof val === 'string' ? val.replaceAll('\n', '<br>') : val;
}


export function br2n(val: any) {
    return typeof val === 'string' ? val.replaceAll('<br>', '\n') : val;
}
