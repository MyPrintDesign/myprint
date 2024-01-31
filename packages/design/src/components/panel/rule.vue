<template>
  <!-- 刻度尺容 -->
  <div class="verticalRule"
       :style="styleWrapper"
       :class="{ruleRotate: direction == 'vertical', 'sticky-top': direction != 'vertical',
  'sticky-left': direction == 'vertical',
  }">
    <div v-if="highlight.x != undefined"
         class="ruleHighlight"
         :style="highlightStyle"></div>
    <svg id="canvas" ref="canvas"
         class="rule"
         :style="style"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, CSSProperties, nextTick, ref, watchEffect} from "vue";
import {unit2px, unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {scaleUtil} from "@cp-print/design/utils/scaleUtil";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {getRatio} from "@cp-print/design/utils/utils";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import Snap from 'snapsvg-cjs'
import {Container} from "@cp-print/design/types/entity";
import {Paper} from "snapsvg";

const props = withDefaults(defineProps<{
  direction?: 'vertical' | string,
  highlight?: Container,
  length?: number
}>(), {
  direction: 'horizontal',
  highlight: () => {
    return {x: undefined, width: 1} as Container
  },
  length: 0
})
const highlightStyle = computed(() => {
  if (props.direction == 'horizontal') {
    return {
      position: 'absolute',
      left: props.highlight.x + 'px',
      bottom: 0,
      width: props.highlight.width + 'px',
      height: '5px',
      border: '1px solid #8c939d'
    } as CSSProperties
  } else {
    return {
      position: 'absolute',
      top: props.highlight.x + 'px',
      right: 0,
      width: '5px',
      height: props.highlight.width + 'px',
      border: '1px solid #8c939d'
    } as CSSProperties
  }
})

const canvas = ref<SVGElement>()

let height = 20;
const length = ref(0);

const ruleWidth = ref(0);
const ruleHeight = ref(0);

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

const styleWrapper = computed(() => {
  const styleTmp = {} as any
  if (props.direction == 'horizontal') {
    styleTmp['width'] = valueUnit(scaleUtil.scale(props.length))
    styleTmp['height'] = scaleUtil.scale(height) + 'px'
    styleTmp['margin-left'] = scaleUtil.scale(height) + 'px'
  } else {
    styleTmp['width'] = scaleUtil.scale(height) + 'px'
    styleTmp['minWidth'] = scaleUtil.scale(height) + 'px'
    styleTmp['height'] = valueUnit(scaleUtil.scale(props.length))
  }
  return styleTmp
})

const style = computed(() => {
  const styleTmp = {} as any
  if (props.direction == 'horizontal') {
    styleTmp['width'] = valueUnit(props.length)
    styleTmp['height'] = height + 'px'
  } else {
    styleTmp['width'] = height + 'px'
    styleTmp['minWidth'] = height + 'px'
    styleTmp['height'] = valueUnit(props.length)
  }
  styleTmp['transformOrigin'] = scaleUtil.miniMap.scale < 1 ? '0' : '' + ' top'
  styleTmp['transform'] = 'scale(' + scaleUtil.miniMap.scale + ')'
  return styleTmp
})

watchEffect(() => {
  length.value = unit2px(Number.parseInt(props.length.toString()) * 2) + 20
  if (length.value != 0) {
    nextTick(() => {
      drawRuler()
    })
  }
  
  if (props.direction == 'horizontal') {
    ruleWidth.value = length.value
    ruleHeight.value = height
  } else {
    ruleWidth.value = height
    ruleHeight.value = length.value
  }
  
})

const lineList: Array<Snap.Element> = []
const textList: Array<Snap.Element> = []
let highlightLine;

const appStore = useAppStoreHook()

// 旋转文字

function drawRuler() {
  // console.log(123)
  // console.log(canvas.value)
  const svg = Snap(canvas.value as SVGElement) as Paper;
  svg.clear()
  
  const space = getRatio()
  const pxLength = unit2unit(appStore.lastPageUnit, 'mm', props.length)
  
  if (props.direction == 'horizontal') {
    svg.line(0, 0, 0, 20).attr({
      stroke: "#8f9292",
      strokeWidth: 1,
    });
    
    for (let i = 1; i < pxLength; i++) {
      // 绘制横标尺
      let line;
      if (i % 5 == 0) {
        line = svg.line(space * i, 10, space * i, 20);
      } else if (i % 2 == 0) {
        line = svg.line(space * i, 13, space * i, 20);
      } else {
        line = svg.line(space * i, 14, space * i, 20);
      }
      
      line.attr({
        stroke: "#8f9292",
        strokeWidth: 1,
      })
      
      lineList.push(line)
      if (i % 10 == 0) {
        let text = svg.text(space * i - 7, 10, i)
        text.attr({
          fill: "#b1b4b4",
          'font-size': 12
        });
        textList.push(text)
      }
    }
    highlightLine = svg.line(0, 0, 0, 25);
  } else {
    for (var i = 1; i < pxLength; i++) {
      let line;
      if (i % 5 == 0) {
        line = svg.line(10, space * i, 20, space * i);
      } else if (i % 2 == 0) {
        line = svg.line(13, space * i, 20, space * i);
      } else {
        line = svg.line(14, space * i, 20, space * i);
      }
      line.attr({
        stroke: "#8f9292",
        strokeWidth: 1,
      })
      if (i % 10 == 0) {
        let texth = i;
        let ruletext = svg.text(3, space * i, texth).attr({
          fill: "#b1b4b4",
          'font-size': 12
        });
        
        const matrixRotate = new Snap.Matrix();
        matrixRotate.rotate(270, 10, space * i);
        ruletext.transform(matrixRotate);
        textList.push(ruletext)
      }
    }
    
    highlightLine = svg.line(0, 0, 25, 0);
  }
  
  highlightLine.attr({
    stroke: "red",
    strokeWidth: 0,
  });
}

// onMounted(() => {
//   // console.log(canvas)
//   console.log(window.devicePixelRatio)
//   if (window.devicePixelRatio) {
//     // canvas.value.style.transform = "scale(" + 1 / window.devicePixelRatio + ")";
//     // canvas.value.style.transformOrigin = "left top";
//   }
//   drawRuler();
// })


</script>
<style>

</style>
