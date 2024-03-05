<template>
  <div class="content-scale"
       :class="{run: appStore.currentElement.id == null}">
    
    <div class="scale-preview" ref="scalePreviewRef"
         v-if="configStore.settingPanel.miniMap.visible">
      <div class="scale-design-content"
           ref="designContentRef"
           :style="{transformOrigin: '50% 0%',
                            minWidth: valueUnit(scaleUtil.scale(panel.width)),
                            width: valueUnit(scaleUtil.scale(panel.width)),
                            height: valueUnit(scaleUtil.scale(panel.height)),
                            scale: data.scale
                           }"
           @mousedown="mousedown($event)">
        
        <div style="position: absolute;"
             v-for="(element, index) in panel.elementList"
             :key="index"
             class="pointer-events"
             :style="{left : valueUnit(element.x), top: valueUnit(element.y), width: valueUnit(element.width), height: valueUnit(element.height)}">
          <TextView v-if="element.type == 'Text'" :element="element"/>
          <ImageView v-if="element.type === 'Image'" :element="element"/>
          <table-design v-if="element.type === 'Table'" :element="element"/>
          <RectView v-if="element.type === 'Rect'" :element="element"/>
          <horizontal-line v-if="element.type === 'HorizontalLine'" :element="element"/>
          <vertical-line v-if="element.type === 'VerticalLine'" :element="element"/>
          <dotted-horizontal-line v-if="element.type === 'DottedHorizontalLine'" :element="element"/>
          <dotted-vertical-line v-if="element.type === 'DottedVerticalLine'" :element="element"/>
        </div>
        
        <div class="viewport" :style="lookStyle"/>
      </div>
    </div>
    
    <div class="mini-map-toolbar display-flex">
      <div class="mini-map-toolbar_redo-undo display-flex">
        <div @mousedown="($event)=>$event.stopPropagation()" @click="undoPanel"
             :class="[{'cp-icon-disabled': !canUndo}]"
             class="cp-icon iconfont icon-undo cp-handle-panel-icon"/>
        <div @mousedown="($event)=>$event.stopPropagation()" @click="redoPanel"
             :class="[{'cp-icon-disabled': !canRedo}]"
             class="cp-icon iconfont icon-redo cp-handle-panel-icon"/>
      </div>
      
      <div class="mini-map-toolbar_control display-flex">
        <!--        <div>手势</div>-->
        <div class="display-flex space-between width-100-p">
          <tip-icon tips="缩小" @click="startScale(-0.1)">
            <i class="icon-suoxiao iconfont"/>
          </tip-icon>
          <div>
            {{ MathCalc.mul(scaleUtil.miniMap.scale, 100) }}%
          </div>
          <tip-icon tips="放大" @click="startScale(0.1)">
            <i class="icon-fangda iconfont"/>
          </tip-icon>
          <tip-icon tips="导航" :modelValue="configStore.settingPanel.miniMap.visible"
                    @update:model-value="flag => {configStore.settingPanel.miniMap.visible = flag}">
            <i class="icon-map iconfont"/>
          </tip-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {computed, inject, onMounted, reactive} from "vue";
import HorizontalLine from "../../design/auxiliary/line/horizontalLine";
import RectView from "../../design/auxiliary/rect/rect";
import DottedHorizontalLine from "../../design/auxiliary/line/dottedHorizontalLine";
import VerticalLine from "../../design/auxiliary/line/verticalLine";
import TextView from "../../design/text";
import DottedVerticalLine from "../../design/auxiliary/line/dottedVerticalLine";
import ImageView from "../../design/image";
import TableDesign from "../../design/table/tableDesign.vue";
import {Container, ContentScaleVo} from "@cp-print/design/types/entity";
import {clearEventBubble} from "@cp-print/design/utils/event";
import MathCalc from "@cp-print/design/utils/numberUtil";
import {scaleUtil} from "@cp-print/design/utils/scaleUtil";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {useConfigStore} from "@cp-print/design/stores/config";
import {canRedo, canUndo, redoPanel, undoPanel} from "@cp-print/design/utils/historyUtil";
import TipIcon from "@cp-print/design/components/cp/icon/tip-icon.vue";

const appStore = useAppStoreHook()
const configStore = useConfigStore()

// const emit = defineEmits(['scale'])
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
  scale: 0,
  openIs: true
} as ContentScaleVo)
// console.log(data)
mitt.on('minimapViewportSize', minimapViewportSize)
mitt.on('minimapViewportScroll', minimapViewportScroll)

