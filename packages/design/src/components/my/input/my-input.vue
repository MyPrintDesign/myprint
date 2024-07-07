<template>
    <textarea v-if="type == 'textarea'" class="my-textarea__inner" />
    
    <div v-else class="my-input display-flex">
        <div ref="inputWrapperRef" class="my-input__wrapper"
             :class="[{'is-focus': data.focusIs}]"
             @click="clickWrapper">
            <input class="my-input__inner"
                   ref="inputRef"
                   @blur="inputBlur"
                   :model-value="modelValue"
                   @update:model-value="(val:any)=>emit('update:modelValue', val)" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { definePropType } from '@myprint/design/constants/common';
import { reactive, ref } from 'vue';

const emit = defineEmits(['update:modelValue']);

const inputWrapperRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();

defineProps({
    modelValue: {
        type: definePropType<string | number | null | undefined>([
            String,
            Number,
            Object
        ]), default: null
    },
    type: String,
    historyLabel: String
});

const data = reactive({
    focusIs: false
});

function inputBlur() {
    data.focusIs = false;
    console.log('333');
}

function clickWrapper() {
    console.log(123);
    data.focusIs = true;
    inputRef.value!.focus();
}
</script>
