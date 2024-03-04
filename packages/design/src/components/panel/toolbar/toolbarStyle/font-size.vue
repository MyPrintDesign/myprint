<template>
  <div class="cp-style-font-size-wrapper display-flex cursor-pointer"
       ref="fontSizeWrapperRef"
       :class="{'cp-icon-disabled': !enable}">
    <tool-icon-popover
        :showArrow="false"
        :enable="enable">
      <template #reference>
        <div v-show="!data.fontSizeInputShow || !enable"
             class="cp-style-font-size user-select-none"
             @click="changeFontSizeInputShow(true)">{{ data.fontSize }}
        </div>
        <el-input
            v-show="data.fontSizeInputShow && enable"
            class="cp-style-font-size"
            ref="fontSizeRef"
            :modelValue="fontSizeComputed"
            @update:model-value="changeFontSize"
            placeholder="字体"/>
      </template>
      <template #panel>
        <element-align :model-value="fontSizeComputed" showSelectedStatus :elementAlignList="fontSizeList"
                       @update:model-value="changeFontSize"/>
      </template>
    
    </tool-icon-popover>
    
    <div class="cp-style-font-size_arrows display-flex-column">
      <cp-icon class="drop-arrow icon-jt-s iconfont" :enable="enable" @click="fontSizeAdd()">
      </cp-icon>
      <cp-icon class="drop-arrow icon-jt-x iconfont" :enable="enable" @click="fontSizeSub()">
      </cp-icon>
    </div>
  </div>
</template>
<script setup lang="ts">

import {multipleElementGetValue, multipleElementSetValue} from "@cp-print/design/utils/elementUtil";
import {fontSizeList} from "@cp-print/design/constants/common";
import CpIcon from "@cp-print/design/components/cp/icon/cp-icon.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {onClickOutside} from "@vueuse/core";
import ElementAlign from "@cp-print/design/components/panel/toolbar/toolbarStyle/element-align.vue";
import ToolIconPopover from "@cp-print/design/components/cp/icon/tool-icon-popover.vue";
import {useAppStoreHook} from "@cp-print/design/stores/app";

const appStore = useAppStoreHook()

const props = withDefaults(defineProps<{
      enable?: boolean
    }>(),
    {
      enable: false
    })

const fontSizeRef = ref()
const fontSizeWrapperRef = ref()
const data = reactive({
  fontSizeInputShow: false,
  fontSize: "13"
})

onMounted(() => {
  onClickOutside(fontSizeWrapperRef,
      () => {
        changeFontSizeInputShow(false)
      });
})

function changeFontSize(val: any) {
  multipleElementSetValue('option.fontSize', val)
}

function fontSizeAdd() {
  changeFontSize(Number.parseInt(fontSizeComputed.value) + 1)
}

function fontSizeSub() {
  changeFontSize(Number.parseInt(fontSizeComputed.value) - 1)
}

const fontSizeComputed = computed(() => {
  const fontSize = multipleElementGetValue("option.fontSize")
  if (fontSize != undefined) {
    data.fontSize = fontSize
  }
  return fontSize
})

function changeFontSizeInputShow(flag: boolean) {
  if (!props.enable) {
    return
  }
  data.fontSizeInputShow = flag
  if (flag) {
    fontSizeRef.value.focus()
  }
}

</script>
