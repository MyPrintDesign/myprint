<template>
  <div class="cp-print-preview-wrap_container" :style="style">
    <component v-for="(item, index) in element.elementList" :key="index"
               :is="Preview"
               :preview="{element: item} as PreviewWrapper"/>
  </div>
</template>

<script setup lang="ts">

import {computed, PropType, CSSProperties} from "vue";
import {Element, PreviewWrapper} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import Preview from "./preview.vue";

const style = computed(() => {
  return {
    width: valueUnit(props.element.width),
    height: valueUnit(props.element.height)
  } as CSSProperties
})

const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)},
})

</script>
<style scoped>

</style>
