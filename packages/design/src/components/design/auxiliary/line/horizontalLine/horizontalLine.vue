<template>
  <div class="cp-horizontal-line__wrapper"
       :style="{maxWidth: valueUnit(element.width), width: valueUnit(element.width), height: valueUnit(element.option.borderWidth+2)}">
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
  return computedStyle(props.element, 'horizontal', 'solid')
})

</script>
<style scoped>
</style>
