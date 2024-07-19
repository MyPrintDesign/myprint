<template>
    <svg-base
        :element="element"
        :svgOptions="svgOptions"
        :draw="draw"
        :dragIng="dragIng"
        :dragEnd="dragEnd"
    />
</template>

<script setup lang="ts">
import { reactive } from 'vue-demi';

import * as d3Path from 'd3-path';
import { Path } from 'd3-path';
import { MyElement, PointLabel } from '@myprint/design/types/entity';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { moveableDragOffsetResize } from '@myprint/design/plugins/moveable/moveable';
import SvgBase from '@myprint/design/components/design/svg/svg-base.vue';
import { computedShapeBound, getRecursionParentPanel } from '@myprint/design/utils/elementUtil';
import { D3DragEvent } from '@myprint/design/types/d3Type';
import { stringify } from '@myprint/design/utils/utils';

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
    // svg 形状点
    linePoints: [] as Array<PointLabel>,
    allPoint: [] as Array<PointLabel>,
    drawAuxiliary: false
});

svgOptions.width = unit2px(props.element.width, getRecursionParentPanel(props.element));
svgOptions.height = unit2px(props.element.height, getRecursionParentPanel(props.element));

initPoint();

function draw() {
    path = d3Path.path() as Path;
    if (svgOptions.linePoints.length > 1) {
        path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y);
        path.lineTo(svgOptions.linePoints[1].x, svgOptions.linePoints[1].y);
    }
    return path;
}

function initPoint() {
    if (props.element.data) {
        const data = JSON.parse(props.element.data);
        svgOptions.linePoints = data.points;
    }
    svgOptions.allPoint = [...svgOptions.linePoints];
}

function dragIng(subject: PointLabel, event: D3DragEvent, dx: number, dy: number) {
    subject.x = event.x + dx;
    subject.y = event.y + dy;
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
    
    props.element.data = stringify({ points: svgOptions.linePoints });
}

</script>

<style scoped>

</style>
