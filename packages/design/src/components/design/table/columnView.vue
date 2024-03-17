<template>
  <td ref="columnRef"
      class="cp-print-columnHead"
      :style="headStyle">
    <TextView :element="element"/>
  </td>
  <!--  删除按钮-->
</template>
<script setup lang="ts">

import {computed, CSSProperties, ref} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import TextView from "@cp-print/design/components/design/text";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
const columnRef = ref()

const headStyle = computed(() => {
  const style = {
    //       nowrap="nowrap"
    maxWidth: props.element.runtimeOption.width + 'px',
    width: props.element.runtimeOption.width + 'px',
    height: props.element.runtimeOption.init.height + 'px',
    maxHeight: props.element.runtimeOption.init.height + 'px',
  } as CSSProperties
  
  if (props.element.option.borderAll) {
    style['border'] = '1px solid var(--tcolor)'
  } else {
  }
  if (props.element.contentType == 'QrCode' || props.element.type == 'Image') {
    style.lineHeight = 0
  }
  return style
})

</script>
//outline: 1px solid black; border: 1px solid #000;

//outline: 1px solid black; border: 1px solid #000;

