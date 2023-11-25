<template>
  <div class="cp-rect__wrapper"
       :style="{maxWidth: valueUnit(element.width), width: valueUnit(trend1(element.width - 2 * element.option.borderWidth)),
       height: valueUnit(trend1(element.height - 2 * element.option.borderWidth)),
       margin: valueUnit(element.option.borderWidth),
       outlineWidth: valueUnit(element.option.borderWidth),
       }"
       @drop="drop($event)"/>
</template>
<script setup lang="ts">

import {PropType} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {trend1} from "@cp-print/design/utils/utils";
import {valueUnit} from "@cp-print/design/utils/elementUtil";

defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

function drop(event: DragEvent) {
  console.log('drop')
  // event.stopPropagation()
}

</script>
<style scoped>


</style>
