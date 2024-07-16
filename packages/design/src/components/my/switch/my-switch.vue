<template>
    <div class="my-switch"
         :class="{'is-checked': modelValueComputed}"
         @click="click">
        <div class="my-switch__core">
            <div class="my-switch__inner">
                <span class="is-text" aria-hidden="false">{{ statusText }}</span>
            </div>
            <div class="my-switch__action" />
        </div>
    </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';

const emit = defineEmits(['update:modelValue', 'click', 'change']);

const props = withDefaults(defineProps<{
        enable?: boolean,
        modelValue?: number,
        nullActive?: boolean,
        activeText?: string
        inactiveText?: string
    }>(),
    {
        enable: true,
        modelValue: undefined,
        nullActive: false,
        activeText: '开',
        inactiveText: '关'
    });

const modelValueComputed = computed(() => {
    return props.modelValue == 1 || (props.modelValue == null && props.nullActive);
});

const statusText = computed(() => {
    if (modelValueComputed.value) {
        return props.activeText;
    }
    return props.inactiveText;
});

function click() {
    if (!props.enable) {
        return;
    }
    emit('update:modelValue', modelValueComputed.value ? 0 : 1);
    emit('click');
    emit('change');
}
</script>
