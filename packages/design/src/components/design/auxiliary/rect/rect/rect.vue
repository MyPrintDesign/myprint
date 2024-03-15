<template>
  <div class="cp-print-rect__wrapper"
       :style="{maxWidth: valueUnit(element.width),
       width: valueUnit(trend1(element.width)),
       height: valueUnit(trend1(element.height)),
       }"
       @drop="drop($event)"/>
</template>
<script setup lang="ts">

import {PropType} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import {trend1} from "@cp-print/design/utils/utils";
import {valueUnit} from "@cp-print/design/utils/elementUtil";

defineProps({
  element: {type: Object as PropType<CpElement>, default: () => ({} as CpElement)}
})

function drop(_event: DragEvent) {
  console.log('drop')
  // event.stopPropagation()
}

</script>
<style scoped>


</style>
