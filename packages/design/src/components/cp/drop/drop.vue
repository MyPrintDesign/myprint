<template>
  <div
      @drop="drop($event)"
      @dragover="dragover($event)"
      @dragleave="dragleave($event)">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {mittKey} from "@cp-print/design/constants/keys";
import {dragDataStore} from "@cp-print/design/stores/dragStore";

const emit = defineEmits(['drop', 'dragover', 'dragleave'])

const props = defineProps({
  onPreventDefault: {
    type: Function,
    default: () => true
  },
})
const mitt = inject(mittKey)

mitt.on('optionsDragStart', optionsDragStart)
const {data: dragData} = dragDataStore()

// prevent
function optionsDragStart(ev) {
  dragData.start.x = ev.offsetX
  dragData.start.y = ev.offsetY
}

function drop(ev) {
  ev.preventDefault()
  ev.stopPropagation()
  
  // console.log(dragData)
  console.log(ev)
  dragData.end.x = ev.offsetX
  dragData.end.y = ev.offsetY
  emit('drop', dragData)
}

function dragover(ev) {
  if (props.onPreventDefault(dragData)) {
    ev.preventDefault()
    ev.stopPropagation()
    emit('dragover', 'dragover')
  }
}

function dragleave(ev) {
  ev.preventDefault()
  ev.stopPropagation()
  emit('dragleave', 'dragleave')
}
</script>

<style scoped>

</style>
