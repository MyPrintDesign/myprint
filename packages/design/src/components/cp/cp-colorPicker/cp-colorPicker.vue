<template>
  <my-popover
      trigger="click"
      :disabled="!enable"
      placement="bottom">
    <template #reference>
      <div class="display-flex font-style font-color" :class="[{'cp-icon-disabled': !enable}, 'cp-color-icon']">
        
        <div class="display-flex-column">
          <slot/>
          <div :style="{backgroundColor: props.modelValue}" class="font-color-display"></div>
        </div>
        
        <cp-icon class="cp-style-font_arrow icon-jt-x iconfont cp-color-downList-arrow" :enable="enable">
        </cp-icon>
        
      </div>
    </template>
    <color-picker is-widget
                  format="rgb"
                  shape="circle"
                  :disableAlpha="true"
                  @pureColorChange="changeFontColor">
    </color-picker>
    
  </my-popover>
</template>

<script setup lang="ts">
// import "vue3-colorpicker/style.css";
// import {ColorPicker} from "vue3-colorpicker";
import MyPopover from "../cp-popover/cp-popover.vue";
import {rgbaToHex} from "@cp-print/design/utils/utils";
import CpIcon from "@cp-print/design/components/cp/icon/cp-icon.vue";

export interface Props {
  enable?: boolean
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  enable: false,
  modelValue: '',
})

const emit = defineEmits(['update:modelValue'])

function changeFontColor(val:any) {
  const hexColor = rgbaToHex(val);
  emit('update:modelValue', hexColor)
}
</script>
