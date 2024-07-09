<template>
    <my-input :model-value="modelValue"
              @update:model-value="(val:any)=>emit('update:modelValue', val)" />
</template>

<script setup lang="ts">

import MyInput from '@myprint/design/components/my/input/my-input.vue';

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(defineProps<{
    modelValue?: string | number | null | undefined,
}>(), {
    modelValue: undefined
});


</script>
