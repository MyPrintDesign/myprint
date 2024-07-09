<template>
    <my-select :model-value="modelValue"
               :data-list="dataList"
               @update:model-value="(val:any)=>emit('update:modelValue', val)"
               @change="(val:any)=>changeWrapper(val, historyLabel)" />
</template>

<script setup lang="ts">
import { definePropType } from '@myprint/design/constants/common';
import { changeWrapper } from '@myprint/design/utils/historyUtil';
import MySelect from '@myprint/design/components/my/select/my-select.vue';

const emit = defineEmits(['update:modelValue']);

defineProps({
    modelValue: {
        type: definePropType<string | number | null | undefined>([
            String,
            Number,
            Object
        ]), default: null
    },
    dataList: {
        type: definePropType<any[]>([
            Array
        ]),
        default: () => []
    },
    historyLabel: String
});


</script>
