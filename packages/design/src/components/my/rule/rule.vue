<template>
    <!-- 刻度尺容 -->
    <div class="verticalRule"
         ref="ruleRef"
         :style="styleWrapper"
         @mousemove="mouseMove($event)"
         @mouseleave="mouseLeave"
         @click="mouseClick($event)">
        <div v-if="highlight.x != undefined"
             class="ruleHighlight pointer-events"
             :style="highlightStyle" />
        <svg id="canvas" ref="canvas"
             class="rule pointer-events"
             :style="style">
            <path class="u-path" d="" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, nextTick, onMounted, ref, watch, watchEffect } from 'vue';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { scaleUtil } from '@myprint/design/utils/scaleUtil';
import { getCurrentPanel, valueUnit } from '@myprint/design/utils/elementUtil';
import { getRatio } from '@myprint/design/utils/utils';
import { useAppStoreHook as useAppStore } from '@myprint/design/stores/app';
import { Container, MyAuxiliaryLine } from '@myprint/design/types/entity';
import { Path } from 'd3-path';
import * as d3Selection from 'd3-selection';
import * as d3Path from 'd3-path';
import { changeDragSnapIs } from '@myprint/design/plugins/moveable/moveable';

const appStore = useAppStore();

const props = withDefaults(defineProps<{
    direction?: 'vertical' | string,
    highlight?: Container,
    length?: number
    auxiliaryLineVisible: boolean
    scroll?: number,
}>(), {
    direction: 'horizontal',
    highlight: () => {
        return { x: undefined! as number, width: 1 } as Container;
    },
    length: 0,
    scroll: 0
});
const highlightStyle = computed(() => {
    if (props.direction == 'horizontal') {
        return {
            position: 'absolute',
            left: (props.highlight.x! + 30) + 'px',
            bottom: 0,
            width: props.highlight.width + 'px',
            height: '5px',
            border: '1px solid #8c939d'
        } as CSSProperties;
    } else {
        return {
            position: 'absolute',
            top: (props.highlight.x! + 30) + 'px',
            right: 0,
            width: '5px',
            height: props.highlight.width + 'px',
            border: '1px solid #8c939d'
        } as CSSProperties;
    }
});

const canvas = ref<SVGElement>();
const ruleRef = ref<HTMLDivElement>();

let height = 20;
const length = ref(0);

const ruleWidth = ref(0);
const ruleHeight = ref(0);
let chartSvg: any;

function mouseMove(event: MouseEvent) {
    if (event.buttons == 1) {
        return;
    }
    
    appStore.auxiliaryLineTmp = {
        x: 0,
        y: 0,
        runtimeOption: { x: 0, y: 0, auxiliaryLineStatus: 'SHOW' },
        direction: props.direction == 'vertical' ? 'horizontal' : 'vertical'
    } as MyAuxiliaryLine;
    
    if (appStore.auxiliaryLineTmp.direction == 'vertical') {
        appStore.auxiliaryLineTmp.x = event.offsetX + 20;
    } else {
        appStore.auxiliaryLineTmp.y = event.offsetY + 20;
    }
    
}

function mouseLeave() {
    appStore.auxiliaryLineTmp = { runtimeOption: { x: 0, y: 0, auxiliaryLineStatus: 'SHOW' } } as MyAuxiliaryLine;
}

function mouseClick(event: MouseEvent) {
    if (!props.auxiliaryLineVisible) {
        return;
    }
    const auxiliaryLine = {
        id: crypto.randomUUID(),
        x: 0,
        y: 0,
        runtimeOption: { x: 0, y: 0, auxiliaryLineStatus: 'SHOW' },
        direction: props.direction == 'vertical' ? 'horizontal' : 'vertical'
    } as MyAuxiliaryLine;
    if (auxiliaryLine.direction == 'vertical') {
        auxiliaryLine.x = event.offsetX + 20;
    } else {
        auxiliaryLine.y = event.offsetY + 20;
    }
    
    getCurrentPanel().auxiliaryLineList.push(auxiliaryLine);
    nextTick(() => {
        changeDragSnapIs();
    });
}

// 可以直接侦听一个 ref
// watch(() => props.highlight, (_newQuestion, _oldQuestion) => {
//   drawRuler()
//   // console.log(newQuestion[0])
//
//
//   // if (newQuestion[0] == null) {
//   //   highlightLine.attr({
//   //     strokeWidth: 0,
//   //   });
//   // } else {
//   //   highlightLine.attr({
//   //     strokeWidth: 1,
//   //   });
//   // }
//   // if (highlightLine != null) {
//   //   var matrix = new Snap.Matrix()
//   //   if (props.direction == 'horizontal') {
//   //     matrix.translate(newQuestion[0], 0);
//   //   } else {
//   //     matrix.translate(0, newQuestion[0]);
//   //   }
//   //   highlightLine.transform(matrix);
//   // }
//
// })

