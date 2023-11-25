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
import { ElTooltip } from 'element-plus'
import {inject, nextTick, ref} from "vue";
import {mittKey} from "@cp-print/design/constants/keys";
import {ActionEnum, Snapshot} from "@cp-print/design/utils/historyUtil";
import {getCurrentElement} from "@cp-print/design/utils/elementUtil";

const emit = defineEmits(['update:modelValue'])
const mitt = inject(mittKey)

const props = defineProps({
  tips: {type: String, default: ""},
  enable: {type: Boolean, default: false},
  modelValue: {type: Boolean, default: false},
  marginTop: {type: String, default: ""}
})

const hoverFlag = ref(false)

function click() {
  if (!props.enable) {
    return
  }
  emit('update:modelValue', !props.modelValue)
  mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, element: getCurrentElement().value} as Snapshot)
}

function hover(flag) {
  hoverFlag.value = flag
}

</script>

<style scoped>

.focus {
  background: #a0cfff;
}

.style-icon {
  text-align: center;
  border-radius: 3px;
  width: 23px;
  height: 23px;
}

</style>
