<template>
    <base-widget :data="data" :pageUnit="pageUnit">
        <div class="options-business user-select-none">
            <span>{{ data.label }}</span>
        </div>
    </base-widget>
</template>
<script setup lang="ts">
import baseWidget from '@myprint/design/components/content/widget/base-widget.vue';
import {
    MyElement,
// @ts-ignore
    PageUnit
} from '@myprint/design/types/entity';

withDefaults(defineProps<{
    data?: MyElement,
    pageUnit: PageUnit
}>(), {
    data: () => ({} as MyElement)
});

</script>
