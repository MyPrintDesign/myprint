import numberUtil from "@cp-print/design/utils/numberUtil";
import {PageUnit} from "@cp-print/design/types/entity";
import {useAppStoreHook as appStore} from "@cp-print/design/stores/app";


// import {lastPageUnit} from "@cp-print/design/utils/elementUtil";
let mmDiv = document.createElement("div");
let body = document.querySelector("body")!
mmDiv.id = "mm";
mmDiv.style.width = "1mm";
mmDiv.className = "scrollbar-measure";
body.appendChild(mmDiv);
// 原生方法获取浏览器对元素的计算值
let mmDivRect = mmDiv.getBoundingClientRect();

let scrollbarWidth = mmDiv.offsetWidth - mmDiv.clientWidth;
console.log(scrollbarWidth);

body.removeChild(mmDiv)
// console.log(mm1);
console.log(mmDivRect.width)
const displayRatio = numberUtil.ceil(mmDivRect.width);
console.log(displayRatio)
export {
    displayRatio
}

export function px2unit(val: number): number {
    // 获取每毫米的像素值
    return unit2unit('px', appStore().lastPageUnit, val)
}

export function unit2px(val: number | undefined) {
    if (isNaN(val!)) {
        return 0
    }
    // 获取每毫米的像素值
    return unit2unit(appStore().lastPageUnit, 'px', val)
}

const unitConvert = {
    px: {
        mm: {ratio: displayRatio, compute: 'div'},
        cm: {ratio: displayRatio * 10, compute: 'div'}
    },
    mm: {
        px: {ratio: displayRatio, compute: 'mul'},
        cm: {ratio: 10, compute: 'div'},
    },
} as any;

export function unit2unit(oldUnit: PageUnit, newUnit: PageUnit, val: number | undefined): number {
    if (val == null) {
        return 0
    }
    if (isNaN(val)) {
        return 0
    }
    if (oldUnit === newUnit) {
        return val
    }
    let convert = unitConvert[oldUnit]?.[newUnit]
    if (convert != null) {
        if (convert.compute === 'div') {
            return numberUtil.div(val, convert.ratio)
        } else {
            return numberUtil.mul(val, convert.ratio)
        }
    }

    convert = unitConvert[newUnit]?.[oldUnit]
    if (convert.compute === 'div') {
        return numberUtil.mul(val, convert.ratio)
    } else {
        return numberUtil.div(val, convert.ratio)
    }
}
