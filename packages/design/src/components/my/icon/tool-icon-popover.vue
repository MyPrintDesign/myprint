<template>
    <my-tooltip
        trigger="click"
        :disabled="disabled"
        placement="bottom">
        <template #reference>
            <div class="display-flex icon-popover" :class="[{'my-icon-disabled': disabled}, 'my-color-icon']">
                <div class="display-flex">
                    <div class="display-flex-column">
                        <slot name="reference" />
                    </div>
                    <my-icon v-if="showArrow" class="my-style-font_arrow icon-jt-x iconfont my-icon-downList-arrow"
                             :disabled="disabled">
                    </my-icon>
                </div>
            
            </div>
        </template>
        <slot name="panel" />
    </my-tooltip>
</template>

<script setup lang="ts">
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import MyTooltip from '@myprint/design/components/my/tooltip/my-tooltip.vue';

withDefaults(defineProps<{
    disabled?: boolean
    showArrow?: boolean
}>(), {
    disabled: false,
    showArrow: true
});

</script>