watch(() => props.scroll, (_newQuestion, _oldQuestion) => {
    if (props.direction == 'horizontal') {
        ruleRef.value!.scrollTo(props.scroll, 0);
    } else {
        ruleRef.value!.scrollTo(0, props.scroll);
    }
});

const styleWrapper = computed(() => {
    const styleTmp = {} as any;
    if (props.direction == 'horizontal') {
        styleTmp['box-sizing'] = 'border-box';
        styleTmp['borderTop'] = '1px solid rgb(233, 233, 233)';
        styleTmp['paddingLeft'] = '30px';
        styleTmp['paddingRight'] = '30px';
        styleTmp['height'] = height + 'px';
        // styleTmp['marginLeft'] = '20px'
    } else {
        styleTmp['paddingTop'] = '30px';
        styleTmp['paddingBottom'] = '50px';
        styleTmp['width'] = height + 'px';
        // styleTmp['minWidth'] = scaleUtil.scale(height) + 'px'
    }
    return styleTmp;
});

const style = computed(() => {
    const styleTmp = {} as any;
    if (props.direction == 'horizontal') {
        styleTmp['width'] = valueUnit(props.length);
        styleTmp['height'] = height + 'px';
    } else {
        styleTmp['width'] = height + 'px';
        styleTmp['minWidth'] = height + 'px';
        styleTmp['height'] = valueUnit(props.length);
    }
    styleTmp['transformOrigin'] = scaleUtil.miniMap.scale < 1 ? '0' : '' + ' top';
    styleTmp['transform'] = 'scale(' + scaleUtil.miniMap.scale + ')';
    return styleTmp;
});

watchEffect(() => {
    length.value = unit2px(Number.parseInt(props.length.toString()) * 2) + 20;
    if (length.value != 0) {
        nextTick(() => {
            drawRuler();
        });
    }
    
    if (props.direction == 'horizontal') {
        ruleWidth.value = length.value;
        ruleHeight.value = height;
    } else {
        ruleWidth.value = height;
        ruleHeight.value = length.value;
    }
    
});

function drawRuler() {
    const path = d3Path.path() as Path;
    
    const space = getRatio();
    const pxLength = unit2unit(appStore.lastPageUnit, 'mm', props.length);
    
    chartSvg.selectAll('text').remove();
    
    if (props.direction == 'horizontal') {
        // svg.line(0, 0, 0, 20).attr({
        //   stroke: "#8f9292",
        //   strokeWidth: 1,
        // });
        
        for (let i = 1; i < pxLength; i++) {
            // 绘制横标尺
            // let line;
            if (i % 5 == 0) {
                path.moveTo(space * i, 10);
            } else if (i % 2 == 0) {
                path.moveTo(space * i, 13);
            } else {
                path.moveTo(space * i, 14);
            }
            path.lineTo(space * i, 20);
            
            if (i % 10 == 0) {
                chartSvg.append('text')  // 添加一个 text 元素
                    .attr('x', space * i - 7)  // 设置 text 元素的 x 坐标
                    .attr('y', 10)  // 设置 text 元素的 y 坐标
                    .text(i + '')  // 设置 text 元素的文本内容
                    .style('fill', 'white')  // b1b4b4 设置 text 元素的颜色
                    .style('font-size', '12px');  // 设置 text 元素的字体大小
            }
        }
    } else {
        for (var i = 1; i < pxLength; i++) {
            if (i % 5 == 0) {
                path.moveTo(10, space * i);
            } else if (i % 2 == 0) {
                path.moveTo(13, space * i);
            } else {
                path.moveTo(14, space * i);
            }
            path.lineTo(20, space * i);
            if (i % 10 == 0) {
                chartSvg.append('text')  // 添加一个 text 元素
                    .attr('x', 3)  // 设置 text 元素的 x 坐标
                    .attr('y', space * i)  // 设置 text 元素的 y 坐标
                    .text(i + '')  // 设置 text 元素的文本内容
                    .style('fill', 'white')  // 设置 text 元素的颜色
                    .attr('transform', `rotate(-90, 10, ${space * i})`)
                    .style('font-size', '12px');  // 设置 text 元素的字体大小
            }
        }
        
    }
    chartSvg.select('.u-path')
        // #8f9292
        .style('stroke', 'white')
        .style('fill', 'white')
        // .attr("stroke-width", 1.9)
        .attr('d', path.toString());
}

onMounted(() => {
    chartSvg = d3Selection.select(canvas.value!);
});
</script>
