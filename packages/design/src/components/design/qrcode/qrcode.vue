<template>
  <img ref="qrCode" id="qrCode"
       :style="{
    width: widthValueUnit(element),
    height: heightValueUnit(element),
  }" alt=""
       :src="src"/>
</template>

<script setup lang="ts">
import {MyElement} from "@myprint/design/types/entity";
import {nextTick, ref, watch} from "vue";
import {unit2px} from "@myprint/design/utils/devicePixelRatio";
import QRCode from 'qrcode'
import {heightValueUnit, widthValueUnit} from "@myprint/design/utils/elementUtil";
import {updateMoveableRect} from "@myprint/design/plugins/moveable/moveable";
import _ from 'lodash'

const props = withDefaults(defineProps<{
  element?: MyElement
}>(), {
  element: () => ({} as MyElement)
})

const qrCode = ref()
const src = ref()

const freshQrCode = _.throttle((resetHeight: boolean) => {
  if (qrCode.value == null) {
    return
  }
  if (props.element.data == null) {
    return
  }
  if (props.element.data == '') {
    return
  }
  // console.log(props.element.data)
  
  QRCode.toDataURL(props.element.data, {
    // version: 1,
    errorCorrectionLevel: 'Q', // low, medium, quartile, high or L, M, Q, H
    maskPattern: 7, // 0, 1, 2, 3, 4, 5, 6, 7
    margin: 0, // Define how much wide the quiet zone should be
    scale: 4,
    width: unit2px(Math.min(props.element.width, props.element.height)), // 宽度
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
  })
  // console.log(props.element.runtimeOption.workEnvironment )
  if (resetHeight && props.element.runtimeOption.workEnvironment !== 'DataTable') {
    props.element.height = props.element.width
    props.element.runtimeOption.height = props.element.runtimeOption.width
    props.element.runtimeOption.init.height = props.element.runtimeOption.width
    nextTick(() => {
      updateMoveableRect()
    })
  }
}, 100)


watch([() => qrCode.value, () => props.element.data, () => props.element.option.color, () => props.element.option.background], (_n, _o) => {
  freshQrCode(true)
}, {immediate: true})


watch([() => props.element.width, () => props.element.height], (_n, _o) => {
  freshQrCode(false)
}, {immediate: true})
</script>
