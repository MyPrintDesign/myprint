<template>
    <div
        class="my-print-horizontal-line"
        :style="labelStyle" />
</template>
<script setup lang="ts">
import { computed } from 'vue-demi';
import { MyElement } from '@myprint/design/types/entity';
import { computedStyle } from '../computeStyle';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

const labelStyle = computed(() => {
    return computedStyle(props.element, 'horizontal', props.element.option.dottedStyle);
});

</script>
