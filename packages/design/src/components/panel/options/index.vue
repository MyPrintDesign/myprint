<template>
  <div class="options-business"
       draggable="true"
       @dragstart.native="dragStart($event)"
       @dragend.native="dragEnd">
    <span>{{ data.label }}</span>
  </div>
</template>
<script setup lang="ts">

import {inject, ref} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {dragDataStore} from "@cp-print/design/stores/dragStore";
import {dragImg, removeDragImg} from "@cp-print/design/utils/utils";
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
  dragDataValueStore.set('element', JSON.parse(JSON.stringify(props.data)))
  mitt.emit('optionsDragStart', ev)
  dragImg(panel, props.data, ev)
}

function dragEnd() {
  removeDragImg()
}
</script>
