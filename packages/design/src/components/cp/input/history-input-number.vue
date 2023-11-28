<template>
  <el-input-number :model-value="modelValue"
                   ref="numRef"
                   class="custom-input-number"
                   :controls="false" :precision="2"
                   @update:model-value="(val:any)=>emit('update:modelValue', val)"
                   @change="(val:any)=>changeWrapper(val, historyLabel)">
  </el-input-number>
</template>

<script setup lang="ts">

// import { ElInputNumber } from 'element-plus'
// import {definePropType} from "@cp-print/design/constants/common";
import {changeWrapper} from "@cp-print/design/utils/historyUtil";
import {onMounted, ref} from "vue";

const emit = defineEmits(['update:modelValue'])
const numRef = ref(<InstanceType<any>>{})
// const props = defineProps({
//   modelValue: {
//     type: , default: null
//   },
//   historyLabel: String
// })
withDefaults(defineProps<{
  modelValue?: number | object,
  historyLabel: string,
}>(), {
  modelValue: null,
  historyLabel: null,
})

onMounted(() => {
  const inputNumber = numRef.value.$el.querySelector('.el-input__inner');
  inputNumber.onmousewheel = null;  // for most browsers
  inputNumber.onwheel = null;  // for Firefox
})

</script>


<style lang="scss">
.custom-input-number .el-input__wrapper {
  padding: 0 !important;
}
</style>
