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
import {reactive} from 'vue'

import * as d3Path from "d3-path";
import {Path} from "d3-path";
import {CpElement, PointLabel} from "@cp-print/design/types/entity";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {moveableDragResize} from "@cp-print/design/components/moveable/moveable";
import SvgBase from "@cp-print/design/components/design/svg/svgBase.vue";
import {computedShapeBound} from "@cp-print/design/utils/elementUtil";
import {D3DragEvent} from "@cp-print/design/types/d3Type";
import {stringify} from "@cp-print/design/utils/utils";

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
  // svg 形状点
  linePoints: [] as Array<PointLabel>,
  allPoint: [] as Array<PointLabel>,
  drawAuxiliary: false
})

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)

initPoint()

function draw() {
  path = d3Path.path() as Path
  if (svgOptions.linePoints.length > 1) {
    path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y)
    path.lineTo(svgOptions.linePoints[1].x, svgOptions.linePoints[1].y)
  }
  return path
}

function initPoint() {
  if (props.element.data) {
    const data = JSON.parse(props.element.data);
    svgOptions.linePoints = data.points;
  }
  svgOptions.allPoint = [...svgOptions.linePoints]
}

function dragIng(subject: PointLabel, event: D3DragEvent, dx: number, dy: number) {
  subject.x = event.x + dx;
  subject.y = event.y + dy;
}

function dragEnd() {
  const rect = computedShapeBound(svgOptions.linePoints)
  
  moveableDragResize(rect.x + unit2px(props.element.x), rect.y + unit2px(props.element.y), rect.width, rect.height, props.element)
  
  svgOptions.width = rect.width
  svgOptions.height = rect.height
  // props.element.width = rect.width
  // 偏移svg
  for (let allPointElement of svgOptions.allPoint) {
    allPointElement.x -= rect.x
    allPointElement.y -= rect.y
  }
  
  props.element.data = stringify({points: svgOptions.linePoints})
}

</script>

<style scoped>

</style>
