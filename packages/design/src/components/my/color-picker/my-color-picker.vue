<template>
    <my-popover
        trigger="click"
        :disabled="disabled"
        placement="bottom">
        <template #reference>
            <div class="display-flex font-style font-color" :class="[{'my-icon-disabled': disabled}, 'my-color-icon']">
                
                <div class="display-flex-column">
                    <slot />
                    <div :style="{backgroundColor: props.modelValue}" class="font-color-display"></div>
                </div>
                
                <my-icon class="my-style-font_arrow icon-jt-x iconfont my-color-downList-arrow"
                         :size="8"
                         :disabled="disabled">
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
import MyPopover from '../../../components/my/popover/my-popover.vue';
import { rgbaToHex } from '../../../utils/utils';
import MyIcon from '../../../components/my/icon/my-icon.vue';

export interface Props {
    disabled?: boolean;
    modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    modelValue: ''
});

const emit = defineEmits(['update:modelValue']);

function changeFontColor(val: any) {
    const hexColor = rgbaToHex(val);
    emit('update:modelValue', hexColor);
}
</script>
