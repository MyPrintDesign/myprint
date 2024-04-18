<template>
    <div class="my-switch"
         :class="{'is-checked': modelValue == 1}"
         @click="click"
         
         style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color);">
        <span class="my-switch__core">
            <div class="my-switch__inner">
            <span class="is-text" aria-hidden="false">{{ statusText }}</span>
            </div>
            <div class="my-switch__action"></div>
        </span>
    </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';

const emit = defineEmits(['update:modelValue', 'click', 'change']);

const props = withDefaults(defineProps<{
        enable?: boolean,
        modelValue?: number,
        activeText?: string
        inactiveText?: string
    }>(),
    {
        enable: true,
        modelValue: 0,
        activeText: '开',
        inactiveText: '关'
    });

const statusText = computed(() => {
    if (props.modelValue == 1) {
        return props.activeText;
    } else if (props.modelValue == 0) {
        return props.inactiveText;
    }
});

function click() {
    if (!props.enable) {
        return;
    }
    emit('update:modelValue', props.modelValue == 1 ? 0 : 1);
    emit('click');
    emit('change');
}
</script>

<style scoped lang="scss">


//.el-switch.is-checked .el-switch__core {
//    border-color: var(--el-switch-border-color,var(--el-switch-on-color));
//    background-color: var(--el-switch-on-color);
//}

</style>
