<template>
    <my-input :model-value="innerValue"
              @keydown.up.prevent="onUp"
              @keydown.down.prevent="onDown"
              :disabled="disabled"
              @input="onInput"
              @change="onChange"
              autocomplete="off" />
</template>

<script setup lang="ts">

import MyInput from '@myprint/design/components/my/input/my-input.vue';
import { computed, ref, watch } from 'vue-demi';
import numberUtil from '@myprint/design/utils/numberUtil';
import { isEmpty } from 'lodash';

const emit = defineEmits(['update:modelValue', 'change']);

const props = withDefaults(defineProps<{
    modelValue?: number | null | undefined,
    min?: number // 最小值
    max?: number,
    step?: number, // 每次改变步数，可以为小数
    formatter?: Function // 指定展示值的格式
    precision?: number // 数值精度
    disabled?: boolean // 是否禁用
}>(), {
    modelValue: undefined,
    min: -Infinity,
    max: Infinity,
    formatter: (value: string) => value,
    step: 1,
    precision: 0,
    disabled: false // 是否禁用
});

const innerValue = ref(props.modelValue);
watch(() => props.modelValue, (_newVal, _oldVal) => {
    innerValue.value = props.modelValue;
});


const precision = computed(() => {
    // 数值精度取步长和精度中较大者
    const stepPrecision = String(props.step).split('.')[1]?.length || 0;
    return Math.max(props.precision, stepPrecision);
});

function emitValue(value: number | null) {
    if (value == props.modelValue) {
        return;
    }
    emit('update:modelValue', value);
    emit('change', value);
}

// const numValue = ref(props.formatter(props.modelValue?.toFixed(precision.value)));

// watch(
//     () => props.modelValue,
//     (to) => {
//         numValue.value = to === null ? null : props.formatter(Number(to).toFixed(precision.value));
//     }
// );
//
// watch(numValue, (to) => {
//     if (!to) {
//         emitValue(null);
//     }
// });

function onInput(value: any) {
    
    if (isEmpty(value)) {
        emitValue(value);
        return;
    }
    
    value = value.replace(/,/g, '');
    // console.log('onInput', value, parseFloat(value));
    if (!Number.isNaN(parseFloat(value))) {
        console.log('onInput', value);
        // emitValue(value);
        innerValue.value = value
    }
}

function onChange(value: any) {
    console.log('onChange', value);
    value = value.replace(/,/g, '');
    if (!Number.isNaN(parseFloat(value))) {
        // Number.isNaN() 判断传递的值是否为NaN，并检测器类型是否为 Number
        if (parseFloat(value) > props.max) {
            emitValue(props.max);
            return;
        }
        if (parseFloat(value) < props.min) {
            emitValue(props.min);
            return;
        }
        if (parseFloat(value) !== props.modelValue) {
            console.log('onChange', parseFloat(value));
            emitValue(parseFloat(value));
        } else {
            // value = props.modelValue?.toFixed(precision.value);
            console.log('onChange', parseFloat(value));
            emitValue(parseFloat(value));
        }
    } else {
        // numValue.value = props.modelValue?.toFixed(precision.value);
        console.log('onChange', value);
        emitValue(parseFloat(value));
    }
    
}

function onUp() {
    const res = parseFloat(Math.min(props.max, numberUtil.sum(props.modelValue || 0, +props.step)).toFixed(precision.value));
    emitValue(res);
}

function onDown() {
    const res = parseFloat(Math.max(props.min, numberUtil.sum(props.modelValue || 0, -props.step)).toFixed(precision.value));
    emitValue(res);
}
</script>
