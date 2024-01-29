import {CpElement} from "../design/src/types/entity";
import {px2unit} from "../design/src/utils/utils";
import {canMoveStatusList} from "../design/src/constants/common";

const alignThreshold = 2
const alignRange = 10

export function computedAlign(point, alignLineDataList, elementList) {
    let element = point.element as CpElement;
    let x = element.x + point.offsetX
    let y = element.y + point.offsetY
    alignLineDataList.value = []

    let computeX = null, computeY = null, tmp = null


    for (let valueElement of elementList) {
        if (canMoveStatusList.includes(valueElement.status)) {
            continue
        }

        let right = x + element.width
        let bottom = y + element.height

        let valueRight = valueElement.x + valueElement.width
        let valueBottom = valueElement.y + valueElement.height

        // 差中心点

        if (computeX == null) {

            tmp = diffX(x, y, bottom, valueElement.x, valueElement.y, valueBottom, 0, alignLineDataList, -px2unit(1))
            computeX = tmp

            tmp = diffX(x, y, bottom, valueRight, valueElement.y, valueBottom, 0, alignLineDataList, -px2unit(1))
            if (computeX == null) computeX = tmp

            tmp = diffX(right, y, bottom, valueElement.x, valueElement.y, valueBottom, element.width, alignLineDataList, 0)
            if (computeX == null) computeX = tmp

            tmp = diffX(right, y, bottom, valueRight, valueElement.y, valueBottom, element.width, alignLineDataList, 0)
            if (computeX == null) computeX = tmp

            // 中心点

            if (computeX != null) {
                point.offsetX = computeX - element.x
            }
        }

        if (computeY == null) {
            tmp = diffY(y, x, right, valueElement.y, valueElement.x, valueRight, 0, alignLineDataList, -px2unit(1))
            computeY = tmp

            tmp = diffY(y, x, right, valueBottom, valueElement.x, valueRight, 0, alignLineDataList, -px2unit(1))
            if (computeY == null) computeY = tmp

            tmp = diffY(bottom, x, right, valueElement.y, valueElement.x, valueRight, element.height, alignLineDataList, 0)
            if (computeY == null) computeY = tmp

            tmp = diffY(bottom, x, right, valueBottom, valueElement.x, valueRight, element.height, alignLineDataList, 0)
            if (computeY == null) computeY = tmp
            if (computeY != null) {
                point.offsetY = computeY - element.y
            }
        }
        // 执行请求

        //
        // if (Math.abs(x - valueElement.x) < alignThreshold) {
        //   x = valueElement.x
        //   alignLineDataList.value.push(buildAlignLineEntity(x, Math.min(y - valueElement.y), 1, 100))
        // } else if (Math.abs(x - valueRight) < alignThreshold) {
        //   x = valueRight
        // } else if (Math.abs(right - valueElement.x) < alignThreshold) {
        //   x = valueElement.x - element.width
        // } else if (Math.abs(right - valueRight) < alignThreshold) {
        //   x = valueRight - element.width
        // }
        //
        // if (Math.abs(y - valueElement.y) < alignThreshold) {
        //   y = valueElement.y
        // } else if (Math.abs(y - (valueBottom)) < alignThreshold) {
        //   y = valueBottom
        // } else if (Math.abs(bottom - (valueElement.y)) < alignThreshold) {
        //   y = valueElement.y - element.height
        // } else if (Math.abs(bottom - (valueBottom)) < alignThreshold) {
        //   y = valueBottom - element.height
        // }
        //
        // 添加对齐辅助线
    }
}

function diffX(x, y, ye, targetX, targetY, targetYe, width, alignLineDataList, offset) {
    if (Math.abs(x - targetX) < alignThreshold) {
        let minY = Math.min(y, ye, targetY, targetYe);
        alignLineDataList.value.push(buildAlignLineEntity(targetX + offset, minY - alignRange, px2unit(1), Math.max(y, ye, targetY, targetYe) - minY + 2 * alignRange, 'VerticalAlignLine'))
        return targetX - width
    }
    return null
}

function diffY(y, x, xe, targetY, targetX, targetXe, height, alignLineDataList, offset) {
    if (Math.abs(y - targetY) < alignThreshold) {
        let minX = Math.min(x, xe, targetX, targetXe);
        alignLineDataList.value.push(buildAlignLineEntity(minX - alignRange, targetY + offset, Math.max(x, xe, targetX, targetXe) - minX + 2 * alignRange, px2unit(1), 'HorizontalAlignLine'))
        return targetY - height
    }
    return null
}


function buildAlignLineEntity(x, y, width, height, type) {
    return {
        x, y, width, height, type
    }
}
