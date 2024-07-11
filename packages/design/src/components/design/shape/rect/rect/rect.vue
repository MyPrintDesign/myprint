<template>
    <div class="my-print-rect__wrapper"
         :style="{maxWidth: valueUnit(element.width),
       width: valueUnit(trend1(element.width)),
       height: valueUnit(trend1(element.height)),
       }" />
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { MyElement } from '@myprint/design/types/entity';
import { trend1 } from '@myprint/design/utils/utils';
import { valueUnit } from '@myprint/design/utils/elementUtil';

defineProps({
    element: { type: Object as PropType<MyElement>, default: () => ({} as MyElement) }
});

</script>
