<template>
    <base-widget :data="data" :pageUnit="pageUnit">
        <div class="options">
            <div :class="(data as any).iconClass" class="icon" />
            <div class="icon-tip">{{ elementTypeFormat[data.type] }}</div>
        </div>
    </base-widget>

</template>
<script setup lang="ts">
import {
    elementTypeFormat, MyElement,
// @ts-ignore
    PageUnit
} from '../../../types/entity';
import baseWidget from '../../../components/content/widget/base-widget.vue';

withDefaults(defineProps<{
    data?: MyElement
    pageUnit: PageUnit
}>(), {
    data: () => ({} as MyElement)
});

</script>
