<template>
  <div class="cp-style-font-wrapper display-flex cursor-pointer user-select-none"
       :class="{'cp-icon-disabled': !enable}">
    <tool-icon-popover
        :enable="hasStyle(multipleElementGetValue('type'), 'background')">
      <template #reference>
        <div class="cp-style-font">
          {{ data.fontFamilyName }}
        </div>
      </template>
      <template #panel>
        <element-align :model-value="data.fontFamily"
                       showSelectedStatus
                       :elementAlignList="fontList"
                       @update:model-value="changeFontFamily"/>
      </template>
    
    </tool-icon-popover>
  </div>
</template>

<script setup lang="ts">

import {fontList, hasStyle} from "@cp-print/design/constants/common";
import {multipleElementGetValue, multipleElementSetValue} from "@cp-print/design/utils/elementUtil";
import {reactive, watch} from "vue";
import ElementAlign from "@cp-print/design/components/panel/toolbar/toolbarStyle/element-align.vue";
import ToolIconPopover from "@cp-print/design/components/cp/icon/tool-icon-popover.vue";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {getFontFamilyName} from "@cp-print/design/utils/utils";

const appStore = useAppStoreHook()

withDefaults(defineProps<{
      enable?: boolean
    }>(),
    {
      enable: false
    })

const data = reactive({
  fontFamily: "default",
  fontFamilyName: "默认"
})


watch(() => appStore.currentElement, (n, o) => {
  const fontFamily = multipleElementGetValue("option.fontFamily")
  if (fontFamily != undefined) {
    data.fontFamily = fontFamily
    data.fontFamilyName = getFontFamilyName(fontFamily)
  }
})

function changeFontFamily(fontFamily: string) {
  multipleElementSetValue('option.fontFamily', fontFamily)
  data.fontFamily = fontFamily
  data.fontFamilyName = getFontFamilyName(fontFamily)
  
}
</script>
