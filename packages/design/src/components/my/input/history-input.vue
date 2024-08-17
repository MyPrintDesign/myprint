<template>
  <my-input :model-value="modelValue"
            @update:model-value="(val:any)=>emit('update:modelValue', val)"
            @change="(val:any)=>changeWrapper(val, historyLabel)"/>
</template>

<script setup lang="ts">
import {definePropType} from "../../../constants/common";
import {changeWrapper} from "../../../utils/historyUtil";
import MyInput from '../../../components/my/input/my-input.vue';

const emit = defineEmits(['update:modelValue'])

defineProps({
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
