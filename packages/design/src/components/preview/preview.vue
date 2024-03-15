<template>
  <div class="cp-print-preview-wrap"
       ref="previewWrapRef"
       :style="style">
    <element-view :element="preview"/>
    <TableView v-if="preview!.type === 'DataTable'" :element="preview"/>
    <!--    <preview-container v-if="element.type === 'PageHeader'" :element="element"/>-->
    <!--    <preview-container v-if="element.type === 'PageFooter'" :element="element"/>-->
    <cp-container v-else-if="preview.type === 'Container'" :element="preview">
      <Preview v-for="(item, index) in preview.previewWrapperList" :preview="item" :key="index"/>
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
    width: valueUnit(props.preview.width),
    left: valueUnit(props.preview.x),
    top: valueUnit(props.preview.y),
  } as CSSProperties
  if (props.preview.heightIs) {
    _style.height = valueUnit(props.preview.height)
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

// const element = computed(() => props.preview.element)

</script>
