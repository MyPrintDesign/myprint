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
import { reactive } from 'vue-demi';

import * as d3Path from 'd3-path';
import { Path } from 'd3-path';
import { Line, MyElement, Point, PointLabel } from '@myprint/design/types/entity';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { moveableDragOffsetResize } from '@myprint/design/plugins/moveable/moveable';
import SvgBase from '@myprint/design/components/design/svg/svg-base.vue';
import { bezier2 } from '@myprint/design/utils/bezierUtil';
import { stringify } from '@myprint/design/utils/utils';
import { getRecursionParentPanel } from '@myprint/design/utils/elementUtil';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

let path: Path;

const svgOptions = reactive({
    width: 0,
    height: 0,
    rotateControl: {},
    controlLine: [] as Array<Line>,
    centerPoint: {} as Point,
    // controlPointLineStart: {} as PointLabel,
    // controlPointLineEnd: {} as PointLabel,
    controlPoint: {} as PointLabel,
    // svg 形状点
    linePoints: [] as PointLabel[],
    allPoint: [] as Array<PointLabel>,
    drawAuxiliary: false
});

svgOptions.width = unit2px(props.element.width, getRecursionParentPanel(props.element));
svgOptions.height = unit2px(props.element.height, getRecursionParentPanel(props.element));
// console.log(svgOptions)
initPoint();

function draw() {
    // console.log('draw', svgOptions.controlPointLineEnd.x)
    path = d3Path.path() as Path;
    
    path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y);
    path.quadraticCurveTo(svgOptions.controlPoint.x, svgOptions.controlPoint.y, svgOptions.linePoints[1].x, svgOptions.linePoints[1].y);
    return path;
}

function initPoint() {
    const data = JSON.parse(props.element.data);
    svgOptions.linePoints = data.points;
    svgOptions.controlPoint = data.controlPoints[0];
    svgOptions.controlPoint.type = 'control';
    svgOptions.allPoint = [...svgOptions.linePoints, svgOptions.controlPoint];
    
    svgOptions.controlLine = [{ start: svgOptions.linePoints[0], end: svgOptions.controlPoint },
        { start: svgOptions.linePoints[1], end: svgOptions.controlPoint }];
}

function dragStart() {

}

function dragIng(subject: PointLabel, event, dx, dy) {
    // if (subject.type == 'control') {
    subject.x = event.x + dx;
    subject.y = event.y + dy;
    // }
}

function dragEnd() {
    const bezierProperties = bezier2(svgOptions.allPoint[0], svgOptions.allPoint[2], svgOptions.allPoint[1]);
    // console.log(bezierProperties)
    // console.log("Bezier curve height: " + bezierProperties.height);
    // console.log("Lowest point on Bezier curve: " + bezierProperties.minY);
    // console.log("Highest point on Bezier curve: " + bezierProperties.maxY);
    // const rect = computedShapeBound(svgOptions.linePoints)
    moveableDragOffsetResize(bezierProperties.x, bezierProperties.y, bezierProperties.width, bezierProperties.height, props.element);
    
    svgOptions.width = bezierProperties.width;
    svgOptions.height = bezierProperties.height;
    // props.element.width = rect.width
    // 偏移svg
    for (let allPointElement of svgOptions.allPoint) {
        allPointElement.x -= bezierProperties.x;
        allPointElement.y -= bezierProperties.y;
    }
    
    props.element.data = stringify({ points: svgOptions.linePoints, controlPoints: [svgOptions.controlPoint] }, 'type');
}

</script>
