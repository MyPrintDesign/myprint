<template>
  <div class="options">
    <div :class="data.iconClass" class="icon"
         draggable="true"
         @dragstart.native="dragStart($event)"
         @dragend.native="dragEnd($event)"
    />
    
    <div class="icon-tip">{{ elementTypeFormat[data.type] }}</div>
  </div>
</template>
<script setup lang="ts">

import {inject, PropType, ref} from "vue";
import {Element, elementTypeFormat} from "@cp-print/design/types/entity";
import {dragDataStore} from "@cp-print/design/stores/dragStore";
import {dragImg, removeDragImg} from "@cp-print/design/utils/utils";
import {unit2unit} from "@cp-print/design/utils/devicePixelRatio";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";

const mitt = inject(mittKey)
const panel = inject(panelKey)

const dragDataValueStore = dragDataStore()
const isDrop = ref(false)

const props = defineProps({
  data: {type: Object as PropType<Element>, default: () => ({} as Element)}
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

<style scoped>
.options {
  text-align: center;
  width: 60px;
}

.icon {
  width: 60px;
  height: 40px;
  display: inline-block;
  line-height: 1;
  font-size: 40px;
}

.icon:hover {
  border-radius: 5px;
  background: var(--bg-highlight-color);
}

.icon:hover ~ .icon-tip {
  visibility: visible;
}

.icon-tip {
  visibility: hidden;
  width: 60px;
  height: 20px;
  white-space: normal;
  user-select: none;
}
</style>
