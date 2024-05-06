<template>
  <div class="my-print-horizontal-line__wrapper"
       :style="{maxWidth: valueUnit(element.width), width: valueUnit(element.width), height: unit2px(element.option.lineWidth)+4 +'px'}">
    <div class="my-print-horizontal-line"
         :style="labelStyle"/>
  </div>
</template>
<script setup lang="ts">

import {computed} from "vue";
import {MyElement} from "@myprint/design/types/entity";
import {valueUnit} from "@myprint/design/utils/elementUtil";
import {computedStyle} from "../computeStyle";
import {unit2px} from "@myprint/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element?: MyElement
}>(), {
  element: () => ({} as MyElement)
})
const labelStyle = computed(() => {
  return computedStyle(props.element, 'horizontal', 'solid')
})

</script>
<style scoped>
</style>
