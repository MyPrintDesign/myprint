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
import {MyElement} from "@myprint/design/types/entity";
import {dragDataStore} from "@myprint/design/stores/dragStore";
import {dragImg, removeDragImg} from "@myprint/design/utils/utils";
import {mittKey, panelKey} from "@myprint/design/constants/keys";

const mitt = inject(mittKey)!
const panel = inject(panelKey)!

const dragDataValueStore = dragDataStore()
const isDrop = ref(false)

const props = withDefaults(defineProps<{
  data?: MyElement
}>(), {
  data: () => ({} as MyElement)
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
