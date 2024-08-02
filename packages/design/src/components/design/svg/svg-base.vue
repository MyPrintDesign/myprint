<template>
    <svg ref="chartRef" class="my-print-chart">
        <path class="u-path" d="" />
        
        <template v-if="displayDesign(element)">
            <line class="u-line" v-for="(_index, _item) in svgOptions.controlLine" />
            
            <g class="u-point" style="display: none" v-for="(_index, _item) in svgOptions.allPoint">
                <circle r="3" />
            </g>
            <g class="uv-point" style="display: none" v-for="(_index, _item) in svgOptions.virtualPoint">
                <circle r="3" />
            </g>
        </template>
    </svg>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue-demi';

import * as d3Array from 'd3-array';
import * as d3Selection from 'd3-selection';
import * as d3Drag from 'd3-drag';
import { Line, MyElement, Point, PointClick, PointLabel } from '@myprint/design/types/entity';
import { dist, updateSvg } from '@myprint/design/utils/svgUtil';
import { Path } from 'd3-path';
import { elementHandleHandleStatusList } from '@myprint/design/constants/common';
import { D3DragEvent } from '@myprint/design/types/d3Type';
import { displayDesign } from '@myprint/design/utils/elementUtil';

const props = withDefaults(defineProps<{
    element?: MyElement,
    svgOptions: any,
    draw: (chart: any) => void,
    dragStart?: (subject: PointLabel) => void,
    dragIng?: (subject: PointLabel, event: D3DragEvent, dx: number, dy: number) => void,
    dragEnd?: (subject: PointLabel) => void,
    changeSize?: () => boolean,
    doubleClick?: (subject: PointLabel) => void,
}>(), {
    element: () => ({} as MyElement),
    svgOptions: () => {
        return {
            width: 0,
            height: 0,
            controlLine: [] as Array<Line>,
            centerPoint: {} as Point,
            controlPointScale: {} as PointLabel,
            controlPointResize: {} as PointLabel,
            controlPointEndDragStart: {} as Point,
            // svg 形状点
            allPoint: [] as Array<PointLabel>,
            virtualPoint: [] as Array<PointLabel>,
            drawAuxiliary: false
        };
    },
    draw: () => {
    },
    dragStart: () => {
    },
    dragIng: (_subject: PointLabel, _event: D3DragEvent, _dx: number, _dy: number) => {
    },
    dragEnd: () => {
    },
    doubleClick: () => {
    },
    changeSize: () => {
        return false;
    }
});

let path: Path;

const chartRef = ref();
let subject: PointLabel = undefined!, dx, dy;
let startX, startY;
let dragFun;
let lastClickPoint: PointClick = undefined!;

watch(() => props.element.runtimeOption.status, (n, _o) => {
    // console.log(o, n)
    props.svgOptions.drawAuxiliary = elementHandleHandleStatusList.includes(n) && !props.element.lock;
    updateSvg(chartRef.value, props.svgOptions, props.draw);
    draggable();
});

watch(() => props.element.lock, (_n, _o) => {
    props.svgOptions.drawAuxiliary = elementHandleHandleStatusList.includes(props.element.runtimeOption.status) && !props.element.lock;
    updateSvg(chartRef.value, props.svgOptions, props.draw);
    draggable();
});

watch([() => props.element.width, () => props.element.height], (_n, _o) => {
    const renderIs = props.changeSize();
    if (renderIs) {
        updateSvg(chartRef.value, props.svgOptions, props.draw);
    }
});

watch([() => props.element.option.color, () => props.element.option.background, () => props.element.option.opacity], (_n, _o) => {
    updateSvg(chartRef.value, props.svgOptions, props.draw);
});
onMounted(() => {
    props.svgOptions.element = props.element;
    dragFun = d3Drag
        .drag()
        .subject(dragSubject)
        .on('start', event => {
            if (subject) {
                d3Selection.select(chartRef.value).style('cursor', 'grabbing');
                dx = subject.x - event.x;
                dy = subject.y - event.y;
                props.dragStart(subject);
                
                startX = event.x;
                startY = event.y;
                
                if (subject.type == 'virtual') {
                    const insertIndex = subject.insertIndex;
                    subject.insertIndex = undefined!;
                    subject.type = undefined!;
                    props.svgOptions.allPoint.splice(insertIndex, 0, subject);
                    props.svgOptions.linePoints.splice(insertIndex, 0, subject);
                    updateSvg(chartRef.value, props.svgOptions, props.draw);
                }
            }
        })
        .on('drag', event => {
            if (subject) {
                props.dragIng(subject, event, dx, dy);
            }
        })
        .on('end', (event) => {
            if (subject) {
                if (startX == event.x && startY == event.y) {
                    // console.log("click");
                    // props.dragEnd(subject!)
                    const timestamp = Date.now();
                    if (lastClickPoint == undefined) {
                        lastClickPoint = {
                            x: startX,
                            y: startY,
                            clickTimestamp: timestamp
                        };
                    } else {
                        if (startX == lastClickPoint.x && startY == lastClickPoint.y && timestamp - lastClickPoint.clickTimestamp < 350) {
                            props.doubleClick(subject!);
                            lastClickPoint = undefined!;
                        } else {
                            lastClickPoint = {
                                x: startX,
                                y: startY,
                                clickTimestamp: timestamp
                            };
                        }
                    }
                } else {
                    console.log('end');
                    props.dragEnd(subject!);
                }
                // event
            }
            d3Selection.select(chartRef.value).style('cursor', null);
            
            updateSvg(chartRef.value, props.svgOptions, props.draw);
        })
        .on('start.render drag.render end.render', () =>
            updateSvg(chartRef.value, props.svgOptions, props.draw)
        );
    updateSvg(chartRef.value, props.svgOptions, props.draw);
});

function draggable() {
    if (!props.svgOptions.drawAuxiliary) {
        d3Selection.select(chartRef.value)
            .on('mousemove', null)
            .on('.drag', null);
        d3Selection.select(chartRef.value).style('cursor', null);
    } else {
        d3Selection.select(chartRef.value)
            .on('mousemove', event => dragSubject({ sourceEvent: event }))
            .call(dragFun);
    }
}

function dragSubject(event) {
    // 拖动开始判断是哪个
    // console.log(event)
    // 拖动的鼠标的位置
    if (!props.svgOptions.allPoint) {
        return null;
    }
    const p = d3Selection.pointer(event.sourceEvent, chartRef.value);
    // console.log(p)
    // 找到的最近的点
    subject = d3Array.least(props.svgOptions.allPoint, (a, b) => dist(p, a) - dist(p, b))!;
    // console.log(subject)
    // 拖动范围
    if (dist(p, subject) > 12) subject = undefined!;
    
    if (subject == null && props.svgOptions.virtualPoint && props.svgOptions.virtualPoint.length > 0) {
        subject = d3Array.least(props.svgOptions.virtualPoint, (a, b) => dist(p, a) - dist(p, b))!;
        if (dist(p, subject) > 12) subject = undefined!;
    }
    
    if (subject)
        d3Selection.select(chartRef.value)
            .style('cursor', 'hand')
            .style('cursor', 'grab');
    else d3Selection.select(chartRef.value).style('cursor', null);
    return subject;
}
</script>
<style scoped>

</style>
