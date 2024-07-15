<template>
    <my-input-number :model-value="modelValue"
                     ref="numRef"
                     class="custom-input-number"
                     :controls="false" :precision="2"
                     @update:model-value="(val:any)=>emit('update:modelValue', val)"
                     @change="change">
    </my-input-number>
</template>

<script setup lang="ts">
import { changeWrapper } from '@myprint/design/utils/historyUtil';
import { onMounted, ref } from 'vue';
import MyInputNumber from '@myprint/design/components/my/input/my-input-number.vue';

const emit = defineEmits(['update:modelValue', 'change']);
const numRef = ref(<InstanceType<any>>{});
// const props = defineProps({
//   modelValue: {
//     type: , default: null
//   },
//   historyLabel: String
// })
const props = withDefaults(defineProps<{
    modelValue?: number | null | undefined,
    historyLabel: string,
}>(), {
    modelValue: undefined,
    historyLabel: undefined
});

function change(val: any) {
    changeWrapper(val, props.historyLabel);
    emit('change', val);
}

onMounted(() => {
    // const inputNumber = numRef.value.$el.querySelector('.el-input__inner');
    // inputNumber.onmousewheel = null;  // for most browsers
    // inputNumber.onwheel = null;  // for Firefox
});

</script>
