<template>
  <cp-barcode v-if="element.contentType === 'Barcode'" :element="element"/>
  <cp-qrcode v-else-if="element.contentType === 'QrCode'" :element="element"/>
  <div
      v-else
      class="cp-print-text_container"
      ref="contentRef"
      :contentEditable="elementHandleEditStatusList.includes(element.runtimeOption.status)"
      v-html="element.data"
      :style="style"
      @input="handleInput"/>
</template>
<script setup lang="ts">

import {computed, onMounted, watch, ref} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import CpBarcode from "@cp-print/design/components/design/barcode";
import CpQrcode from "@cp-print/design/components/design/qrcode";

import {
  elementCommonStyle,
  formatter
} from "@cp-print/design/utils/elementUtil";
import {checkInput} from "@cp-print/design/components/moveable/moveable";
import {elementHandleEditStatusList} from "@cp-print/design/constants/common";

const props = withDefaults(defineProps<{
  element: CpElement
}>(), {
  element: () => ({} as CpElement)
})
const contentRef = ref()
onMounted(() => {
  if (props.element.data == null) {
    const data = formatter(props.element)
    if (data != null) {
      props.element.data = data
    }
  }
})

function click(event: MouseEvent) {
  // console.log('focus')
  props.element.runtimeOption.status = 'HANDLE_EDIT_ING'
  
  checkInput()
  
  const x = event.clientX;
  const y = event.clientY;
  // @ts-ignore
  const range = document.caretRangeFromPoint(x, y) || document.caretPositionFromPoint(x, y);
  
  if (range) {
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  contentRef.value.focus();
}

function handleInput(event) {
  // 处理输入事件，更新 content
  props.element.data = event.target.innerHTML;
}

const style = computed(() => {
  return elementCommonStyle(props.element)
})

watch(() => props.element.runtimeOption.status, (n, _o) => {
  if (n == 'HANDLE_ED') {
    // console.log('han')
    contentRef.value.addEventListener('click', click);
  } else {
    contentRef.value.removeEventListener('click', click);
  }
})

watch(() => props.element.contentType, (n, _o) => {
  if (n != 'QrCode') {
    // props.element.option.aspectRatio = null
  }
})
// watch(() => props.element.option.formatter, (_n, _o) => {
//   const data = formatter(props.element)
//   console.log(props.element)
//   console.log(_n, _o)
//   console.log(props.element.option.formatter, props.element.data)
//   if (data != null) {
//     props.element.data = data
//   }
// })
</script>
