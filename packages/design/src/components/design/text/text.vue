<template>
  <div class="cp-print-text_container"
       ref="textRef"
       :style="style">
    123
    <cp-barcode v-if="element.contentType === 'Barcode'" :element="element"/>
    <cp-qrcode v-else-if="element.contentType === 'QrCode'" :element="element"/>
    <template v-else>
       <span
           v-if="element.option?.hiddenLabel && element.label"
           class="cp-print-text_label"
           :style="labelStyle"
       >
    {{ element.label }}:&nbsp;
    </span>
      <span
          class="cp-print-text_content"
          :style="contentStyle">
    {{ element.data }}</span>
    </template>
  
  </div>
  <!--contenteditable="true"-->

</template>
<script setup lang="ts">

import {computed, onMounted, PropType, reactive, ref, watch, CSSProperties} from "vue";
import {TextElement} from "@cp-print/design/types/entity";
import CpBarcode from "@cp-print/design/components/design/barcode";
import CpQrcode from "@cp-print/design/components/design/qrcode";

import {
  elementCommonStyle,
  formatter
} from "@cp-print/design/utils/elementUtil";

const props = defineProps({
  element: {type: Object as PropType<TextElement>, default: () => ({})}
})
const textRef = ref()

onMounted(() => {
  const data = formatter(props.element)
  if (data != null) {
    props.element.data = data
  }
  
})

const style = computed(() => {
  return elementCommonStyle(props.element)
})
const labelStyle = computed(() => {
  let styleTmp = <CSSProperties>{
    // width: props.data.getWidth(),
    // maxWidth: props.data.getWidth(),
    // height: props.data.getHeight(),
    // maxHeight: props.data.getHeight(),
    // fontFamily: props.data.option.font,
    // fontSize: props.data.option.fontSize + 'px',
  }
  //
  // let textDecoration = ''
  // if (props.data.option.underline) {
  //   textDecoration = textDecoration + 'underline '
  // }
  // if (props.data.option.lineThrough) {
  //   textDecoration = textDecoration + 'line-through '
  // }
  //
  // props.data.option.color && (styleTmp.color = props.data.option.color)
  // props.data.option.background && (styleTmp.background = props.data.option.background)
  // props.data.option.bold && (styleTmp.fontWeight = props.data.option.bold ? 'bold' : 'normal')
  // textDecoration && (styleTmp.textDecoration = textDecoration)
  // props.data.option.italic && (styleTmp.fontStyle = props.data.option.italic ? 'italic' : 'normal')
  // if (props.data.option.textAlign) {
  //   styleTmp.justifyContent = props.data.option.textAlign
  // }
  //
  // if (props.data.option.verticalAlign) {
  //   styleTmp.alignItems = props.data.option.verticalAlign
  // }
  //
  // if (props.data.option.borderAll) {
  //   styleTmp.border = '1px solid #771082'
  //   styleTmp.boxSizing = 'border-box'
  // }
  
  return styleTmp
})

const contentStyle = computed(() => {
      return {
        // height: props.data.getHeight(),
        // maxHeight: props.data.getHeight(),
      }
    }
)
watch(() => props.element.contentType, (n, o) => {
  if (n != 'QrCode') {
    props.element.option.aspectRatio = null
  }
})
watch(() => props.element.option.formatter, (n, o) => {
  const data = formatter(props.element)
  if (data != null) {
    props.element.data = data
  }
})
</script>
<style scoped>


</style>
