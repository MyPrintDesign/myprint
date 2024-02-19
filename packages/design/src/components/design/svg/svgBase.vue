<template>
  <!--  多边形的线-->
  <svg ref="chartRef" class="chart">
    <path class="u-path" d=""/>
    
    <!--    <line class="u-line"/>-->
    <line class="u-line" v-for="(_index, _item) in svgOptions.controlLine"/>
    
    <g class="u-point" style="display: none" v-for="(_index, _item) in svgOptions.allPoint">
      <circle r="3"/>
    </g>
  
  </svg>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'

import * as d3Array from "d3-array";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import {CpElement, Line, Point, PointLabel} from "@cp-print/design/types/entity";
import {dist, updateSvg} from "@cp-print/design/utils/svgUtil";
import {Path} from "d3-path";

const props = withDefaults(defineProps<{
  element?: CpElement,
  svgOptions: any,
  draw: Function,
  dragStart?: Function,
  dragIng?: Function,
  dragEnd?: Function,
  changeSize?: Function,
}>(), {
  element: () => ({} as CpElement),
  svgOptions: () => {
    return {
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
      drawAuxiliary: false
    }
  },
  draw: () => {
  },
  dragStart: () => {
  },
  dragIng: () => {
  },
  dragEnd: () => {
  },
  changeSize: () => {
    return false
  },
})

let path: Path

const chartRef = ref()

watch(() => props.element.status, (n, _o) => {
  // console.log(o, n)
  props.svgOptions.drawAuxiliary = n == 'HANDLE';
  updateSvg(chartRef.value, props.svgOptions, props.draw);
})

watch([() => props.element.width, () => props.element.height], (_n, _o) => {
  const renderIs = props.changeSize()
  if (renderIs) {
    updateSvg(chartRef.value, props.svgOptions, props.draw);
  }
})

onMounted(() => {
  draggable();
})

function draggable() {
  updateSvg(chartRef.value, props.svgOptions, props.draw);
  
  var subject: PointLabel | null, dx, dy;
  
  function dragSubject(event) {
    // 拖动开始判断是哪个
    // console.log(event)
    // 拖动的鼠标的位置
    if (!props.svgOptions.allPoint) {
      return null
    }
    const p = d3Selection.pointer(event.sourceEvent, chartRef.value);
    // console.log(p)
    // 找到的最近的点
    subject = d3Array.least(props.svgOptions.allPoint, (a, b) => dist(p, a) - dist(p, b))!;
    // console.log(subject)
    // 拖动范围
    if (dist(p, subject) > 12) subject = null;
    
    if (subject)
      d3Selection.select(chartRef.value)
          .style("cursor", "hand")
          .style("cursor", "grab");
    else d3Selection.select(chartRef.value).style("cursor", null);
    return subject;
  }
  
  d3Selection.select(chartRef.value)
      .on("mousemove", event => dragSubject({sourceEvent: event}))
      .call(
          d3Drag
              .drag()
              .subject(dragSubject)
              .on("start", event => {
                if (subject) {
                  d3Selection.select(chartRef.value).style("cursor", "grabbing");
                  dx = subject.x - event.x;
                  dy = subject.y - event.y;
                  props.dragStart(subject)
                }
              })
              .on("drag", event => {
                // console.log(event)
                if (subject) {
                  props.dragIng(subject, event, dx, dy)
                }
              })
              .on("end", () => {
                // console.log('end')
                props.dragEnd(subject)
                updateSvg(chartRef.value, props.svgOptions, props.draw)
              })
              .on("start.render drag.render end.render", () =>
                  updateSvg(chartRef.value, props.svgOptions, props.draw)
              )
      );
}
</script>
<style scoped>
.chart {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
