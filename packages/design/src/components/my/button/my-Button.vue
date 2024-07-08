<template>
    <button aria-disabled="false"
            :class="{
                'my-button--small': size == 'small',
                'is-active': isActive
            }"
            class="my-button">
        <slot />
    </button>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
    size?: 'small' | '',
    isActive?: boolean,
}>(), {
    size: '',
    isActive: false
});

</script>
