<template>
  <div class="options"
       draggable="true"
       @dragstart.native="dragStart($event)"
       @dragend.native="dragEnd($event)">
    <span>{{ data.label }}</span>
  </div>
</template>
<script setup lang="ts">

import {inject, onMounted, PropType, ref} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {dragDataStore} from "@cp-print/design/stores/dragStore";
import {dragImg, removeDragImg} from "@cp-print/design/utils/utils";
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
  dragDataValueStore.set('element', JSON.parse(JSON.stringify(props.data)))
  mitt.emit('optionsDragStart', ev)
  dragImg(panel, props.data, ev)
}

function dragEnd() {
  removeDragImg()
}
</script>

<style scoped>
.options {
  justify-content: center;
  align-items: center;
  width: 85px;
  height: 30px;
  display: inline-flex;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  border: 1px var(--border-highlight-color) solid;
  box-sizing: border-box;
}
</style>
