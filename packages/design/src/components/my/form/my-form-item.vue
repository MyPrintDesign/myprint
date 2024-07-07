<template>
    <div class="my-form-item display-flex">
        <div class="my-form-item-label" :style="{
            width: labelWidth
        }">{{ label }}
        </div>
        <div class="my-form-item__content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
        label?: string,
        labelWidth?: string
    }>(),
    {
        labelWidth: '80px'
    });
</script>

<style scoped>

</style>
