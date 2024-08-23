<template>
    <textarea v-if="type == 'textarea'"
              ref="textareaRef"
              :disabled="disabled"
              @blur="inputBlur"
              @focus="inputFocus"
              @input="onInput"
              @change="onChange"
              :class="[{'is-focus': data.focusIs, 'is-disabled': disabled}]"
              class="my-textarea__inner" />
    
    <div v-else class="my-input display-flex">
        <div class="my-input__wrapper"
             :class="[{'is-focus': data.focusIs, 'is-disabled': disabled}]"
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
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue-demi';
import { isNil } from 'lodash-es';

const emit = defineEmits(['update:modelValue', 'change', 'input']);

const inputRef = ref<HTMLInputElement>(null!);
const textareaRef = ref<HTMLInputElement>(null!);

const props = withDefaults(defineProps<{
    modelValue: string | number | null | undefined,
    type?: string,
    disabled?: boolean,
}>(), {
    type: 'input',
    disabled: false
});
onMounted(() => {
    setNativeInputValue();
});

const myInputRef = computed(() => {
    return inputRef.value ? inputRef.value : textareaRef.value;
});

const nativeInputValue = computed(() =>
    isNil(props.modelValue) ? '' : String(props.modelValue)
);

watch(nativeInputValue, () => setNativeInputValue());

function setNativeInputValue() {
    if (!myInputRef.value || myInputRef.value.value === nativeInputValue.value) return;
    
    myInputRef.value.value = nativeInputValue.value;
}

const data = reactive({
    focusIs: false
});

function inputBlur() {
    data.focusIs = false;
}

function inputFocus() {
    if (props.disabled) {
        return;
    }
    data.focusIs = true;
}

async function onInput(e: InputEvent) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
    emit('input', (e.target as HTMLInputElement).value);
    await nextTick();
    setNativeInputValue();
}

function onChange(e: InputEvent) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
    emit('change', (e.target as HTMLInputElement).value);
}

function clickWrapper() {
    if (props.disabled) {
        return;
    }
    data.focusIs = true;
    myInputRef.value!.focus();
}
</script>