function minimapViewportSize(size: Container) {
  data.viewport.width = size.width
  data.viewport.height = size.height
  // changePageSize()
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

mitt.on('changePageSize', changePageSize)

function changePageSize() {
  // console.log(123)
  const width = unit2px(panel.width)
  const height = unit2px(panel.height)
  // console.log(width)
  
  let widthCalc = (scaleContainerWidth) / width
  let heightCalc = (scaleContainerHeight) / height
  let min = Math.min(widthCalc, heightCalc);
  min = min / scaleUtil.miniMap.scale
  data.scale = min
  // console.log(min)
}

onMounted(() => {
  // changePageSize()
})

const scaleContainerWidth = 260
const scaleContainerHeight = 160

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
  style['height'] = (h - 1) + 'px'
  return style;
})

function mousedown(ev: MouseEvent) {
  // const tmpX = ev.clientX;
  // const tmpY = ev.clientY;
  // // 鼠标按下，计算当前元素距离可视区的距离
  // document.addEventListener('mousemove', mousemove);
  // document.addEventListener('mouseup', mouseup);
  translate.onScroll = false
  
  // function mousemove(ev: MouseEvent) {
  //   // console.log(ev)
  //   // 移动当前元素
  //   let offsetX = (ev.clientX - tmpX) / calc.value
  //   let offsetY = (ev.clientY - tmpY) / calc.value
  //   translate.translateX = offsetX
  //   translate.translateY = offsetY
  //   if (translate.translateX + translate.x / calc.value > 0) {
  //     translate.translateX = -translate.x / calc.value
  //   }
  //   if (translate.translateY + translate.y / calc.value > 0) {
  //     translate.translateY = -translate.y / calc.value
  //   }
  //
  //   mitt.emit("scaleMove", {x: (-translate.x / calc.value - offsetX), y: (-translate.y / calc.value - offsetY)})
  //   clearEventBubble(ev)
  //   return true
  // }
  //
  // function mouseup(ev: MouseEvent) {
  //   // console.log(ev)
  //
  //   clearEventBubble(ev)
  //
  //   document.removeEventListener('mousemove', mousemove);
  //   document.removeEventListener('mouseup', mouseup);
  //   translate.onScroll = true
  //   translate.x = translate.x + translate.translateX * calc.value
  //   translate.y = translate.y + translate.translateY * calc.value
  //   translate.translateX = 0
  //   translate.translateY = 0
  //   // // 鼠标按下，计算当前元素距离可视区的距离
  //   // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
  //   return false
  // }
  
  clearEventBubble(ev)
  return true;
}

// function fresh() {
//   // console.log(1)
//   // if (minimap != null) {
//   //   minimap.reset()
//   // }
// }
//
// function scaleLoopMove(data: any) {
//   if (!translate.onScroll) {
//     return
//   }
//   translate.x = -data.x * calc.value / (scaleUtil.miniMap.scale)
//   translate.y = -data.y * calc.value / (scaleUtil.miniMap.scale)
// }
//
// defineExpose({
//   fresh,
//   scaleLoopMove
// })

function startScale(scale: number) {
  // console.log(123)
  scaleUtil.miniMap.scale = MathCalc.sum(scaleUtil.miniMap.scale, scale)
  // emit('scale')
  changePageSize()
}
</script>

<style scoped lang="scss">
//transition: all 0.3s ease-in-out;
.content-scale {
  width: 260px;
  height: 205px;
  //background: #79bbff;
  //border: 1px white solid;
  position: absolute;
  right: 20px;
  bottom: 7px;
  //box-sizing: border-box;
  
  .scale-preview {
    width: 100%;
    height: calc(100% - 45px);
    background: gray;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 8px;
    box-shadow: 0px 6px 20px rgba(25, 25, 26, .06), 0px 2px 12px rgba(25, 25, 26, .04);
    //border: 1px white solid;
    //box-sizing: border-box;
    
    .scale-design-content {
      //border: 1px solid white;
      background: white;
      scale: 0;
      box-shadow: 0px 6px 20px rgba(25, 25, 26, 0.06), 0px 2px 12px rgba(25, 25, 26, 0.04);;
      
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

.mini-map-toolbar {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0px 6px 20px rgba(25, 25, 26, .06), 0px 2px 12px rgba(25, 25, 26, .04);
  
  .mini-map-toolbar_redo-undo {
    background: white;
    margin-right: 10px;
    border-radius: 8px;
    width: 100px;
    box-shadow: 0px 6px 20px rgba(25, 25, 26, .06), 0px 2px 12px rgba(25, 25, 26, .04);
    border: 1px solid rgba(18, 17, 42, .07);
  }
  
  .mini-map-toolbar_control {
    background: white;
    border-radius: 8px;
    width: 100%;
    box-shadow: 0px 6px 20px rgba(25, 25, 26, .06), 0px 2px 12px rgba(25, 25, 26, .04);
    border: 1px solid rgba(18, 17, 42, .07);
  }
  
}
</style>
