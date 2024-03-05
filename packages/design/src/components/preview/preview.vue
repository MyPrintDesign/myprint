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
import ElementView from "@cp-print/design/components/design/element.vue";
import {PreviewWrapper} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import TableView from "@cp-print/design/components/design/table/tableView.vue";

const style = computed(() => {
  const _style = {
    width: valueUnit(element.value!.width),
    left: valueUnit(element.value!.x),
    top: valueUnit(element.value!.y),
  } as CSSProperties
  // _style.transform = getTranslate(element.value!)
  return _style
})
const props = withDefaults(defineProps<{
  preview?: PreviewWrapper
}>(), {
  preview: () => ({} as PreviewWrapper)
})
const element = computed(() => props.preview.element)!

</script>
