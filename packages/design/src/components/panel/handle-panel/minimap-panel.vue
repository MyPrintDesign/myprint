<template>
  <div class="content-scale"
       :class="{run: appStore.currentElement.id == null}">
    
    <div class="scale-preview" ref="scalePreviewRef">
      <div class="scale-design-content"
           ref="designContentRef"
           :style="{transformOrigin: '50% 0%',
                            minWidth: valueUnit(scaleUtil.scale(panel.width)),
                            width: valueUnit(scaleUtil.scale(panel.width)),
                            height: valueUnit(scaleUtil.scale(panel.height)),
                            scale: calc
                           // transform: `translate(${translate.translateX}px, ${translate.translateY}px) rotate(0deg)`
                           }"
           @mousedown="mousedown($event)">
        
        <div v-for="(element, index) in panel.elementList"
             :key="index">
          <div style="position: absolute;"
               class="pointer-events"
               :style="{left : valueUnit(element.x), top: valueUnit(element.y), width: valueUnit(element.width), height: valueUnit(element.height)}">
            <TextView v-if="element.type == 'Text'" :element="element"/>
            <ImageView v-if="element.type === 'Image'" :element="element"/>
            <TablePopoverView v-if="element.type === 'Table'" :element="element"/>
            <RectView v-if="element.type === 'Rect'" :element="element"/>
            <horizontal-line v-if="element.type === 'HorizontalLine'" :element="element"/>
            <vertical-line v-if="element.type === 'VerticalLine'" :element="element"/>
            <dotted-horizontal-line v-if="element.type === 'DottedHorizontalLine'" :element="element"/>
            <dotted-vertical-line v-if="element.type === 'DottedVerticalLine'" :element="element"/>
          </div>
        </div>
        
        <div class="viewport" :style="lookStyle"/>
      </div>
    </div>
    <el-row>
      <el-col :span="4">
        手势
      </el-col>
      <el-col :span="4" @click="startScale(-0.1)">
        <style-icon tips="组合" :modelValue="appStore.currentElement.option.textAlign == 'end'"
                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'end'}">
          <i class="icon-suoxiao iconfont"/>
        </style-icon>
      </el-col>
      <el-col :span="4">
        {{ MathCalc.mul(scaleUtil.miniMap.scale, 100) }}%
      </el-col>
      <el-col :span="4" @click="startScale(0.1)">
        <style-icon tips="组合" :modelValue="appStore.currentElement.option.textAlign == 'end'"
                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'end'}">
          <i class="icon-fangda iconfont"/>
        </style-icon>
      </el-col>
      <el-col :span="4" @click="startScale(0.1)">
        <style-icon tips="组合" :modelValue="appStore.currentElement.option.textAlign == 'end'"
                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'end'}">
          <i class="icon-map iconfont"/>
        </style-icon>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// import { ElRow, ElCol } from 'element-plus'
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {computed, inject, onMounted, reactive} from "vue";
import HorizontalLine from "../../design/auxiliary/line/horizontalLine";
import RectView from "../../design/auxiliary/rect/rect";
import DottedHorizontalLine from "../../design/auxiliary/line/dottedHorizontalLine";
import VerticalLine from "../../design/auxiliary/line/verticalLine";
import TextView from "../../design/text";
import DottedVerticalLine from "../../design/auxiliary/line/dottedVerticalLine";
import ImageView from "../../design/image";
import TablePopoverView from "../../design/table/tablePopoverView.vue";
import {Container, ContentScaleVo} from "@cp-print/design/types/entity";
import {clearEventBubble} from "@cp-print/design/utils/event";
import MathCalc from "@cp-print/design/utils/numberUtil";
import {scaleUtil} from "@cp-print/design/utils/scaleUtil";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
// import {hasStyle} from "@cp-print/design/constants/common";
import StyleIcon from "@cp-print/design/components/cp/icon";

const appStore = useAppStoreHook()
const emit = defineEmits(['scale'])
const panel = inject(panelKey)!
const mitt = inject(mittKey)!
// const props = withDefaults(defineProps<{
//   data?: ContentScaleVo
// }>(), {
//   data: () => ()
// })
const data = reactive({
  viewport: {
    x: 0,
    y: 0
  },
  openIs: true
} as ContentScaleVo)
// console.log(data)
mitt.on('minimapViewportSize', minimapViewportSize)
mitt.on('minimapViewportScroll', minimapViewportScroll)

