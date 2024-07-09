<template>
    <div class="my-print-rect__wrapper"
         :style="{maxWidth: valueUnit(element.width),
       width: valueUnit(trend1(element.width)),
       height: valueUnit(trend1(element.height)),
       }"
         @drop="drop($event)" />
</template>
<script setup lang="ts">

import { PropType } from 'vue';
import { MyElement } from '../../../../../types/entity';
import { trend1 } from '../../../../../utils/utils';
import { valueUnit } from '../../../../../utils/elementUtil';

defineProps({
    element: { type: Object as PropType<MyElement>, default: () => ({} as MyElement) }
});

function drop(_event: DragEvent) {
    console.log('drop');
    // event.stopPropagation()
}

</script>
<style scoped>


</style>
