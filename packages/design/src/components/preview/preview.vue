<template>
  <div class="cp-print-preview-wrap"
       ref="previewWrapRef"
       :style="style">
    <element-view :element="element"/>
    <TableView v-if="element.type === 'Table'" :element="element"/>
    <preview-container v-if="element.type === 'PageHeader'" :element="element"/>
    <preview-container v-if="element.type === 'PageFooter'" :element="element"/>
  
  </div>
</template>

<script setup lang="ts">

import {computed, PropType, ref, CSSProperties} from "vue";
import ElementView from "../../components/design/element.vue";
import {PreviewWrapper} from "@cp-print/design/types/entity";
import {getTranslate, valueUnit} from "@cp-print/design/utils/elementUtil";
import PreviewContainer from "./preview-container.vue";
import TableView from "../../components/design/table/tableView.vue";

const style = computed(() => {
  const _style = {
    width: valueUnit(element.value.width),
    left: valueUnit(element.value.x),
    top: valueUnit(element.value.y),
  } as CSSProperties
  _style.transform = getTranslate(element.value)
  return _style
})

const props = defineProps({
  preview: {type: Object as PropType<PreviewWrapper>, default: () => ({})},
})
const element = computed(() => props.preview.element)
const previewWrapRef = ref<HTMLDivElement>(null)

</script>
<style scoped>

</style>
