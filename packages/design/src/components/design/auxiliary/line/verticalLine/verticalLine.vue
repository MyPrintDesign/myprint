<template>
  <div class="cp-horizontal-line__wrapper"
       :style="{width: valueUnit(element.option.borderWidth+2), height: valueUnit(element.height)}">
    <div class="cp-horizontal-line"
         :style="labelStyle"/>
  </div>
</template>
<script setup lang="ts">

import {computed} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {computedStyle} from "../computeStyle";

const props = withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})
const labelStyle = computed(() => {
  return computedStyle(props.element, 'vertical', 'solid')
})

</script>
<style scoped>

</style>
