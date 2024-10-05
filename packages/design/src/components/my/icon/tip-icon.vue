<template>
    <my-tooltip :content="tips"
                :disabled="tips == ''"
                trigger="hover"
                :placement="placement">
        <my-icon :disabled="disabled"
                 :class="props.class"
                 :size="size"
                 :padding="padding"
                 @click="emit('click')"
                 @update:model-value="(val)=>emit('update:modelValue', val)"
                 :modelValue="modelValue">
            <slot />
        </my-icon>
    </my-tooltip>
</template>

<script setup lang="ts">
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import MyTooltip from '@myprint/design/components/my/tooltip/my-tooltip.vue';

const emit = defineEmits(['update:modelValue', 'click']);

const props = withDefaults(defineProps<{
        tips?: string,
        disabled?: boolean,
        modelValue?: boolean,
        class?: string,
        size?: number,
        padding?: string,
        placement?: string,
    }>(),
    {
        tips: '',
        disabled: false,
        modelValue: false,
        class: '',
        size: null!,
        padding: null!,
        placement: 'bottom'
    });
</script>
