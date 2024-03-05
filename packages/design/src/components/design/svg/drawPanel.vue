<script setup lang="ts">
import * as d3Shape from "d3-shape";
import {CurveGenerator} from "d3-shape";
import * as d3Selection from "d3-selection";
import * as d3Drag from "d3-drag";
import {DragBehavior, DraggedElementBaseType} from "d3-drag";
import {onMounted, reactive, ref, watch} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {elementHandleStatusList} from "@cp-print/design/constants/common";
import {douglasPeucker} from "@cp-print/design/utils/utils";
// import {watchImmediate} from "@vueuse/core";
// import {updateSvg} from "@cp-print/design/utils/svgUtil";

const canvasRef = ref()
const data = reactive({
  context: {} as CanvasRenderingContext2D,
  curve: {} as CurveGenerator,
  strokes: [] as Array<Array<number>>,
  redo: [],
  stroke: 'black',
  strokeWidth: 5,
  dragFun: {} as DragBehavior<DraggedElementBaseType, any, any>
})

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})

watch(() => props.element.runtimeOption.status, (n, _o) => {
  if (elementHandleStatusList.includes(n)) {
    d3Selection.select(data.context.canvas)
        .call(data.dragFun)
  } else {
    d3Selection.select(data.context.canvas)
        .on(".drag", null)
  }
})


watch([() => props.element.width, () => props.element.height], (_n, _o) => {
  canvasRef.value.width = unit2px(props.element.width) * 2;
  canvasRef.value.height = unit2px(props.element.height) * 2;
  render()
})

if (props.element.data) {
  const list = JSON.parse(props.element.data)
  for (let listElement of list) {
    listElement.data['stroke'] = listElement['stroke']
    listElement.data['strokeWidth'] = listElement['strokeWidth']
    data.strokes.push(listElement.data)
  }
}

onMounted(() => {
  
  data.context = canvasRef.value.getContext('2d');
  data.curve = d3Shape.curveBasis(data.context);
  
  data.context.lineJoin = "round";
  data.context.lineCap = "round";
  
  data.dragFun = d3Drag.drag()
      .container(data.context.canvas)
      .subject(dragsubject)
      .on("start drag", dragged)
      .on("end", darggend)
      .on("start.render drag.render", render)
  
  canvasRef.value.width = props.element.runtimeOption.width * 2;
  canvasRef.value.height = props.element.runtimeOption.height * 2;
  
  render()
  
})

function darggend() {
  // 调用路径压缩函数
  const pathList = []
  for (let stroke of data.strokes) {
    const compressedPath = douglasPeucker(stroke, 1.0);
    
    pathList.push({
      stroke: stroke['stroke'],
      strokeWidth: stroke['strokeWidth'],
      data: compressedPath,
    })
  }
  props.element.data = JSON.stringify(pathList)
  // console.log(data.strokes)
  // console.log(props.element.data)
  // console.log("Original Path:", originalPath);
  // console.log("Compressed Path:", compressedPath);
}

function render() {
  data.context.clearRect(0, 0, props.element.runtimeOption.width, props.element.runtimeOption.height);
  for (const stroke of data.strokes) {
    data.context.strokeStyle = stroke['stroke'];
    data.context.lineWidth = stroke['strokeWidth'];
    data.context.beginPath();
    data.curve.lineStart();
    // console.log(stroke)
    for (const point of stroke) {
      data.curve.point(point[0], point[1]);
    }
    if (stroke.length === 1) data.curve.point(stroke[0][0], stroke[0][1]);
    data.curve.lineEnd();
    data.context.stroke();
  }
  // data.context.canvas.value = data.strokes;
  // context.canvas.dispatchEvent(new CustomEvent("input"));
}

function dragsubject() {
  const currentStroke = [];
  currentStroke['stroke'] = data.stroke;
  currentStroke['strokeWidth'] = data.strokeWidth;
  data.strokes.push(currentStroke);
  data.redo.length = 0;
  return currentStroke;
}

// Add to the stroke when dragging.
function dragged({subject, x, y}) {
  subject.push([x * 2, y * 2]);
}

// function _drawer() {
//
//   // data.context.canvas.undo = () => {
//   //   if (strokes.length === 0) return;
//   //   redo.push(strokes.pop());
//   //   render();
//   // };
//   //
//   // data.context.canvas.redo = stroke => {
//   //   if (redo.length === 0) return;
//   //   strokes.push(redo.pop());
//   //   render();
//   // };
//
//   // Create a new empty stroke at the start of a drag gesture.
//
//
// }
</script>

<template>
  <canvas ref="canvasRef" class="cp-print-draw_panel"/>
</template>

<style scoped>

</style>
