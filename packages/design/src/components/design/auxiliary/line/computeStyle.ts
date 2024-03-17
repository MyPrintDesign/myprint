import {CSSProperties} from "vue";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {_defaultNum} from "@cp-print/design/utils/numberUtil";
import {CpElement} from "@cp-print/design/types/entity";

export function computedStyle(element: CpElement, type: 'horizontal' | 'vertical', lineStyle: 'dotted' | 'solid' | 'dashed') {
    const style = <CSSProperties>{}
    const lineHeight = _defaultNum(element.option.lineWidth, 0)
    if (type == 'horizontal') {
        style.maxWidth = valueUnit(element.width)
        style.width = valueUnit(element.width)
        style.height = valueUnit(lineHeight)
        style.top = 0
        style.borderTop = `${valueUnit(lineHeight)} ${lineStyle} ${element.option.color}`
    }
    if (type == 'vertical') {
        style.width = valueUnit(lineHeight)
        style.height = valueUnit(element.height)
        style.left = 0
        style.borderLeft = `${valueUnit(lineHeight)} ${lineStyle} ${element.option.color}`
    }

    return style
}
