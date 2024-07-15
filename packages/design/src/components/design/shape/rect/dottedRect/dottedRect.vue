<template>
    <div class="my-print-dotted-rect__wrapper"
         :style="{maxWidth: widthValueUnit(element), width: valueUnit(trend1(element.width - 2 * element.option.borderWidth)),
       height: valueUnit(trend1(element.height - 2 * element.option.borderWidth)),
       margin: valueUnit(element.option.borderWidth),
       outlineWidth: valueUnit(element.option.borderWidth),
       }" />
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { MyElement } from '@myprint/design/types/entity';
import { trend1 } from '@myprint/design/utils/utils';
import { valueUnit, widthValueUnit } from '@myprint/design/utils/elementUtil';

defineProps({
    element: { type: Object as PropType<MyElement>, default: () => ({} as MyElement) }
});
</script>
