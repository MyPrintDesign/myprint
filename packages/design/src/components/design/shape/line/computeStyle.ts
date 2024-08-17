import { CSSProperties } from 'vue-demi';
import { getRecursionParentPanel, valueUnit } from '../../../../utils/elementUtil';
import { _defaultNum } from '../../../../utils/numberUtil';
import { MyElement } from '../../../../types/entity';
import { _defaultVal } from '../../../../utils/utils';

export function computedStyle(element: MyElement, type: 'horizontal' | 'vertical' | 'rect', lineStyle: 'dotted' | 'solid' | 'dashed' = 'dashed') {
    const style = <CSSProperties>{};
    const panel = getRecursionParentPanel(element);
    const lineHeight = _defaultNum(element.option.lineWidth, 0);
    const color = _defaultVal(element.option.color, '#000');
    if (type == 'horizontal') {
        style.maxWidth = valueUnit(element.width, panel);
        style.width = valueUnit(element.width, panel);
        style.height = valueUnit(lineHeight, panel);
        style.top = 0;
        style.borderTop = `${valueUnit(lineHeight, panel)} ${lineStyle} ${color}`;
    }
    if (type == 'vertical') {
        style.width = valueUnit(lineHeight, panel);
        style.height = valueUnit(element.height, panel);
        style.left = 0;
        style.borderLeft = `${valueUnit(lineHeight, panel)} ${lineStyle} ${color}`;
    }

    if (type == 'rect') {
        style.width = valueUnit(element.width, panel);
        style.height = valueUnit(element.height, panel);
        style.left = 0;
        style.border = `${valueUnit(lineHeight, panel)} ${lineStyle} ${color}`;
    }
    if (element.option.background) {
        style.background = element.option.background;
    }

    return style;
}
