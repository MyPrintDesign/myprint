<template>
  <div class="cp-print-preview-wrap_container" :style="style">
    <component v-for="(item, index) in element.elementList" :key="index"
               :is="Preview"
               :preview="{element: item} as PreviewWrapper"/>
  </div>
</template>

<script setup lang="ts">

import {computed, CSSProperties} from "vue";
import {CpElement, PreviewWrapper} from "../design/src/types/entity";
import {valueUnit} from "../design/src/utils/elementUtil";
import Preview from "../design/src/components/preview/preview.vue";

console.log({} as PreviewWrapper)
const style = computed(() => {
  return {
    width: valueUnit(props.element.width),
    height: valueUnit(props.element.height)
  } as CSSProperties
})

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
</script>
