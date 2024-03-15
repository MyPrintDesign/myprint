<template>
  <div class="cp-print-preview-wrap"
       ref="previewWrapRef"
       :style="style">
    <element-view :element="element"/>
    <TableView v-if="element!.type === 'DataTable'" :element="element"/>
    <!--    <preview-container v-if="element.type === 'PageHeader'" :element="element"/>-->
    <!--    <preview-container v-if="element.type === 'PageFooter'" :element="element"/>-->
    <cp-container v-else-if="element.type === 'Container'" :element="element">
      <Preview :element-list="element.elementList"/>
    </cp-container>
  </div>
</template>

<script setup lang="ts">

import {computed, CSSProperties} from "vue";
import ElementView from "@cp-print/design/components/design/element.vue";
import {PreviewWrapper} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import TableView from "@cp-print/design/components/design/table/tableView.vue";
import {CpContainer} from "@cp-print/design/components/design/container";

const style = computed(() => {
  const _style = {
    width: valueUnit(element.value!.width),
    left: valueUnit(element.value!.x),
    top: valueUnit(element.value!.y),
  } as CSSProperties
  if (element.value.previewRuntimeOption.heightIs) {
    _style.height = valueUnit(element.value!.height)
  }
  // console.log('change', element.value.previewRuntimeOption.heightIs)
  // _style.transform = getTranslate(element.value!)
  return _style
})
const props = withDefaults(defineProps<{
  preview: PreviewWrapper
}>(), {
  preview: () => ({} as PreviewWrapper)
})
// console.log(props.preview)

const element = computed(() => props.preview.element)

</script>
