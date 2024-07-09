<template>
    <div
        @drop="drop($event)"
        @dragover="dragover($event)"
        @dragleave="dragleave($event)">
        <slot />
    </div>
</template>

<script setup lang="ts">
// import {inject} from "vue";
// import {mittKey} from "./constants/keys";
import { dragDataStore } from '../../../stores/dragStore';

const emit = defineEmits(['drop', 'dragover', 'dragleave']);

const props = withDefaults(defineProps<{
    onPreventDefault?: Function
}>(), {
    onPreventDefault: () => true
});

// const mitt = inject(mittKey)!

// mitt.on('optionsDragStart', optionsDragStart)
const { data: dragData } = dragDataStore();

// prevent
// function optionsDragStart(ev: DragEvent) {
//   dragData.start.x = ev.offsetX
//   dragData.start.y = ev.offsetY
// }

function drop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    // console.log(dragData)
    console.log(ev);
    dragData.end.x = ev.offsetX;
    dragData.end.y = ev.offsetY;
    emit('drop', dragData);
}

function dragover(ev: DragEvent) {
    if (props.onPreventDefault(dragData)) {
        ev.preventDefault();
        ev.stopPropagation();
        emit('dragover', 'dragover');
    }
}

function dragleave(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    emit('dragleave', 'dragleave');
}
</script>
