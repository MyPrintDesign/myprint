<template>
  <el-input :model-value="modelValue"
            @update:model-value="(val)=>emit('update:modelValue', val)"
            @change="val=>changeWrapper(val, historyLabel)"/>
</template>

<script setup lang="ts">

import { ElInput } from 'element-plus'
import {definePropType} from "@cp-print/design/constants/common";
import {changeWrapper} from "@cp-print/design/utils/historyUtil";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: definePropType<string | number | null | undefined>([
      String,
      Number,
      Object,
    ]), default: null
  },
  historyLabel: String
})


</script>

<style lang="scss">
</style>
