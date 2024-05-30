<template>
    <div class="module_item" @click="click">{{ node.label }}</div>
</template>

<script setup lang="ts">
const $emit = defineEmits(['click']);

const props = withDefaults(defineProps<{
    node?: any
}>(), {
    node: () => ({})
});

function click() {
    $emit('click', props.node.data);
}
</script>

<style scoped lang="scss">
.module_item {
    width: 100%;
    height: 100%;
}
</style>
