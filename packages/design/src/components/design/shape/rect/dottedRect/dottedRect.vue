<template>
    <div class="my-print-dotted-rect__wrapper"
         :style="labelStyle" />
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue-demi';
import { MyElement } from '@myprint/design/types/entity';
import { computedStyle } from '@myprint/design/components/design/shape/line/computeStyle';

const props = defineProps({
    element: { type: Object as PropType<MyElement>, default: () => ({} as MyElement) }
});

const labelStyle = computed(() => {
    return computedStyle(props.element, 'rect', 'solid');
});

</script>
