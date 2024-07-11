<template>
    <div class="my-print-horizontal-line__wrapper"
         :style="{maxWidth: valueUnit(element.width), width: valueUnit(element.width), height: valueUnit(element.option!.borderWidth + 2)}">
        <div
            class="my-print-horizontal-line"
            :style="labelStyle" />
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { MyElement } from '@myprint/design/types/entity';
import { valueUnit } from '@myprint/design/utils/elementUtil';
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
