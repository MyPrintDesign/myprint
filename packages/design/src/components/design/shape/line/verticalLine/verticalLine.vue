<template>
    <div class="my-print-horizontal-line__wrapper"
         :style="{width: valueUnit(element.option.borderWidth+2), height: valueUnit(element.height)}">
        <div class="my-print-horizontal-line"
             :style="labelStyle" />
    </div>
</template>
<script setup lang="ts">

import { computed } from 'vue';
import { MyElement } from '../../../../../types/entity';
import { valueUnit } from '../../../../../utils/elementUtil';
import { computedStyle } from '../computeStyle';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});
const labelStyle = computed(() => {
    return computedStyle(props.element, 'vertical', 'solid');
});

</script>
<style scoped>

</style>
