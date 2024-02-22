<template>
  <div class="options">
    <div :class="(data as any).iconClass" class="icon"
         draggable="true"
         @mousedown="dragStart($event)"
    />
    
    <div class="icon-tip">{{ elementTypeFormat[data.type] }}</div>
    <Teleport v-if="isDrop" to=".design-content">
      <design :element="tmpElement"/>
    </Teleport>
    <Teleport v-if="dragWrapper.visible" to="body">
      <drag-wrapper :data="dragWrapper"/>
    </Teleport>
  </div>
</template>
<script setup lang="ts">

import {inject, nextTick, reactive, ref} from "vue";
import {Container, CpElement, elementTypeFormat} from "@cp-print/design/types/entity";
import {px2unit, unit2px, unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import Design from "@cp-print/design/components/design/design.vue";
import {addElement, initElement} from "@cp-print/design/utils/elementUtil";
import {clearEventBubble} from "@cp-print/design/utils/event";
import {
  dragNewElement,
  dragNewElementCancel,
  setSelectedTargets,
  updatePanel
} from "@cp-print/design/components/moveable/moveable";
import {useAppStoreHook as useAppStore} from "@cp-print/design/stores/app";
import DragWrapper from "@cp-print/design/components/panel/options/dragWrapper.vue";

const mitt = inject(mittKey)!
const panel = inject(panelKey)!
const appStore = useAppStore()

const isDrop = ref(false)
const tmpElement = ref({} as CpElement)
const dragWrapper = reactive({
  visible: false,
  transitionAnime: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  opacity: 0
} as Container & { visible: boolean, opacity: number, transitionAnime: boolean })

const props = withDefaults(defineProps<{
  data?: CpElement
}>(), {
  data: () => ({} as CpElement)
})

function dragStart(ev: MouseEvent) {
  isDrop.value = true
  tmpElement.value = JSON.parse(JSON.stringify(props.data))
  const element = tmpElement.value
  element.width = unit2unit('mm', panel.pageUnit, tmpElement.value.width)
  element.height = unit2unit('mm', panel.pageUnit, tmpElement.value.height)
  let startX = 0, startY = 0
  initElement(element)
  
  let halfWidth = element.runtimeOption.width / 2
  let halfHeight = element.runtimeOption.height / 2
  
  element.runtimeOption.parent = {} as Container
  element.runtimeOption.x = ev.clientX - appStore.panelPosition.x - halfWidth - 30
  element.runtimeOption.y = ev.clientY - appStore.panelPosition.y - halfHeight - 30
  
  element.x = px2unit(element.runtimeOption.x)
  element.y = px2unit(element.runtimeOption.y)
  
  dragWrapper.visible = true
  dragWrapper.opacity = 1
  
  startX = ev.clientX - halfWidth
  startY = ev.clientY - halfHeight
  dragWrapper.x = startX
  dragWrapper.y = startY
  
  dragWrapper.width = element.runtimeOption.width
  dragWrapper.height = element.runtimeOption.height
  
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseup);
  clearEventBubble(ev)
  
  nextTick(() => {
    dragNewElement(element.runtimeOption.target, ev)
  })
  
  function mouseMove(evMove: MouseEvent) {
    let diffXNum = -evMove.clientX + appStore.panelPosition.x
    let diffYNum = -evMove.clientY + appStore.panelPosition.y
    if (diffXNum < 0) {
      diffXNum = 0
    }
    if (diffYNum < 0) {
      diffYNum = 0
    }
    
    if (diffXNum <= halfWidth && diffYNum <= halfHeight) {
      if (diffYNum == 0) {
        dragWrapper.opacity = (diffXNum / halfWidth)
      } else if (diffXNum == 0) {
        dragWrapper.opacity = (diffYNum / halfHeight)
      } else {
        dragWrapper.opacity = ((diffXNum / halfWidth) + (diffYNum / halfHeight)) / 2;
        
      }
    }
    
    if (diffXNum == 0 && diffYNum == 0) {
      // dragWrapper.visible = false
      console.log('进入')
    } else {
      // dragWrapper.visible = true
      console.log('离开')
    }
    
    // dragWrapper.x = evMove.clientX - halfWidth
    // dragWrapper.y = evMove.clientY - halfHeight
    dragWrapper.x = unit2px(element.x) + appStore.panelPosition.x + 30
    dragWrapper.y = unit2px(element.y) + appStore.panelPosition.y + 30
  }
  
  function mouseup(_ev: MouseEvent) {
    // removeDragImg()
    
    if (dragWrapper.opacity > 0) {
      // 放回原处
      dragWrapper.opacity = 1
      dragWrapper.transitionAnime = true
      dragWrapper.x = startX;
      dragWrapper.y = startY;
      dragNewElementCancel(element.runtimeOption.target)
    } else {
      dragWrapper.visible = false
      addElement(panel, element)
      nextTick(() => {
        // setSelectedTargets()
        updatePanel([element.runtimeOption.target])
        setTimeout(()=>{
          isDrop.value = false
        },1)
      })
    }
    
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseup);
    
    
    // console.log(false)
    // dragDataValueStore.data.dragIng = false
  }
  
  // isDrop.value = true
  // dragDataValueStore.data.dragIng = true
  // const tmpElement = JSON.parse(JSON.stringify(props.data))
  //
  // tmpElement.width = unit2unit('mm', panel.pageUnit, tmpElement.width)
  // tmpElement.height = unit2unit('mm', panel.pageUnit, tmpElement.height)
  // dragDataValueStore.set('element', tmpElement)
  // mitt.emit('optionsDragStart', ev)
  // dragImg(panel, tmpElement, ev)
}

</script>
