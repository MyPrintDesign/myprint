<template>
    <div class="my-style-font-size-wrapper display-flex cursor-pointer"
         ref="fontSizeWrapperRef"
         :class="{'my-icon-disabled': disabled}">
        <tool-icon-popover
            :showArrow="false"
            :disabled="disabled">
            <template #reference>
                <div v-show="!data.fontSizeInputShow || disabled"
                     class="my-style-font-size user-select-none"
                     @click="changeFontSizeInputShow(true)">{{ data.fontSize }}
                </div>
                <my-input
                    v-show="data.fontSizeInputShow && !disabled"
                    class="my-style-font-size"
                    ref="fontSizeRef"
                    :modelValue="fontSizeComputed"
                    @update:model-value="changeFontSize"
                    :placeholder="i18n('font')" />
            </template>
            <template #panel>
                <element-align :model-value="fontSizeComputed" showSelectedStatus :elementAlignList="fontSizeList"
                               @update:model-value="changeFontSize" />
            </template>
        
        </tool-icon-popover>
        
        <div class="my-style-font-size_arrows display-flex-column">
            <my-icon class="drop-arrow icon-jt-s iconfont"
                     :size="8"
                     :disabled="disabled" @click="fontSizeAdd()">
            </my-icon>
            <my-icon class="drop-arrow icon-jt-x iconfont"
                     :size="8"
                     :disabled="disabled" @click="fontSizeSub()">
            </my-icon>
        </div>
    </div>
</template>
<script setup lang="ts">

import { multipleElementGetValue, multipleElementSetValue } from '../../../../utils/elementUtil';
import { fontSizeList } from '../../../../constants/common';
import MyIcon from '../../../../components/my/icon/my-icon.vue';
import { computed, onMounted, reactive, ref } from 'vue-demi';
import { onClickOutside } from '@vueuse/core';
import ElementAlign from '../../../../components/content/toolbar/toolbar-style/element-align.vue';
import ToolIconPopover from '../../../../components/my/icon/tool-icon-popover.vue';
import MyInput from '../../../../components/my/input/my-input.vue';
import { i18n } from '../../../../locales';

// const appStore = useAppStoreHook()

const props = withDefaults(defineProps<{
        disabled?: boolean
    }>(),
    {
        disabled: false
    });

const fontSizeRef = ref<HTMLDivElement>();
const fontSizeWrapperRef = ref<HTMLDivElement>();
const data = reactive({
    fontSizeInputShow: false,
    fontSize: '13'
});

onMounted(() => {
    onClickOutside(fontSizeWrapperRef,
        () => {
            changeFontSizeInputShow(false);
        });
});

function changeFontSize(val: any) {
    multipleElementSetValue('option.fontSize', val);
}

function fontSizeAdd() {
    changeFontSize(Number.parseInt(fontSizeComputed.value) + 1);
}

function fontSizeSub() {
    changeFontSize(Number.parseInt(fontSizeComputed.value) - 1);
}

const fontSizeComputed = computed(() => {
    const fontSize = multipleElementGetValue('option.fontSize');
    if (fontSize != undefined) {
        data.fontSize = fontSize;
    }
    return fontSize;
});

function changeFontSizeInputShow(flag: boolean) {
    if (props.disabled) {
        return;
    }
    data.fontSizeInputShow = flag;
    if (flag) {
        fontSizeRef.value.focus();
    }
}

</script>
