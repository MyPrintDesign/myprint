<template>
    <svg-base
        :element="element"
        :svgOptions="svgOptions"
        :draw="draw"
        :changeSize="changeSize" />
</template>

<script setup lang="ts">
import { reactive } from 'vue-demi';

import { MyElement, Point } from '@myprint/design/types/entity';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import SvgBase from '@myprint/design/components/design/svg/svg-base.vue';
import { BaseType, Selection } from 'd3-selection';
import { Path } from 'd3-path';
import * as d3Path from 'd3-path';
import { getRecursionParentPanel } from '@myprint/design/utils/elementUtil';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

const svgOptions = reactive({
    width: 0,
    height: 0,
    rotateControl: {},
    centerPoint: {} as Point,
    drawAuxiliary: false
});

function changeSize() {
    initPoint();
    return true;
}

function draw(_chart: Selection<BaseType, any, BaseType, any>) {
    let path: Path = d3Path.path() as Path;
    // console.log(123)
    path.moveTo(svgOptions.centerPoint.x * 2, svgOptions.centerPoint.x);
    path.arc(svgOptions.centerPoint.x, svgOptions.centerPoint.x, svgOptions.centerPoint.x, 0, Math.PI * 2);
    
    return path;
    // ellipse.attr("cx", svgOptions.centerPoint.x) // 设置椭圆中心的 x 坐标
    //     .attr("cy", svgOptions.centerPoint.y) // 设置椭圆中心的 y 坐标
    //     .attr("rx", svgOptions.centerPoint.x) // 设置椭圆的 x 轴半径
    //     .attr("ry", svgOptions.centerPoint.y) // 设置椭圆的 y 轴半径
    //     .attr("fill", "gray"); // 设置椭圆的填充颜色
}

initPoint();


function initPoint() {
    svgOptions.width = unit2px(props.element.width, getRecursionParentPanel(props.element));
    svgOptions.height = unit2px(props.element.height, getRecursionParentPanel(props.element));
    
    svgOptions.centerPoint = { x: svgOptions.width / 2, y: svgOptions.height / 2 };
}

</script>
