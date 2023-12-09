<template>
  <div class="cp-print-preview-wrap"
       ref="previewWrapRef"
       :style="style">
    <element-view :element="element"/>
    <TableView v-if="element!.type === 'Table'" :element="element"/>
<!--    <preview-container v-if="element.type === 'PageHeader'" :element="element"/>-->
<!--    <preview-container v-if="element.type === 'PageFooter'" :element="element"/>-->
  
  </div>
</template>

<script setup lang="ts">

import {computed, CSSProperties} from "vue";
import ElementView from "../../components/design/element.vue";
import {PreviewWrapper} from "../../types/entity";
import {getTranslate, valueUnit} from "../../utils/elementUtil";
// import PreviewContainer from "./preview-container.vue";
import TableView from "../../components/design/table/tableView.vue";

const style = computed(() => {
  const _style = {
    width: valueUnit(element.value!.width),
    left: valueUnit(element.value!.x),
    top: valueUnit(element.value!.y),
  } as CSSProperties
  _style.transform = getTranslate(element.value!)
  return _style
})
const props = withDefaults(defineProps<{
  preview?: PreviewWrapper
}>(), {
  preview: () => ({} as PreviewWrapper)
})
const element = computed(() => props.preview.element)!

</script>
