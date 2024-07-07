<template>
  <div class="my-style-font-size-wrapper display-flex cursor-pointer"
       ref="fontSizeWrapperRef"
       :class="{'my-icon-disabled': !enable}">
    <tool-icon-popover
        :showArrow="false"
        :enable="enable">
      <template #reference>
        <div v-show="!data.fontSizeInputShow || !enable"
             class="my-style-font-size user-select-none"
             @click="changeFontSizeInputShow(true)">{{ data.fontSize }}
        </div>
        <el-input
            v-show="data.fontSizeInputShow && enable"
            class="my-style-font-size"
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
    
    <div class="my-style-font-size_arrows display-flex-column">
      <my-icon class="drop-arrow icon-jt-s iconfont"
               :size="8"
               :enable="enable" @click="fontSizeAdd()">
      </my-icon>
      <my-icon class="drop-arrow icon-jt-x iconfont"
               :size="8"
               :enable="enable" @click="fontSizeSub()">
      </my-icon>
    </div>
  </div>
</template>
<script setup lang="ts">

import { multipleElementGetValue, multipleElementSetValue } from "@myprint/design/utils/elementUtil";
import { fontSizeList } from "@myprint/design/constants/common";
import MyIcon from "@myprint/design/components/my/icon/my-icon.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import ElementAlign from "@myprint/design/components/content/toolbar/toolbar-style/element-align.vue";
import ToolIconPopover from "@myprint/design/components/my/icon/tool-icon-popover.vue";

// const appStore = useAppStoreHook()

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
