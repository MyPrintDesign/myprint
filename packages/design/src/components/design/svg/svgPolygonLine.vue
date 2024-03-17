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
import {CpElement, Line, Point, PointLabel} from "@cp-print/design/types/entity";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {computeLineAngle, rotatePoint} from "@cp-print/design/utils/svgUtil";
import {computedShapeBound} from "@cp-print/design/utils/elementUtil";
import {moveableMove, moveableResize} from "@cp-print/design/components/moveable/moveable";
import SvgBase from "@cp-print/design/components/design/svg/svgBase.vue";
import {D3DragEvent} from "@cp-print/design/types/d3Type";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
let orgPoint

const svgOptions = reactive({
  width: 0,
  height: 0,
  // 辅助线
  controlLine: [] as Array<Line>,
  controlLineStart: {} as Point,
  controlPointEnd: {} as PointLabel,
  controlPointEndDragStart: {} as Point,
  // svg 形状点
  linePoints: [] as Array<Point>,
  // svg 形状点(包括控制点)
  allPoint: [] as Array<PointLabel>,
})

svgOptions.width = unit2px(props.element.width)
svgOptions.height = unit2px(props.element.height)

initPoint()

function initPoint() {
  svgOptions.linePoints = JSON.parse(props.element.data);
  
  svgOptions.controlPointEndDragStart = {...svgOptions.controlPointEnd}
  
  svgOptions.controlLineStart = {x: svgOptions.width / 2, y: svgOptions.height / 2}
  svgOptions.controlPointEnd = {x: svgOptions.width / 2, y: -20, label: ""}
  svgOptions.allPoint = [...svgOptions.linePoints, svgOptions.controlPointEnd]
  svgOptions.controlLine = [{start: svgOptions.controlLineStart, end: svgOptions.controlPointEnd}]
}

function dragStart(subject: PointLabel) {
  if (subject.label) {
    orgPoint = JSON.parse(JSON.stringify(svgOptions.allPoint));
  }
  svgOptions.controlPointEndDragStart = {...svgOptions.controlPointEnd}
}

function dragIng(subject: PointLabel, event: D3DragEvent, dx: number, dy: number) {
  subject.x = event.x + dx;
  subject.y = event.y + dy;
  
  if (subject.label) {
    const angle = computeLineAngle({
          start: svgOptions.controlLineStart,
          end: svgOptions.controlPointEndDragStart
        },
        {start: svgOptions.controlLineStart, end: {x: subject.x, y: subject.y}})
    // console.log(angle)
    var centerX = svgOptions.width / 2;
    var centerY = svgOptions.height / 2;
    for (let i = 0; i < 4; i++) {
      let point = orgPoint[i]
      const po = rotatePoint(centerX, centerY, point.x, point.y, angle)
      // console.log(po)
      svgOptions.allPoint[i].x = po.x
      svgOptions.allPoint[i].y = po.y
    }
  }
}

function dragEnd() {
  const rect = computedShapeBound(svgOptions.linePoints)
  
  // const width = d3Selection.select(chart)
  //     .select(".u-path")
  //     .node()
  //     // @ts-ignore
  //     .getBoundingClientRect();
  // console.log(width)
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
  svgOptions.controlLineStart.x = rect.width / 2
  svgOptions.controlLineStart.y = rect.height / 2
  svgOptions.controlPointEnd.x = rect.width / 2
  svgOptions.controlPointEnd.y = -20
  
  props.element.data = JSON.stringify(svgOptions.linePoints)
}

function draw() {
  let path: Path = d3Path.path();
  
  path.moveTo(svgOptions.linePoints[0].x, svgOptions.linePoints[0].y);
  for (let i = 1; i < svgOptions.linePoints.length; i++) {
    // console.log(333)
    path.lineTo(svgOptions.linePoints[i].x, svgOptions.linePoints[i].y);
  }
  // path.moveTo(...allPoint[0]);
  // path.rect(...allPoint[1], ...allPoint[2]);
  path.closePath()
  // console.log(123)
  
  return path;
}

</script>
