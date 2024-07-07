<template>
    <div class="style-icon"
         :class="{focus: !disabled && (hoverFlag || modelValue), 'my-icon-disabled': disabled, active: modelValue}"
         @click="click"
         :style="{
             'font-size': size+'px',
             'padding': padding
         }"
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
        size?: number,
        padding?: string,
    }>(),
    {
        disabled: false,
        modelValue: false,
        size: 14,
        padding: null!
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
