<template>
  <img ref="qrCode" id="qrCode"
       :style="{
    width: widthValueUnit(element),
    height: heightValueUnit(element),
  }" alt=""
       :src="src"/>
</template>

<script setup lang="ts">
import {Element} from "@cp-print/design/types/entity";
import {ref, watch} from "vue";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import QRCode from 'qrcode'
import {heightValueUnit, widthValueUnit} from "@cp-print/design/utils/elementUtil";

const props = withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})

const qrCode = ref()
const src = ref()
watch([() => qrCode.value, () => props.element.data, () => props.element.height, () => props.element.option.color, () => props.element.option.background], (_n, _o) => {
  if (qrCode.value == null) {
    return
  }
  if (props.element.data == null) {
    return
  }
  if (props.element.data == '') {
    return
  }
  console.log(props.element.data)
  
  QRCode.toDataURL(props.element.data, {
    // version: 1,
    errorCorrectionLevel: 'Q', // low, medium, quartile, high or L, M, Q, H
    maskPattern: 7, // 0, 1, 2, 3, 4, 5, 6, 7
    margin: 0, // Define how much wide the quiet zone should be
    scale: 4,
    width: unit2px(props.element.width), // 宽度
    color: {
      light: props.element.option.background, // 背景色
      dark: props.element.option.color // 二维码颜色
    }
  }, (error, url) => {
    if (error) {
      console.error(error)
      return
    }
    
    src.value = url
    // console.log('success!')
  })
  props.element.height = props.element.width
  props.element.option.aspectRatio = 1
}, {immediate: true})
</script>
