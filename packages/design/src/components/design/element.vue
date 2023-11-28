<template>
  <cp-text v-if="element.type == 'Text'" :element="element"/>
  <cp-text v-else-if="element.type == 'TextTime'" :element="element"/>
  <cp-text v-else-if="element.type == 'PageNum'" :element="element"/>
  <cp-image v-else-if="element.type === 'Image'" :element="element"/>
  <cp-rect v-else-if="element.type === 'Rect'" :element="element"/>
  <cp-horizontal-line v-else-if="element.type === 'HorizontalLine'" :element="element"/>
  <cp-vertical-line v-else-if="element.type === 'VerticalLine'" :element="element"/>
  <cp-dotted-horizontal-line v-else-if="element.type === 'DottedHorizontalLine'" :element="element"/>
  <cp-dotted-vertical-line v-else-if="element.type === 'DottedVerticalLine'" :element="element"/>
</template>
<script setup lang="ts">
import CpText from './text'
import CpImage from "./image";
import {CpDottedHorizontalLine, CpDottedVerticalLine, CpHorizontalLine, CpVerticalLine, CpRect} from "./auxiliary";

import {Element, TextElement} from "@cp-print/design/types/entity";
import {PropType} from "vue";

console.log({} as TextElement)
defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})
</script>
<style scoped>

</style>
