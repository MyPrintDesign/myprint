<template>
    <svg-base
        :element="element"
        :svgOptions="svgOptions"
        :draw="draw"
        :changeSize="changeSize" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { MyElement, Point } from '@myprint/design/types/entity'
import { unit2px } from '@myprint/design/utils/devicePixelRatio'
import SvgBase from '@myprint/design/components/design/svg/svg-base.vue'
import { BaseType, Selection } from 'd3-selection'

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
})
let ellipse

const svgOptions = reactive({
    width: 0,
    height: 0,
    rotateControl: {},
    centerPoint: {} as Point,
    drawAuxiliary: false
})

function changeSize() {
    initPoint()
    return true
}

function draw(chart: Selection<BaseType, any, BaseType, any>) {
    if (!ellipse) {
        ellipse = chart.append('ellipse')
    }
    
    ellipse.attr('cx', svgOptions.centerPoint.x) // 设置椭圆中心的 x 坐标
        .attr('cy', svgOptions.centerPoint.y) // 设置椭圆中心的 y 坐标
        .attr('rx', svgOptions.centerPoint.x) // 设置椭圆的 x 轴半径
        .attr('ry', svgOptions.centerPoint.y) // 设置椭圆的 y 轴半径
        .attr('stroke', props.element.option.color ? props.element.option.color : 'black')
        .attr('opacity', props.element.option.opacity != undefined ? props.element.option.opacity : 1)
        .attr('fill', props.element.option.background ? props.element.option.background : 'none') // 设置椭圆的填充颜色
    
}

initPoint()


function initPoint() {
    svgOptions.width = unit2px(props.element.width)
    svgOptions.height = unit2px(props.element.height)
    
    svgOptions.centerPoint = { x: svgOptions.width / 2, y: svgOptions.height / 2 }
}

</script>
