<template>
  <el-tooltip :content="tips"
              :disabled="tips == ''"
              :show-after="200"
              :enterable="false"
              :hide-after="0"
              trigger="hover"
              placement="bottom">
    <div class="style-icon"
         :class="{focus: enable && (hoverFlag || modelValue), 'cp-icon-disabled': !enable}"
         :style="{marginTop: marginTop}"
         @click="click"
         @mouseover="hover(true)"
         @mouseleave="hover(false)">
      <slot/>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
// import {ElTooltip} from 'element-plus'
import {inject, ref} from "vue";
import {mittKey} from "@cp-print/design/constants/keys";
import {ActionEnum, Snapshot} from "@cp-print/design/utils/historyUtil";
import {useAppStoreHook} from "@cp-print/design/stores/app";
const appStore = useAppStoreHook()
const emit = defineEmits(['update:modelValue'])
const mitt = inject(mittKey)!

const props = withDefaults(defineProps<{
      tips?: string,
      enable?: boolean,
      modelValue?: boolean,
      marginTop?: string,
    }>(),
    {
      tips: "",
      enable: false,
      modelValue: false,
      marginTop: ""
    })

const hoverFlag = ref(false)

function click() {
  if (!props.enable) {
    return
  }
  emit('update:modelValue', !props.modelValue)
  mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, element: appStore.currentElement} as Snapshot)
}

function hover(flag: boolean) {
  hoverFlag.value = flag
}

</script>
