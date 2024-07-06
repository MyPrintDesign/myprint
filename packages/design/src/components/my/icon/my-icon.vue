<template>
    <div class="style-icon"
         :class="{focus: !disabled && (hoverFlag || modelValue), 'my-icon-disabled': disabled, active: modelValue}"
         @click="click"
         @mouseover="hover(true)"
         @mouseleave="hover(false)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue', 'click']);

const props = withDefaults(defineProps<{
        disabled?: boolean,
        modelValue?: boolean,
    }>(),
    {
        disabled: true,
        modelValue: false
    });

const hoverFlag = ref(false);

function click() {
    if (props.disabled) {
        return;
    }
    emit('update:modelValue', !props.modelValue);
    emit('click');
}

function hover(flag: boolean) {
    hoverFlag.value = flag;
}

</script>
