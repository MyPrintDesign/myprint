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
import {Path} from "d3-path";
import {MyElement, Line, Point, PointLabel} from "@myprint/design/types/entity";
import {unit2px} from "@myprint/design/utils/devicePixelRatio";
import {moveableDragResize} from "@myprint/design/plugins/moveable/moveable";
import SvgBase from "@myprint/design/components/design/svg/svg-base.vue";
import {bezier3} from "@myprint/design/utils/bezierUtil";
import {stringify} from "@myprint/design/utils/utils";

const props = withDefaults(defineProps<{
  element?: MyElement
}>(), {
  element: () => ({} as MyElement)
})

let path: Path

const svgOptions = reactive({
  width: 0,
  height: 0,
  rotateControl: {},
  controlLine: [] as Array<Line>,
  centerPoint: {} as Point,
  // controlPointLineStart: {} as PointLabel,
  // controlPointLineEnd: {} as PointLabel,
  controlPointList: [] as Array<PointLabel>,
  // svg 形状点
  linePoints: [] as PointLabel[],
  allPoint: [] as Array<PointLabel>,
  drawAuxiliary: false
})

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)
// console.log(svgOptions)
initPoint()

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
  svgOptions.controlPointList = data.controlPoints
  for (let controlPoint of svgOptions.controlPointList) {
    controlPoint.type = 'control'
  }
  
  svgOptions.allPoint = [...svgOptions.linePoints, ...svgOptions.controlPointList]
  
  svgOptions.controlLine = [{start: svgOptions.linePoints[0], end: svgOptions.controlPointList[0]},
    {start: svgOptions.linePoints[1], end: svgOptions.controlPointList[1]}]
}

function dragStart() {

}

function dragIng(subject: PointLabel, event, dx, dy) {
  subject.x = event.x + dx;
  subject.y = event.y + dy;
}

function dragEnd() {
  const bezierProperties = bezier3(svgOptions.allPoint[0], svgOptions.allPoint[2], svgOptions.allPoint[3], svgOptions.allPoint[1])
  // console.log(bezierProperties)
  // console.log("Bezier curve height: " + bezierProperties.height);
  // console.log("Lowest point on Bezier curve: " + bezierProperties.minY);
  // console.log("Highest point on Bezier curve: " + bezierProperties.maxY);
  // const rect = computedShapeBound(svgOptions.linePoints)
  // console.log(bezierProperties)
  moveableDragResize(bezierProperties.x + unit2px(props.element.x), bezierProperties.y + unit2px(props.element.y), bezierProperties.width, bezierProperties.height, props.element)
  
  svgOptions.width = bezierProperties.width
  svgOptions.height = bezierProperties.height
  // props.element.width = rect.width
  // 偏移svg
  for (let allPointElement of svgOptions.allPoint) {
    allPointElement.x -= bezierProperties.x
    allPointElement.y -= bezierProperties.y
  }
  
  props.element.data = stringify({points: svgOptions.linePoints, controlPoints: svgOptions.controlPointList}, "type")
}

</script>
