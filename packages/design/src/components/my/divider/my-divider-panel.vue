<template>
    <my-divider v-if="data.basicDividerShowIs" :class="props.class">
        <slot name="divider" />
    </my-divider>
    <div ref="basicDividerRef">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue-demi';
import MyDivider from '@myprint/design/components/my/divider/my-divider.vue';
import { mitt } from '@myprint/design/utils/utils';

const props = withDefaults(defineProps<{
        class?: string,
    }>(),
    {
        class: undefined
    });

const data = reactive({
    basicDividerShowIs: true
});
const basicDividerRef = ref<HTMLElement>();
mitt.on('changeElement', update);
onUnmounted(() => {
    mitt.off('changeElement');
});

onMounted(() => {
    if (basicDividerRef.value) {
        if (basicDividerRef.value.children.length == 0) {
            data.basicDividerShowIs = false;
        } else {
            data.basicDividerShowIs = true;
        }
    }
});

function update() {
    nextTick(() => {
        if (basicDividerRef.value) {
            if (basicDividerRef.value.children.length == 0) {
                data.basicDividerShowIs = false;
            } else {
                data.basicDividerShowIs = true;
            }
        }
    });
    
}

</script>

<style scoped>

</style>
