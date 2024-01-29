<template>
  <cp-drop
      @drop="drop"
      class="container"
      :class="{
          'cp-print-container_over': data.dropOver
        }"
      @dragover="dragover"
      @dragleave="dragleave">
    <slot/>
  </cp-drop>
</template>

<script setup lang="ts">
// 可以接收拖动组件

import {DragWrapper, CpElement} from "@cp-print/design/types/entity";
import {onMounted, reactive} from "vue";
import CpDrop from "@cp-print/design/components/cp/drop";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {addElement} from "@cp-print/design/utils/elementUtil";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})

// const mitt = inject(mittKey)
const data = reactive({
  dropOver: false
})

onMounted(() => {
})

function drop(dragData: DragWrapper) {
  console.log("页脚拖放")
  // 计算位置
  console.log(dragData.element)
  const dragElement = dragData.element
  
  dragElement.x = px2unit(dragData.end.x! - dragData.start.x!)
  dragElement.y = px2unit(dragData.end.y! - dragData.start.y!)
  addElement(props.element, dragElement)
  
  data.dropOver = false
}

function dragover(msg: string) {
  console.log(msg)
  
  data.dropOver = true
}

function dragleave(msg: string) {
  console.log(msg)
  data.dropOver = false
}


function dropPreventDefault(dragData: DragWrapper) {
  const element = dragData.element
  if (['PageHeader', 'PageFooter'].includes(element.type)) {
    return false
  }
  return true
}

// watch(() => element.height, (n, o) => {
//   console.log(element.height)
// })
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.container_over {
  z-index: 1;
  outline: 4px solid var(--drag-h-color);
}
</style>
