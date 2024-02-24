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
import {
  addElement,
  handleElementType,
  initElement,
  innerElementIs,
  installParentElement
} from "@cp-print/design/utils/elementUtil";
import {clearEventBubble} from "@cp-print/design/utils/event";
import {
  dragNewElement,
  dragNewElementCancel,
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

const padding = 30

function dragStart(ev: MouseEvent) {
  isDrop.value = true
  tmpElement.value = JSON.parse(JSON.stringify(props.data))
  const element = tmpElement.value
  let parentElement: CpElement
  
  let startX = 0, startY = 0
  // element.runtimeOption = {} as RuntimeElementOption
  // let halfWidth = element.runtimeOption.width / 2
  // let halfHeight = element.runtimeOption.height / 2
  
  let halfWidth = unit2unit('mm', 'px', tmpElement.value.width) / 2
  let halfHeight = unit2unit('mm', 'px', tmpElement.value.height) / 2
  
  startX = ev.clientX - halfWidth
  startY = ev.clientY - halfHeight
  
  // element.runtimeOption.x = startX - appStore.panelPosition.x - padding
  // element.runtimeOption.y = startY - appStore.panelPosition.y - padding
  
  element.x = px2unit(startX - appStore.panelPosition.x - padding)
  element.y = px2unit(startY - appStore.panelPosition.y - padding)
  
  element.width = unit2unit('mm', panel.pageUnit, tmpElement.value.width)
  element.height = unit2unit('mm', panel.pageUnit, tmpElement.value.height)
  
  initElement(element)
  element.runtimeOption.parent = {} as Container
  
  dragWrapper.visible = true
  dragWrapper.opacity = 1
  
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
    
    dragWrapper.x = element.runtimeOption.x + appStore.panelPosition.x + padding
    dragWrapper.y = element.runtimeOption.y + appStore.panelPosition.y + padding
    
    if (diffXNum == 0 && diffYNum == 0) {
      // dragWrapper.visible = false
      // console.log('进入')
      
      // 判断有没有进入容器/页眉/页脚
      
      const point = {x: element.runtimeOption.x + halfWidth, y: element.runtimeOption.y + halfHeight}
      // for (let elementOf of panel.elementList!) {
      //   elementOf.runtimeOption.dragInIs = false
      // }
      if (!parentElement || !innerElementIs(point, parentElement)) {
        if (parentElement) {
          parentElement.runtimeOption.dragInIs = false
          parentElement = undefined!
        }
        console.log('ff')
        if (panel.pageHeader && innerElementIs(point, panel.pageHeader)) {
          panel.pageHeader.runtimeOption.dragInIs = true
          parentElement = panel.pageHeader
        } else if (panel.pageFooter && innerElementIs(point, panel.pageFooter)) {
          panel.pageFooter.runtimeOption.dragInIs = true
          parentElement = panel.pageFooter
        } else {
          for (let elementOf of panel.elementList!) {
            if (elementOf.type == "Container" && innerElementIs(point, elementOf)) {
              elementOf.runtimeOption.dragInIs = true
              parentElement = elementOf
              break
            }
          }
        }
        if (parentElement) {
          console.log('find', parentElement)
        }
      }
      
    } else {
      // dragWrapper.visible = true
      // console.log('离开')
    }
    
    // dragWrapper.x = evMove.clientX - halfWidth
    // dragWrapper.y = evMove.clientY - halfHeight
    // console.log(element.runtimeOption.x)
    
  }
  
  function mouseup(_ev: MouseEvent) {
    if (dragWrapper.opacity > 0) {
      // 放回原处
      dragWrapper.opacity = 1
      dragWrapper.transitionAnime = true
      dragWrapper.x = startX;
      dragWrapper.y = startY;
      dragNewElementCancel(element.runtimeOption.target)
      isDrop.value = false
    } else {
      dragWrapper.visible = false
      
      if (parentElement) {
        element.x = element.x - parentElement.x
        element.y = element.y - parentElement.y
        addElement(parentElement, element)
        parentElement.runtimeOption.dragInIs = false
        parentElement = undefined!
      } else {
        handleElementType(element)
            .handle('PageHeader', () => {
                  if (panel.pageHeader != undefined) {
                    return
                  }
                  panel.pageHeader = element
                  element.width = panel.width
                  element.runtimeOption.width = unit2px(panel.width)
                  element.runtimeOption.x = 0
                  element.runtimeOption.y = 0
                  element.x = 0
                  element.y = 0
                  // element.y = panel.height - element.height
                  // element.runtimeOption.y = unit2px(panel.height - element.height)
                  installParentElement(panel, element)
                }
            )
            .handle('PageFooter', () => {
                  if (panel.pageFooter != undefined) {
                    return
                  }
                  panel.pageFooter = element
                  element.width = panel.width
                  element.runtimeOption.width = unit2px(panel.width)
                  element.runtimeOption.x = 0
                  element.x = 0
                  element.y = panel.height - element.height
                  element.runtimeOption.y = unit2px(panel.height - element.height)
                  installParentElement(panel, element)
                }
            ).end(() => {
          if (element.type == 'Table') {
            for (let i = 0; i < element.columnList!.length; i++) {
              // element.columnList[i] = to(element.columnList[i], {} as Element)
              initElement(element.columnList![i])
            }
          }
          addElement(panel, element)
        })
      }
      
      nextTick(() => {
        // setSelectedTargets()
        updatePanel([element.runtimeOption.target])
        setTimeout(() => {
          isDrop.value = false
        }, 1)
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