function minimapViewportSize(size: Container) {
  data.viewport.width = size.width
  data.viewport.height = size.height
}

function minimapViewportScroll(size: Container) {
  // console.log(size)
  data.viewport.x = size.x
  data.viewport.y = size.y
}

// const scalePreviewRef = ref<HTMLDivElement>()!
const translate = reactive({
  onScroll: true,
  x: 0,
  y: 0,
  translateX: 0,
  translateY: 0,
})

onMounted(() => {

})

const scaleContainerWidth = 260
const scaleContainerHeight = 160

const calc = computed(() => {
  const width = unit2px(panel.width)
  const height = unit2px(panel.height)
  
  let widthCalc = (scaleContainerWidth) / width
  let heightCalc = (scaleContainerHeight) / height
  // if (widthCalc < 0.3) {
  //   widthCalc = 0.3
  // }
  // if (heightCalc < 0.3) {
  //   heightCalc = 0.3
  // }
  // console.log(widthCalc, heightCalc)
  let min = Math.min(widthCalc, heightCalc);
  min = min * scaleUtil.miniMap.scale
  return min
})

const lookStyle = computed(() => {
  
  const style = {} as any
  const viewport = data.viewport;
  // console.log(viewport)
  
  let w = viewport.width
  let h = viewport.height
  let x = viewport.x
  let y = viewport.y
  // console.log(translate.x, scaleContainerWidth, w)
  // let tmpw = Math.max(translate.x, scaleContainerWidth - w)
  // let tmph = Math.max(translate.y, scaleContainerHeight - h)
  style['left'] = x + 'px'
  style['top'] = y + 'px'
  style['width'] = w + 'px'
  style['height'] = h + 'px'
  return style;
})

function mousedown(ev: MouseEvent) {
  const tmpX = ev.clientX;
  const tmpY = ev.clientY;
  // // 鼠标按下，计算当前元素距离可视区的距离
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
  translate.onScroll = false
  
  function mousemove(ev: MouseEvent) {
    // console.log(ev)
    // 移动当前元素
    let offsetX = (ev.clientX - tmpX) / calc.value
    let offsetY = (ev.clientY - tmpY) / calc.value
    translate.translateX = offsetX
    translate.translateY = offsetY
    if (translate.translateX + translate.x / calc.value > 0) {
      translate.translateX = -translate.x / calc.value
    }
    if (translate.translateY + translate.y / calc.value > 0) {
      translate.translateY = -translate.y / calc.value
    }
    
    mitt.emit("scaleMove", {x: (-translate.x / calc.value - offsetX), y: (-translate.y / calc.value - offsetY)})
    clearEventBubble(ev)
    return true
  }
  
  function mouseup(ev: MouseEvent) {
    // console.log(ev)
    
    clearEventBubble(ev)
    
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    translate.onScroll = true
    translate.x = translate.x + translate.translateX * calc.value
    translate.y = translate.y + translate.translateY * calc.value
    translate.translateX = 0
    translate.translateY = 0
    // // 鼠标按下，计算当前元素距离可视区的距离
    // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
    return false
  }
  
  clearEventBubble(ev)
  return true;
}

function fresh() {
  // console.log(1)
  // if (minimap != null) {
  //   minimap.reset()
  // }
}

function scaleLoopMove(data: any) {
  if (!translate.onScroll) {
    return
  }
  translate.x = -data.x * calc.value / (scaleUtil.miniMap.scale)
  translate.y = -data.y * calc.value / (scaleUtil.miniMap.scale)
}

defineExpose({
  fresh,
  scaleLoopMove
})

function startScale(scale: number) {
  scaleUtil.miniMap.scale = MathCalc.sum(scaleUtil.miniMap.scale, scale)
  emit('scale')
}
</script>

<style scoped lang="scss">
//transition: all 0.3s ease-in-out;
.content-scale {
  width: 260px;
  height: 160px;
  background: #79bbff;
  border: 1px white solid;
  position: absolute;
  right: 20px;
  bottom: 40px;
  
  .scale-preview {
    width: 100%;
    height: calc(100%);
    background: gray;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    
    .scale-design-content {
      border: 1px solid white;
      background: gray;
      scale: 0;
      
      .viewport {
        pointer-events: none;
        border: 5px solid #ee3846;
        box-sizing: border-box;
        border-radius: 5px;
        position: absolute;
        opacity: 0.8;
      }
    }
  }
}

</style>
