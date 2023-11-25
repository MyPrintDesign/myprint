import {CSSProperties} from "@vue/runtime-dom";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {_defaultNum} from "@cp-print/design/utils/numberUtil";
import {Element} from "@cp-print/design/types/entity";

export function computedStyle(element: Element, type: 'horizontal' | 'vertical', lineStyle: 'dotted' | 'solid' | 'dashed') {
    const style = <CSSProperties>{}
    const lineHeight = _defaultNum(element.option.lineHeight, 0)
    if (type == 'horizontal') {
        style.maxWidth = valueUnit(element.width)
        style.width = valueUnit(element.width)
        style.height = valueUnit(lineHeight)
        style.top = valueUnit((element.height - lineHeight) / 2);
        style.borderTop = `${valueUnit(lineHeight)} ${lineStyle} ${element.option.color}`
    }
    if (type == 'vertical') {
        style.width = valueUnit(lineHeight)
        style.height = valueUnit(element.height)
        style.left = valueUnit((element.width - lineHeight) / 2)
        style.borderLeft = `${valueUnit(lineHeight)} ${lineStyle} ${element.option.color}`
    }

    return style
}
