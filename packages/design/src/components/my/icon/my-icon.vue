<template>
    <i :class="{'my-icon-disabled': disabled,
    active: modelValue,
    'icon-focus-bk': focusBk}"
       class="style-icon"
       @click="click"
       :style="{
             'font-size': size+'px',
             'padding': padding
         }">
        <slot />
    </i>
</template>

<script setup lang="ts">

const emit = defineEmits(['update:modelValue', 'click']);

const props = withDefaults(defineProps<{
        disabled?: boolean,
        modelValue?: boolean,
        focusBk?: boolean,
        size?: number | string,
        padding?: string,
    }>(),
    {
        disabled: false,
        modelValue: false,
        focusBk: true,
        size: 20,
        padding: null!
    });

function click() {
    if (props.disabled) {
        return;
    }
    emit('update:modelValue', !props.modelValue);
    emit('click');
}

// function hover(flag: boolean) {
//     hoverFlag.value = flag;
// }

</script>
