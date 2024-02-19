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
import {BaseType, Selection} from "d3-selection";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
let startElementPosition
let length

const svgOptions = reactive({
  width: 0,
  height: 0,
  rotateControl: {},
  controlLine: [] as Array<Line>,
  centerPoint: {} as Point,
  controlPointScale: {} as PointLabel,
  controlPointResize: {} as PointLabel,
  controlPointEndDragStart: {} as Point,
  // svg 形状点
  allPoint: [] as Array<PointLabel>,
  // 辅助线点
  r: 1,
  drawAuxiliary: false
})

function draw(chart: Selection<BaseType, any, BaseType, any>) {
  let path: Path = d3Path.path() as Path;
  path.moveTo(svgOptions.r + svgOptions.centerPoint.x, svgOptions.centerPoint.x);
  path.arc(svgOptions.centerPoint.x, svgOptions.centerPoint.x, svgOptions.r, 0, Math.PI * 2);
  return path;
}

function initPoint() {
  svgOptions.controlPointEndDragStart = {...svgOptions.controlPointScale}
  
  svgOptions.centerPoint = {x: svgOptions.width / 2, y: svgOptions.height / 2}
  svgOptions.controlPointScale = {x: svgOptions.width, y: svgOptions.height / 2, label: "scale"}
  svgOptions.controlPointResize = {x: svgOptions.width, y: svgOptions.height, label: "resize"}
  svgOptions.allPoint = [svgOptions.controlPointScale, svgOptions.controlPointResize]
  svgOptions.controlLine = [{start: svgOptions.centerPoint, end: svgOptions.controlPointScale}, {
    start: {x: 0, y: 0},
    end: svgOptions.controlPointResize
  }]
  
  svgOptions.r = svgOptions.width / 2
}

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)
// console.log('width', svgOptions.width, 'height', svgOptions.height)

initPoint()

function dragStart(subject) {
  if (subject.label != null) {
    
    startElementPosition = {x: unit2px(props.element.x), y: unit2px(props.element.y)}
    length = svgOptions.controlPointScale.x
    
  }
  svgOptions.controlPointEndDragStart = {...svgOptions.controlPointScale}
}

function dragIng(subject, event, dx, dy) {
  if (subject) {
    
    if (subject.label == 'scale') {
      subject.x = event.x + dx;
      const diffX = svgOptions.controlPointScale.x - svgOptions.centerPoint.x
      svgOptions.r = diffX
      // console.log(diffX)
      
      svgOptions.controlPointResize.x = subject.x
      svgOptions.controlPointResize.y = subject.x
      // const nL = svgOptions.r * 2
      
      // svgOptions.controlLineStart.x = diffX
      // svgOptions.controlLineStart.y = diffX
      // moveableMove((length - nL) / 2 + startElementPosition.x, (length - nL) / 2 + startElementPosition.y)
      // moveableResize(nL, nL)
      
    } else {
      subject.x = event.x + dx;
      subject.y = subject.x;
      
      const diffX = svgOptions.controlPointResize.x / 2
      svgOptions.r = diffX
      
      svgOptions.centerPoint.x = diffX
      svgOptions.centerPoint.y = diffX
      svgOptions.controlPointScale.x = diffX * 2
      svgOptions.controlPointScale.y = diffX
      moveableResize(svgOptions.r * 2, svgOptions.r * 2)
    }
  }
}

function dragEnd(subject) {
  if (subject && subject.label == 'scale') {
    const nL = svgOptions.r * 2
    
    svgOptions.centerPoint.x = svgOptions.r
    svgOptions.centerPoint.y = svgOptions.r
    console.log((length - nL) + startElementPosition.x, (length - nL) + startElementPosition.y)
    moveableMove((length - nL) / 2 + startElementPosition.x, (length - nL) / 2 + startElementPosition.y)
    moveableResize(nL, nL)
    
    svgOptions.controlPointScale.x = svgOptions.r * 2
    svgOptions.controlPointScale.y = svgOptions.r
    
    svgOptions.controlPointResize.x = subject.x
    svgOptions.controlPointResize.y = subject.x
  }
}

</script>
