<template>
  <my-popover
      trigger="click"
      placement="bottom">
    <template #reference>
      <div class="display-flex font-style font-color" :class="{'cp-icon-disabled': !enable}">
        <div class="display-flex">
          <div class="display-flex-column">
            <slot/>
            <div :style="{backgroundColor: props.modelValue}" class="font-color-display"></div>
          </div>
          <svg viewBox="0 0 1024 1024"
               width="10" height="10">
            <path fill="currentColor"
                  d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
          </svg>
        </div>
      
      </div>
    </template>
<!--    <color-picker is-widget-->
<!--                  format="rgb"-->
<!--                  shape="circle"-->
<!--                  :disableAlpha="true"-->
<!--                  roundHistory-->
<!--                  @pureColorChange="changeFontColor">-->
<!--    </color-picker>-->
    
    <!--          <el-button type="primary" @click="confirm">确定</el-button>-->
    <!--          <el-button @click="isShowColorPicker(false)">关闭</el-button>-->
  
  </my-popover>
</template>

<script setup lang="ts">

import {ColorPicker} from "vue3-colorpicker";
import MyPopover from "../cp-popover/cp-popover.vue";
import {rgbaToHex} from "@cp-print/design/utils/utils";


const props = defineProps({
  enable: {type: Boolean, default: false},
  modelValue: {type: String, default: ''},
})
const emit = defineEmits(['update:modelValue'])

function changeFontColor(val) {
  const hexColor = rgbaToHex(val);
  emit('update:modelValue', hexColor)
}



</script>

<style scoped>
.font-color-display {
  width: 20px;
  height: 2px;
}

</style>

<style lang="scss">

</style>
