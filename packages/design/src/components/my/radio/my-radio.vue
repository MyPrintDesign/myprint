<template>
    <my-group>
        <my-button v-for="(item, index) in dataList"
                   @click="onClick(item)"
                   size="small"
                   :isActive="modelValue == item.value"
                   :key="index">{{ item.label }}
        </my-button>
    </my-group>
</template>

<script setup lang="ts">

import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';

const emit = defineEmits(['update:modelValue']);

withDefaults(defineProps<{
        disabled?: boolean,
        modelValue: string | number | null | undefined,
        dataList: any[],
    }>(),
    {
        disabled: false
    });

function onClick(item: any) {
    emit('update:modelValue', item.value);
}
</script>
