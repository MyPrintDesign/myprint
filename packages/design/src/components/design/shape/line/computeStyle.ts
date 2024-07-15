import { CSSProperties } from 'vue';
import { getRecursionParentPanel, valueUnit } from '@myprint/design/utils/elementUtil';
import { _defaultNum } from '@myprint/design/utils/numberUtil';
import { MyElement } from '@myprint/design/types/entity';

export function computedStyle(element: MyElement, type: 'horizontal' | 'vertical' | 'rect', lineStyle: 'dotted' | 'solid' | 'dashed') {
    const style = <CSSProperties>{};
    const panel = getRecursionParentPanel(element);
    const lineHeight = _defaultNum(element.option.lineWidth, 0);
    if (type == 'horizontal') {
        style.maxWidth = valueUnit(element.width, panel);
        style.width = valueUnit(element.width, panel);
        style.height = valueUnit(lineHeight, panel);
        style.top = 0;
        style.borderTop = `${valueUnit(lineHeight, panel)} ${lineStyle} ${element.option.color}`;
    }
    if (type == 'vertical') {
        style.width = valueUnit(lineHeight, panel);
        style.height = valueUnit(element.height, panel);
        style.left = 0;
        style.borderLeft = `${valueUnit(lineHeight, panel)} ${lineStyle} ${element.option.color}`;
    }

    if (type == 'rect') {
        style.width = valueUnit(element.width, panel);
        style.height = valueUnit(element.height, panel);
        style.left = 0;
        style.borderLeft = `${valueUnit(lineHeight, panel)} ${lineStyle} ${element.option.color}`;
    }

    return style;
}
