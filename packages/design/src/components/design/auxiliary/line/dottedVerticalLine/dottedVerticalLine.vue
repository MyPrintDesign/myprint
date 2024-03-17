<template>
  <div class="cp-print-horizontal-line__wrapper"
       :style="{width:  unit2px(element.option.lineWidth)+4 +'px', height: valueUnit(element.height),}">
    <div
        class="cp-print-horizontal-line"
        :style="labelStyle"/>
  </div>
</template>
<script setup lang="ts">

import {computed} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {computedStyle} from "../computeStyle";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
const labelStyle = computed(() => {
  return computedStyle(props.element, 'vertical', props.element.option.dottedStyle)
})

</script>
