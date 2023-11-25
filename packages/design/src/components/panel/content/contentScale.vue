<template>
  <div class="content-scale"
       :class="{run: getCurrentElement().value.id == null}">
    
    <div class="scale-preview" ref="scalePreviewRef">
      <div class="scale-design-content"
           ref="designContentRef"
           :style="{transformOrigin: 'left top',
                            minWidth: valueUnit(scaleUtil.scale(panel.width)),
                            width: valueUnit(scaleUtil.scale(panel.width)),
                            height: valueUnit(scaleUtil.scale(panel.height)),
                            scale: calc,
                            left: translate.x + 'px',
                            top: translate.y + 'px',
                           transform: `translate(${translate.translateX}px, ${translate.translateY}px) rotate(0deg)`
                           }"
           @mousedown="mousedown($event)">
        
        <div v-for="(element, index) in panel.elementList"
             :key="index">
          <div style="position: absolute; pointer-events: none;"
               class="pointer-events "
               :style="{left : valueUnit(element.x), top : valueUnit(element.y), width: valueUnit(element.width) , height: valueUnit(element.height),
               transform: getTranslate(element)}">
            <TextView v-if="element.type == 'Text'" :element="element as TextElement"/>
            <ImageView v-if="element.type === 'Image'" :element="element"/>
            <TablePopoverView v-if="element.type === 'Table'" :element="element"/>
            <RectView v-if="element.type === 'Rect'" :element="element"/>
            <horizontal-line v-if="element.type === 'HorizontalLine'" :element="element"/>
            <vertical-line v-if="element.type === 'VerticalLine'" :element="element"/>
            <dotted-horizontal-line v-if="element.type === 'DottedHorizontalLine'" :element="element"/>
            <dotted-vertical-line v-if="element.type === 'DottedVerticalLine'" :element="element"/>
          </div>
        </div>
      </div>
      
      <div class="loop" :style="lookStyle"/>
    </div>
    <el-row>
      <el-col :span="4">
        手势
      </el-col>
      <el-col :span="4" @click="startScale(-0.1)">
        -
      </el-col>
      <el-col :span="4">
        {{ MathCalc.mul(scaleUtil.miniMap.scale, 100) }}%
      </el-col>
      <el-col :span="4" @click="startScale(0.1)">
        +
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElRow, ElCol } from 'element-plus'
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {computed, inject, onMounted, PropType, reactive, ref} from "vue";
import HorizontalLine from "../../design/auxiliary/line//horizontalLine/horizontalLine.vue";
import RectView from "../../design/auxiliary/rect/rect/rect.vue";
import DottedHorizontalLine from "../../design/auxiliary/line/dottedHorizontalLine/dottedHorizontalLine.vue";
import VerticalLine from "../../design/auxiliary/line/verticalLine/verticalLine.vue";
import TextView from "../../design/text/text.vue";
import DottedVerticalLine from "../../design/auxiliary/line/dottedVerticalLine/dottedVerticalLine.vue";
import ImageView from "../../design/image/image.vue";
import TablePopoverView from "../../design/table/tablePopoverView.vue";
import {mm2pxNoScale} from "@cp-print/design/utils/utils";
import {ContentScaleVo, TextElement} from "@cp-print/design/types/entity";
import {clearEventBubble} from "@cp-print/design/utils/event";
import MathCalc from "@cp-print/design/utils/numberUtil";
import {scaleUtil} from "@cp-print/design/utils/scaleUtil";
import {getCurrentElement, getTranslate, valueUnit} from "@cp-print/design/utils/elementUtil";

const emit = defineEmits(['scale'])
const panel = inject(panelKey)
const mitt = inject(mittKey)

const props = defineProps({
  data: {type: Object as PropType<ContentScaleVo>, default: () => ({})}
})
const scalePreviewRef = ref(<HTMLDivElement>{})
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
  const width = mm2pxNoScale(panel.width)
  const height = mm2pxNoScale(panel.height)
  
  console.log(((scaleUtil.miniMap.scale)))
  let widthCalc = (scaleContainerWidth) / width
  let heightCalc = (scaleContainerHeight) / height
  if (widthCalc < 0.3) {
    widthCalc = 0.3
  }
  if (heightCalc < 0.3) {
    heightCalc = 0.3
  }
  // console.log(widthCalc, heightCalc)
  let min = Math.min(widthCalc, heightCalc);
  min = min * scaleUtil.miniMap.scale
  return min
})

const lookStyle = computed(() => {
  
  const style = {}
  const screenWidth = props.data.scrollWidth;
  const screenHeight = props.data.scrollHeight;
  
  let w = screenWidth * calc.value
  let h = screenHeight * calc.value
  // console.log(translate.x, scaleContainerWidth, w)
  let tmpw = Math.max(translate.x, scaleContainerWidth - w)
  let tmph = Math.max(translate.y, scaleContainerHeight - h)
  style['left'] = Math.min(tmpw, 0) + 'px'
  style['top'] = Math.min(tmph, 0) + 'px'
  style['width'] = w + 'px'
  style['height'] = h + 'px'
  return style;
})

function mousedown(ev) {
  const tmpX = ev.clientX;
  const tmpY = ev.clientY;
  // // 鼠标按下，计算当前元素距离可视区的距离
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
  translate.onScroll = false
  
  function mousemove(ev) {
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
  
  function mouseup(ev) {
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

function scaleLoopMove(data) {
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

<style scoped>
.content-scale {
  width: 200px;
  height: 144px;
  background: #79bbff;
  transition: all 0.3s ease-in-out;
}

.run {
  transform: translateX(300px);
}

.scale-preview {
  width: 200px;
  height: 120px;
  background: gray;
  overflow: hidden;
  position: relative;
  
  .scale-design-content {
    background: gray;
    position: absolute;
  }
  
  .loop {
    pointer-events: none;
    border: 2px solid #ee3846;
    box-sizing: border-box;
    border-radius: 5px;
    position: absolute;
    opacity: 0.8;
  }
}

</style>
