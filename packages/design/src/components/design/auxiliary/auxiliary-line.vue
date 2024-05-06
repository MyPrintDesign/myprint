<template>
    <div :class="[props.element.direction == 'vertical'?
              'design-auxiliary-line-v': 'design-auxiliary-line-h',
              {
                'pointer-events': tmp
              }]"
         :style="style">
        <div class="design-auxiliary-line-control cursor-resize"
             data-rotation="move"
             v-if="!tmp"
             @mousedown="auxiliaryLineControlMouseDown($event)" />
        
        <div class="icon-design-remove iconfont design-auxiliary-line-remove cursor-pointer" @click="removeAuxiliaryLine" />
    </div>
</template>

<script setup lang="ts">
import { MyAuxiliaryLine } from '@myprint/design/types/entity';
import { computed, CSSProperties } from 'vue';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { getCurrentPanel } from '@myprint/design/utils/elementUtil';
import { arrayRemove } from '@myprint/design/utils/arrays';

const props = withDefaults(defineProps<{
    element: MyAuxiliaryLine,
    tmp?: boolean,
}>(), {
    element: () => ({} as MyAuxiliaryLine),
    tmp: false
});

const style = computed(() => {
    return {
        transform: `translate(${props.element.x}px, ${props.element.y}px)`
    } as CSSProperties;
});
const useApp = useAppStoreHook();

function removeAuxiliaryLine() {
    arrayRemove(getCurrentPanel().auxiliaryLineList, props.element)
}

function auxiliaryLineControlMouseDown(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { x, y } = props.element;
    
    useApp.dataRotation = 'move';
    const { offsetWidth, offsetHeight } = (event.target as HTMLDivElement).parentElement!.parentElement!;
    
    function auxiliaryLineControlMouseMove(moveEvent: MouseEvent) {
        const moveClientX = moveEvent.clientX;
        const moveClientY = moveEvent.clientY;
        if (props.element.direction == 'vertical') {
            props.element.x = Math.min(Math.max(x + moveClientX - clientX, 0), offsetWidth);
        } else {
            props.element.y = Math.min(Math.max(y + moveClientY - clientY, 0), offsetHeight);
        }
    }
    
    function auxiliaryLineControlMouseUp() {
        document.removeEventListener('mousemove', auxiliaryLineControlMouseMove);
        document.removeEventListener('mouseup', auxiliaryLineControlMouseUp);
        useApp.dataRotation = 'none';
    }
    
    event.stopPropagation();
    document.addEventListener('mousemove', auxiliaryLineControlMouseMove);
    document.addEventListener('mouseup', auxiliaryLineControlMouseUp);
}

</script>
