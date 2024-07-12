<template>
    <svg-base
        :element="element"
        :svgOptions="svgOptions"
        :draw="draw"
        :dragStart="dragStart"
        :dragIng="dragIng"
        :dragEnd="dragEnd"
    />
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import * as d3Path from 'd3-path';
import { Path } from 'd3-path';
import { Line, MyElement, Point, PointLabel } from '@myprint/design/types/entity';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { moveableDragOffsetResize } from '@myprint/design/plugins/moveable/moveable';
import SvgBase from '@myprint/design/components/design/svg/svg-base.vue';
import { bezier3 } from '@myprint/design/utils/bezierUtil';
import { stringify } from '@myprint/design/utils/utils';
import { computeLineAngle, rotatePoint } from '@myprint/design/utils/svgUtil';
import { getParentPanel } from '@myprint/design/utils/elementUtil';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

let path: Path;
let orgPoint;

const svgOptions = reactive({
    width: 0,
    height: 0,
    rotateControl: {},
    centerPoint: {} as Point,
    // 辅助线
    controlLine: [] as Array<Line>,
    
    rotateLineStart: {} as PointLabel,
    rotateLineEnd: {} as PointLabel,
    rotateLineEndDragPoint: {} as PointLabel,
    // controlPointLineStart: {} as PointLabel,
    // controlPointLineEnd: {} as PointLabel,
    controlPointList: [] as Array<PointLabel>,
    // svg 形状点
    linePoints: [] as PointLabel[],
    allPoint: [] as Array<PointLabel>,
    drawAuxiliary: false
});

svgOptions.width = unit2px(props.element.width, getParentPanel(props.element));
svgOptions.height = unit2px(props.element.height, getParentPanel(props.element));
// console.log(svgOptions)
initPoint();

function draw() {
    path = d3Path.path() as Path;
    
    path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y);
    path.bezierCurveTo(svgOptions.controlPointList[0].x, svgOptions.controlPointList[0].y,
        svgOptions.controlPointList[1].x, svgOptions.controlPointList[1].y,
        svgOptions.linePoints[1].x, svgOptions.linePoints[1].y);
    return path;
}

function initPoint() {
    // svgOptions.controlPointLineStart = {x: 0, y: svgOptions.height / 2, label: "scale"}
    // svgOptions.controlPointLineEnd = {x: svgOptions.width, y: svgOptions.height / 2, label: "resize"}
    // svgOptions.controlPointList = [
    //   {x: svgOptions.width / 3, y: svgOptions.height, label: "resize"},
    //   {x: svgOptions.width / 3 * 2, y: 0, label: "resize"},
    // ]
    // svgOptions.linePoints = [svgOptions.controlPointLineStart, svgOptions.controlPointLineEnd]
    
    const data = JSON.parse(props.element.data);
    svgOptions.linePoints = data.points;
    svgOptions.controlPointList = data.controlPoints;
    for (let controlPoint of svgOptions.controlPointList) {
        controlPoint.type = 'control';
    }
    
    svgOptions.rotateLineStart = { x: svgOptions.width / 2, y: svgOptions.height / 2 } as PointLabel;
    svgOptions.rotateLineEnd = { x: svgOptions.width / 2, y: -20, type: 'rotate' } as PointLabel;
    
    svgOptions.allPoint = [...svgOptions.linePoints, ...svgOptions.controlPointList, svgOptions.rotateLineEnd];
    
    svgOptions.controlLine = [{ start: svgOptions.linePoints[0], end: svgOptions.controlPointList[0] },
        { start: svgOptions.linePoints[1], end: svgOptions.controlPointList[1] },
        { start: svgOptions.rotateLineStart, end: svgOptions.rotateLineEnd }];
}

function dragStart(subject: PointLabel) {
    if (subject.type == 'rotate') {
        orgPoint = JSON.parse(JSON.stringify(svgOptions.allPoint));
        svgOptions.rotateLineEndDragPoint = { ...svgOptions.rotateLineEnd };
    }
}

function dragIng(subject: PointLabel, event, dx, dy) {
    subject.x = event.x + dx;
    subject.y = event.y + dy;
    
    if (subject.type == 'rotate') {
        const angle = computeLineAngle({
                start: svgOptions.rotateLineStart,
                end: svgOptions.rotateLineEndDragPoint
            },
            { start: svgOptions.rotateLineStart, end: { x: subject.x, y: subject.y } });
        // console.log(angle)
        const centerX = svgOptions.width / 2;
        const centerY = svgOptions.height / 2;
        for (let i = 0; i < 4; i++) {
            let point = orgPoint[i];
            const po = rotatePoint(centerX, centerY, point.x, point.y, angle);
            // console.log(po)
            svgOptions.allPoint[i].x = po.x;
            svgOptions.allPoint[i].y = po.y;
        }
    }
}

function dragEnd() {
    const bezierProperties = bezier3(svgOptions.allPoint[0], svgOptions.allPoint[2], svgOptions.allPoint[3], svgOptions.allPoint[1]);
    // console.log(bezierProperties)
    // console.log("Bezier curve height: " + bezierProperties.height);
    // console.log("Lowest point on Bezier curve: " + bezierProperties.minY);
    // console.log("Highest point on Bezier curve: " + bezierProperties.maxY);
    // const rect = computedShapeBound(svgOptions.linePoints)
    // console.log(bezierProperties)
    moveableDragOffsetResize(bezierProperties.x, bezierProperties.y, bezierProperties.width, bezierProperties.height, props.element);
    
    svgOptions.width = bezierProperties.width;
    svgOptions.height = bezierProperties.height;
    // props.element.width = rect.width
    // 偏移svg
    for (let allPointElement of svgOptions.allPoint) {
        allPointElement.x -= bezierProperties.x;
        allPointElement.y -= bezierProperties.y;
    }
    
    svgOptions.rotateLineStart.x = bezierProperties.width / 2;
    svgOptions.rotateLineStart.y = bezierProperties.height / 2;
    svgOptions.rotateLineEnd.x = bezierProperties.width / 2;
    svgOptions.rotateLineEnd.y = -20;
    
    props.element.data = stringify({
        points: svgOptions.linePoints,
        controlPoints: svgOptions.controlPointList
    }, 'type');
}

</script>
