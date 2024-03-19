<template>
  <my-popover
      trigger="click"
      :disabled="!enable"
      placement="bottom">
    <template #reference>
      <div class="display-flex font-style font-color" :class="[{'my-icon-disabled': !enable}, 'my-color-icon']">
        
        <div class="display-flex-column">
          <slot/>
          <div :style="{backgroundColor: props.modelValue}" class="font-color-display"></div>
        </div>
        
        <my-icon class="my-style-font_arrow icon-jt-x iconfont my-color-downList-arrow" :enable="enable">
        </my-icon>
        
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
import MyPopover from "@myprint/design/components/my/popover/my-popover.vue";
import {rgbaToHex} from "@myprint/design/utils/utils";
import MyIcon from "@myprint/design/components/my/icon/my-icon.vue";

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
