<template>
    <textarea v-if="type == 'textarea'" class="my-textarea__inner" />
    
    <div v-else class="my-input display-flex">
        <div ref="inputWrapperRef" class="my-input__wrapper"
             :class="[{'is-focus': data.focusIs}]"
             @click="clickWrapper">
            <input class="my-input__inner"
                   ref="inputRef"
                   :disabled="disabled"
                   @blur="inputBlur"
                   @focus="inputFocus"
                   @input="onInput"
                   @change="onChange" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { isNil } from 'lodash';

const emit = defineEmits(['update:modelValue', 'change']);

const inputWrapperRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>(null!);

const props = withDefaults(defineProps<{
    modelValue: string | number | null | undefined,
    type?: string,
    disabled?: boolean,
}>(), {
    type: 'input',
    disabled: false
});

const nativeInputValue = computed(() =>
    isNil(props.modelValue) ? '' : String(props.modelValue)
);

watch(nativeInputValue, () => setNativeInputValue());

function setNativeInputValue() {
    if (!inputRef.value || inputRef.value.value === nativeInputValue.value) return;
    
    inputRef.value.value = nativeInputValue.value;
}

const data = reactive({
    focusIs: false
});

function inputBlur() {
    data.focusIs = false;
}

function inputFocus() {
    data.focusIs = true;
}

async function onInput(e: InputEvent) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
    emit('change', (e.target as HTMLInputElement).value);
    await nextTick();
    setNativeInputValue();
}

function onChange(e: InputEvent) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
    emit('change', (e.target as HTMLInputElement).value);
}

function clickWrapper() {
    // console.log(123);
    data.focusIs = true;
    inputRef.value!.focus();
}
</script>
