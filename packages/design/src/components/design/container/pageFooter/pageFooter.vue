<template>
  
  <cp-drag
      :element="element"
      snap
      :drag="false"
      :handles="['tm']"
      :min-width="200"
      :min-height="200" class="page-footer">
    <cp-drop
        class="container"
        :class="{
        'cp-print-container_over': data.dropOver
      }"
        @drop="drop"
        @dragover="dragover"
        @dragleave="dragleave"
        @preventDefault="dropPreventDefault">
      <element-list :element-list="element.elementList"/>
    </cp-drop>
  </cp-drag>

</template>

<script setup lang="ts">
import {onMounted, PropType} from "vue";
import {DragWrapper, Element} from "@cp-print/design/types/entity";
import CpDrag from "@cp-print/design/components/design/drag";
import {inject, reactive, watch} from "vue";
import {mittKey} from "@cp-print/design/constants/keys";
import CpDrop from "@cp-print/design/components/cp/drop";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {addElement, initElement} from "@cp-print/design/utils/elementUtil";
import ElementList from "../../elementList.vue";

const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})
const mitt = inject(mittKey)
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
  
  dragElement.x = px2unit(dragData.end.x - dragData.start.x)
  dragElement.y = px2unit(dragData.end.y - dragData.start.y)
  addElement(props.element, dragElement)
  
  data.dropOver = false
}

function dragover(msg) {
  console.log(msg)
  
  data.dropOver = true
}

function dragleave(msg) {
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
.page-footer {

}

.container {
  width: 100%;
  height: 100%;
}

</style>
