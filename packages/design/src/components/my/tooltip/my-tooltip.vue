<template>
    <my-popover>
        <template #reference>
            <slot />
        </template>
        <div class="my-tooltip_content">
            {{ content }}
        </div>
    </my-popover>
</template>

<script setup lang="ts">
import MyPopover from '@myprint/design/components/my/popover/my-popover.vue';

withDefaults(defineProps<{
    disabled?: boolean
    content?: string
}>(), {
    content: ''
});

</script>
