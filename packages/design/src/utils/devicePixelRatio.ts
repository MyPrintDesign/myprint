import numberUtil from '@myprint/design/utils/numberUtil';
import { PageUnit, Panel } from '@myprint/design/types/entity';
import { getCurrentPanelUnit } from '@myprint/design/utils/elementUtil';

export let displayRatio = 3;
const unitConvert = {
    px: {
        mm: { ratio: displayRatio, compute: 'div' },
        cm: { ratio: displayRatio * 10, compute: 'div' }
    },
    mm: {
        px: { ratio: displayRatio, compute: 'mul' },
        cm: { ratio: 10, compute: 'div' }
    }
} as any;

export function initDisplayRatio() {
    let mmDiv = document.createElement('div');
    let body = document.querySelector('body')!;
    mmDiv.id = 'mm';
    mmDiv.style.width = '1mm';
    mmDiv.className = 'scrollbar-measure';
    body.appendChild(mmDiv);
// 原生方法获取浏览器对元素的计算值
    let mmDivRect = mmDiv.getBoundingClientRect();
    displayRatio = numberUtil.ceil(mmDivRect.width);
    body.removeChild(mmDiv);

    unitConvert.px = {
        mm: { ratio: displayRatio, compute: 'div' },
        cm: { ratio: displayRatio * 10, compute: 'div' }
    };
    unitConvert.mm = {
        px: { ratio: displayRatio, compute: 'mul' },
        cm: { ratio: 10, compute: 'div' }
    };
}

export function px2unit(val: number, panel?: Panel): number {
    // 获取每毫米的像素值
    return unit2unit('px', getCurrentPanelUnit(panel), val);
}

export function unit2px(val: number | undefined, panel?: Panel) {
    if (isNaN(val!)) {
        return 0;
    }
    // 获取每毫米的像素值
    return unit2unit(getCurrentPanelUnit(panel), 'px', val);
}

export function unit2unit(oldUnit: PageUnit, newUnit: PageUnit, val: number | undefined): number {
    if (val == null) {
        return 0;
    }
    if (isNaN(val)) {
        return 0;
    }
    if (oldUnit === newUnit) {
        return val;
    }
    let convert = unitConvert[oldUnit]?.[newUnit];
    if (convert != null) {
        if (convert.compute === 'div') {
            return numberUtil.div(val, convert.ratio);
        } else {
            return numberUtil.mul(val, convert.ratio);
        }
    }

    convert = unitConvert[newUnit]?.[oldUnit];
    if (convert.compute === 'div') {
        return numberUtil.mul(val, convert.ratio);
    } else {
        return numberUtil.div(val, convert.ratio);
    }
}


