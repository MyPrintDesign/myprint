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
import {reactive} from 'vue'

import * as d3Path from "d3-path";
import {CpElement, Line, Point, PointLabel} from "@cp-print/design/types/entity";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {moveableMove, moveableResize} from "@cp-print/design/components/moveable/moveable";
import {Path} from "d3-path";
import SvgBase from "@cp-print/design/components/design/svg/svgBase.vue";
import {computedShapeBound} from "@cp-print/design/utils/elementUtil";
import {bezier3} from "@cp-print/design/utils/bezierUtil";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})

let path: Path

const svgOptions = reactive({
  width: 0,
  height: 0,
  rotateControl: {},
  controlLine: [] as Array<Line>,
  centerPoint: {} as Point,
  controlPointLineStart: {} as PointLabel,
  controlPointLineEnd: {} as PointLabel,
  controlPointList: [] as Array<PointLabel>,
  // svg 形状点
  linePoints: [] as Array<Point>,
  allPoint: [] as Array<PointLabel>,
  drawAuxiliary: false
})

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)
// console.log(svgOptions)
initPoint()

function draw() {
  path = d3Path.path() as Path;
  
  path.moveTo(svgOptions.controlPointLineStart.x, svgOptions.controlPointLineStart.y);
  path.bezierCurveTo(svgOptions.controlPointList[0].x, svgOptions.controlPointList[0].y,
      svgOptions.controlPointList[1].x, svgOptions.controlPointList[1].y,
      svgOptions.controlPointLineEnd.x, svgOptions.controlPointLineEnd.y);
  return path;
}

function initPoint() {
  svgOptions.controlPointLineStart = {x: 0, y: svgOptions.height / 2, label: "scale"}
  svgOptions.controlPointLineEnd = {x: svgOptions.width, y: svgOptions.height / 2, label: "resize"}
  svgOptions.controlPointList = [
    {x: svgOptions.width / 3, y: svgOptions.height, label: "resize"},
    {x: svgOptions.width / 3 * 2, y: 0, label: "resize"},
  ]
  svgOptions.linePoints = [svgOptions.controlPointLineStart, svgOptions.controlPointLineEnd]
  svgOptions.allPoint = [...svgOptions.linePoints, ...svgOptions.controlPointList]
  
  svgOptions.controlLine = [{start: svgOptions.controlPointLineStart, end: svgOptions.controlPointList[0]},
    {start: svgOptions.controlPointLineEnd, end: svgOptions.controlPointList[1]}]
}

function dragStart() {

}

function dragIng(subject, event, dx, dy) {
  if (subject.label) {
    subject.x = event.x + dx;
    subject.y = event.y + dy;
  }
}

function dragEnd() {
  const bezierProperties = bezier3(svgOptions.allPoint[0], svgOptions.allPoint[2], svgOptions.allPoint[3], svgOptions.allPoint[1])
  // console.log(bezierProperties)
  // console.log("Bezier curve height: " + bezierProperties.height);
  // console.log("Lowest point on Bezier curve: " + bezierProperties.minY);
  // console.log("Highest point on Bezier curve: " + bezierProperties.maxY);
  const rect = computedShapeBound(svgOptions.linePoints)
  // console.log(rect)
  moveableMove(bezierProperties.x + unit2px(props.element.x), bezierProperties.y + unit2px(props.element.y))
  moveableResize(bezierProperties.width, bezierProperties.height)
  
  svgOptions.width = rect.width
  svgOptions.height = rect.height
  // props.element.width = rect.width
  // 偏移svg
  for (let allPointElement of svgOptions.allPoint) {
    allPointElement.x -= bezierProperties.x
    allPointElement.y -= bezierProperties.y
  }
}

</script>

<style scoped>

</style>
