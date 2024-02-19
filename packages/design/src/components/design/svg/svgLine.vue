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
  controlPointEndDragStart: {} as Point,
  // svg 形状点
  linePoints: [] as Array<Point>,
  allPoint: [] as Array<PointLabel>,
  drawAuxiliary: false
})

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)

initPoint()

function draw() {
  path = d3Path.path() as Path;
  path.moveTo(svgOptions.controlPointLineStart.x, svgOptions.controlPointLineStart.y);
  path.lineTo(svgOptions.controlPointLineEnd.x, svgOptions.controlPointLineEnd.y);
  return path;
}

function initPoint() {
  svgOptions.controlPointLineStart = {x: 0, y: 0, label: "scale"}
  svgOptions.controlPointLineEnd = {x: svgOptions.width, y: svgOptions.height, label: "resize"}
  svgOptions.linePoints = [svgOptions.controlPointLineStart, svgOptions.controlPointLineEnd]
  svgOptions.allPoint = [...svgOptions.linePoints]
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
  const rect = computedShapeBound(svgOptions.linePoints)
  // console.log(rect)
  moveableMove(rect.x + unit2px(props.element.x), rect.y + unit2px(props.element.y))
  moveableResize(rect.width, rect.height)
  
  svgOptions.width = rect.width
  svgOptions.height = rect.height
  // props.element.width = rect.width
  // 偏移svg
  for (let allPointElement of svgOptions.allPoint) {
    allPointElement.x -= rect.x
    allPointElement.y -= rect.y
  }
  
}

</script>

<style scoped>

</style>
