<template>
    <div class="my-style-font-wrapper display-flex cursor-pointer user-select-none"
         :class="{'my-icon-disabled': disabled}">
        <tool-icon-popover
            :disabled="!hasStyle(multipleElementGetValue('type'), 'background')">
            <template #reference>
                <div class="my-style-font">
                    {{ data.fontFamilyName }}
                </div>
            </template>
            <template #panel>
                <element-align :model-value="data.fontFamily"
                               showSelectedStatus
                               :elementAlignList="fontList"
                               @update:model-value="changeFontFamily" />
            </template>
        
        </tool-icon-popover>
    </div>
</template>

<script setup lang="ts">

import { fontList, hasStyle } from '@myprint/design/constants/common';
import { multipleElementGetValue, multipleElementSetValue } from '@myprint/design/utils/elementUtil';
import { reactive, watch } from 'vue-demi';
import ElementAlign from '@myprint/design/components/content/toolbar/toolbar-style/element-align.vue';
import ToolIconPopover from '@myprint/design/components/my/icon/tool-icon-popover.vue';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { getFontFamilyName } from '@myprint/design/utils/utils';

const appStore = useAppStoreHook();

withDefaults(defineProps<{
        disabled?: boolean
    }>(),
    {
        disabled: false
    });

const data = reactive({
    fontFamily: 'default',
    fontFamilyName: '默认'
});


watch(() => appStore.currentElement, (_n, _o) => {
    const fontFamily = multipleElementGetValue('option.fontFamily');
    if (fontFamily != undefined) {
        data.fontFamily = fontFamily;
        data.fontFamilyName = getFontFamilyName(fontFamily);
    }
});

function changeFontFamily(fontFamily: string) {
    multipleElementSetValue('option.fontFamily', fontFamily);
    data.fontFamily = fontFamily;
    data.fontFamilyName = getFontFamilyName(fontFamily);
    
}
</script>
