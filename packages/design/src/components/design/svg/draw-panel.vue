<template>
    <img alt="" class="my-print-draw_panel_img" v-if="useAppStoreHook().displayModel == 'preview' || useAppStoreHook().displayModel == 'print'" :src="data.imgSrc">
    <canvas ref="canvasRef" class="my-print-draw_panel" />
</template>

<script setup lang="ts">
import * as d3Shape from 'd3-shape';
import { CurveGenerator } from 'd3-shape';
import * as d3Selection from 'd3-selection';
import * as d3Drag from 'd3-drag';
import { DragBehavior, DraggedElementBaseType } from 'd3-drag';
import { onMounted, reactive, ref, watch } from 'vue-demi';
import { MyElement, PointClick } from '@myprint/design/types/entity';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { douglasPeucker } from '@myprint/design/utils/utils';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { checkInput, moveableEditing } from '@myprint/design/plugins/moveable/moveable';
import { getRecursionParentPanel } from '@myprint/design/utils/elementUtil';

const canvasRef = ref();
const data = reactive({
    context: {} as CanvasRenderingContext2D,
    curve: {} as CurveGenerator,
    strokes: [] as Array<Array<number>>,
    redo: [],
    imgSrc: '',
    // stroke: 'black',
    strokeWidth: 5,
    dragFun: {} as DragBehavior<DraggedElementBaseType, any, any>,
    doubleClick: {} as DragBehavior<DraggedElementBaseType, any, any>
} as any);
let startX: number, startY: number;
let lastClickPoint: PointClick = undefined!;

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

watch(() => props.element.runtimeOption.status, (n, _o) => {
    if (n == 'HANDLE_ED') {
        // 监听双击事件
        d3Selection.select(data.context.canvas)
            .on('click', (event) => {
                startX = event.x;
                startY = event.y;
                const timestamp = Date.now();
                if (lastClickPoint == undefined) {
                    lastClickPoint = {
                        x: startX,
                        y: startY,
                        clickTimestamp: timestamp
                    };
                } else {
                    if (startX == lastClickPoint.x && startY == lastClickPoint.y && timestamp - lastClickPoint.clickTimestamp < 350) {
                        props.element.runtimeOption.status = 'HANDLE_EDIT_ING';
                        
                        checkInput();
                        
                        moveableEditing();
                        
                        // console.log('double-click');
                        lastClickPoint = undefined!;
                    } else {
                        lastClickPoint = {
                            x: startX,
                            y: startY,
                            clickTimestamp: timestamp
                        };
                    }
                }
            });
    } else if (n == 'HANDLE_EDIT_ING') {
        d3Selection.select(data.context.canvas)
            .call(data.dragFun)
        ;
    } else {
        d3Selection.select(data.context.canvas)
            .on('.drag', null)
            .on('click', null);
    }
    render();
});

watch([() => props.element.width, () => props.element.height], (_n, _o) => {
    canvasRef.value.width = unit2px(props.element.width, getRecursionParentPanel(props.element)) * 2;
    canvasRef.value.height = unit2px(props.element.height, getRecursionParentPanel(props.element)) * 2;
    render();
});
watch([() => props.element.option.borderAll], (_n, _o) => {
    render();
});
watch([() => props.element.data], (_n, _o) => {
    initData();
    render();
});

function initData() {
    const list = JSON.parse(props.element.data);
    data.strokes = [];
    for (let listElement of list) {
        listElement.data['stroke'] = listElement['stroke'];
        listElement.data['strokeWidth'] = listElement['strokeWidth'];
        data.strokes.push(listElement.data);
    }
}

if (props.element.data) {
    initData();
}

onMounted(() => {
    data.context = canvasRef.value.getContext('2d');
    data.curve = d3Shape.curveBasis(data.context);
    
    data.context.lineJoin = 'round';
    data.context.lineCap = 'round';
    
    data.dragFun = d3Drag.drag()
        .container(data.context.canvas)
        .subject(dragsubject)
        .on('start drag', dragged)
        .on('end', darggend)
        .on('start.render drag.render', render);
    
    
    canvasRef.value.width = props.element.runtimeOption.width * 2;
    canvasRef.value.height = props.element.runtimeOption.height * 2;
    
    render();
});

function darggend() {
    // 调用路径压缩函数
    const pathList: any[] = [];
    for (let stroke of data.strokes) {
        const compressedPath = douglasPeucker(stroke, 1.0);
        
        pathList.push({
            stroke: stroke['stroke'],
            strokeWidth: stroke['strokeWidth'],
            data: compressedPath
        });
    }
    props.element.data = JSON.stringify(pathList);
    // console.log(data.strokes)
    // console.log(props.element.data)
    // console.log("Original Path:", originalPath);
    // console.log("Compressed Path:", compressedPath);
}

function render() {
    // console.log(123)
    data.context.clearRect(0, 0, props.element.runtimeOption.width * 2, props.element.runtimeOption.height * 2);
    
    if (props.element.option.background) {
        data.context.fillStyle = props.element.option.background;
        data.context.fillRect(0, 0, props.element.runtimeOption.width * 2, props.element.runtimeOption.height * 2);
    }
    
    if (props.element.option.borderAll) {
        data.context.strokeStyle = 'black';
        data.context.lineWidth = 2;
        data.context.strokeRect(1, 1, props.element.runtimeOption.width * 2 - 2.5, props.element.runtimeOption.height * 2 - 2.5);
    }
    for (const stroke of data.strokes) {
        data.context.strokeStyle = stroke['stroke'];
        data.context.lineWidth = stroke['strokeWidth'];
        data.context.beginPath();
        data.curve.lineStart();
        
        for (const point of stroke) {
            data.curve.point(point[0], point[1]);
        }
        
        if (stroke.length === 1) data.curve.point(stroke[0][0], stroke[0][1]);
        data.curve.lineEnd();
        data.context.stroke();
    }
    
    data.imgSrc = canvasRef.value.toDataURL();
    // data.context.canvas.value = data.strokes;
    // context.canvas.dispatchEvent(new CustomEvent("input"));
}

function dragsubject() {
    const currentStroke = [];
    currentStroke['stroke'] = props.element.option.color ? props.element.option.color : 'black';
    currentStroke['strokeWidth'] = data.strokeWidth;
    data.strokes.push(currentStroke);
    data.redo.length = 0;
    return currentStroke;
}

// Add to the stroke when dragging.
function dragged({ subject, x, y }) {
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
