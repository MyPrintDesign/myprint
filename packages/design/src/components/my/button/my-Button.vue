<template>
    <button aria-disabled="false"
            @click="click"
            :class="{
                'disabled': disabled,
                'my-button--small': size == 'small',
                'is-active': isActive
            }"
            class="my-button">
        <slot />
    </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click']);

const props = withDefaults(defineProps<{
    size?: 'small' | '',
    disabled?: boolean,
    isActive?: boolean,
}>(), {
    size: '',
    disabled: false,
    isActive: false
});

function click() {
    if (props.disabled) {
        return;
    }
    emit('click');
}
</script>
