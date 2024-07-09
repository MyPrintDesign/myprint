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
//@ts-ignore
import { Placement } from '@popperjs/core/lib/enums';
import MyPopover from '@myprint/design/components/my/popover/my-popover.vue';

withDefaults(defineProps<{
    disabled?: boolean
    placement?: Placement
    content?: string
}>(), {
    placement: 'top' as Placement,
    content: ''
});

</script>
