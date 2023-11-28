<template>
  <div class="options">
    <div :class="(data as any).iconClass" class="icon"
         draggable="true"
         @dragstart.native="dragStart($event)"
         @dragend.native="dragEnd($event)"
    />
    
    <div class="icon-tip">{{ elementTypeFormat[data.type] }}</div>
  </div>
</template>
<script setup lang="ts">

import {inject, ref} from "vue";
import {Element, elementTypeFormat} from "@cp-print/design/types/entity";
import {dragDataStore} from "@cp-print/design/stores/dragStore";
import {dragImg, removeDragImg} from "@cp-print/design/utils/utils";
import {unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";

const mitt = inject(mittKey)!
const panel = inject(panelKey)!

const dragDataValueStore = dragDataStore()
const isDrop = ref(false)

const props = withDefaults(defineProps<{
  data?: Element
}>(), {
  data: () => ({} as Element)
})

function dragStart(ev: DragEvent) {
  isDrop.value = true
  dragDataValueStore.data.dragIng = true
  const tmpElement = JSON.parse(JSON.stringify(props.data))
  tmpElement.width = unit2unit('mm', panel.pageUnit, tmpElement.width)
  tmpElement.height = unit2unit('mm', panel.pageUnit, tmpElement.height)
  dragDataValueStore.set('element', tmpElement)
  mitt.emit('optionsDragStart', ev)
  dragImg(panel, tmpElement, ev)
}

function dragEnd(_ev: DragEvent) {
  removeDragImg()
  dragDataValueStore.data.dragIng = false
}
</script>
