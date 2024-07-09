<template>
    <svg-base
        :element="element"
        :svgOptions="svgOptions"
        :draw="draw"
        :dragStart="dragStart"
        :dragIng="dragIng"
        :dragEnd="dragEnd"
        :doubleClick="doubleClick"
    />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import * as d3Path from 'd3-path';
import { Path } from 'd3-path';
import { Line, MyElement, PointLabel } from '../../../types/entity';
import { unit2px } from '../../../utils/devicePixelRatio';
import { computeLineAngle, rotatePoint } from '../../../utils/svgUtil';
import { computedShapeBound } from '../../../utils/elementUtil';
import { moveableDragOffsetResize } from '../../../plugins/moveable/moveable';
import SvgBase from '../../../components/design/svg/svg-base.vue';
import { D3DragEvent } from '../../../types/d3Type';
import { stringify } from '../../../utils/utils';
import { arrayRemove } from '../../../utils/arrays';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});
let orgPoint;

const svgOptions = reactive({
    width: 0,
    height: 0,
    // 辅助线
    controlLine: [] as Array<Line>,
    rotateLineStart: {} as PointLabel,
    rotateLineEnd: {} as PointLabel,
    rotateLineEndDragPoint: {} as PointLabel,
    // svg 形状点
    linePoints: [] as PointLabel[],
    // svg 形状点(包括控制点)
    allPoint: [] as Array<PointLabel>,
    virtualPoint: [] as Array<PointLabel>
});

svgOptions.width = unit2px(props.element.width);
svgOptions.height = unit2px(props.element.height);

initPoint();

function initPoint() {
    const data = JSON.parse(props.element.data);
    svgOptions.linePoints = data.points;
    svgOptions.rotateLineEndDragPoint = { ...svgOptions.rotateLineEnd };
    
    svgOptions.rotateLineStart = { x: svgOptions.width / 2, y: svgOptions.height / 2 } as PointLabel;
    svgOptions.rotateLineEnd = { x: svgOptions.width / 2, y: -20, type: 'rotate' } as PointLabel;
    svgOptions.allPoint = [...svgOptions.linePoints, svgOptions.rotateLineEnd];
    svgOptions.controlLine = [{ start: svgOptions.rotateLineStart, end: svgOptions.rotateLineEnd }];
}

function dragStart(subject: PointLabel) {
    if (subject.type == 'rotate') {
        orgPoint = JSON.parse(JSON.stringify(svgOptions.allPoint));
        svgOptions.rotateLineEndDragPoint = { ...svgOptions.rotateLineEnd };
    }
}

function dragIng(subject: PointLabel, event: D3DragEvent, dx: number, dy: number) {
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
        for (let i = 0; i < svgOptions.allPoint.length; i++) {
            let point = orgPoint[i];
            const po = rotatePoint(centerX, centerY, point.x, point.y, angle);
            // console.log(po)
            svgOptions.allPoint[i].x = po.x;
            svgOptions.allPoint[i].y = po.y;
        }
    }
}

function dragEnd() {
    const rect = computedShapeBound(svgOptions.linePoints);
    
    moveableDragOffsetResize(rect.x, rect.y, rect.width, rect.height, props.element);
    
    svgOptions.width = rect.width;
    svgOptions.height = rect.height;
    // 偏移svg
    for (let allPointElement of svgOptions.allPoint) {
        allPointElement.x -= rect.x;
        allPointElement.y -= rect.y;
    }
    svgOptions.rotateLineStart.x = rect.width / 2;
    svgOptions.rotateLineStart.y = rect.height / 2;
    svgOptions.rotateLineEnd.x = rect.width / 2;
    svgOptions.rotateLineEnd.y = -20;
    
    props.element.data = stringify({ points: svgOptions.linePoints }, 'insertIndex');
}

function doubleClick(subject: PointLabel) {
    arrayRemove(svgOptions.allPoint, subject);
    arrayRemove(svgOptions.linePoints, subject);
    dragEnd();
}

function draw() {
    let path: Path = d3Path.path();
    
    path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y);
    for (let i = 1; i < svgOptions.linePoints.length; i++) {
        path.lineTo(svgOptions.linePoints[i].x, svgOptions.linePoints[i].y);
    }
    path.closePath();
    
    svgOptions.virtualPoint.length = 0;
    
    if (svgOptions.linePoints.length > 1) {
        for (let i = 0; i < svgOptions.linePoints.length - 1; i++) {
            const start = svgOptions.linePoints[i];
            const end = svgOptions.linePoints[i + 1];
            svgOptions.virtualPoint.push(
                {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2,
                    type: 'virtual',
                    insertIndex: i + 1
                }
            );
        }
        
        const start = svgOptions.linePoints[svgOptions.linePoints.length - 1];
        const end = svgOptions.linePoints[0];
        svgOptions.virtualPoint.push(
            {
                x: (start.x + end.x) / 2,
                y: (start.y + end.y) / 2,
                type: 'virtual',
                insertIndex: svgOptions.linePoints.length
            }
        );
    }
    
    return path;
}

</script>
