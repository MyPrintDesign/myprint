<template>
    <my-popover
        trigger="click"
        :disabled="disabled"
        placement="bottom">
        <template #reference>
            <div class="display-flex my-select icon-popover" :class="[{'my-icon-disabled': disabled}, 'my-color-icon']">
                <div class="my-select-input">
                    {{ modelValue }}
                </div>
                <my-icon class="my-style-font_arrow icon-jt-x iconfont my-icon-downList-arrow"
                         :size="8"
                         :disabled="disabled">
                </my-icon>
            </div>
        </template>
        <my-scrollbar height="270px">
            <element-align :model-value="modelValue"
                           showSelectedStatus
                           :elementAlignList="dataList"
                           @update:model-value="(val:any)=>emit('update:modelValue', val)" />
        </my-scrollbar>
    </my-popover>

</template>

<script setup lang="ts">
import ElementAlign from '@myprint/design/components/content/toolbar/toolbar-style/element-align.vue';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';
import MyPopover from '@myprint/design/components/my/popover/my-popover.vue';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';

const emit = defineEmits(['update:modelValue']);

withDefaults(defineProps<{
        disabled?: boolean,
        showSelectedStatus?: boolean,
        modelValue: string | number | null | undefined,
        dataList: any[],
    }>(),
    {
        disabled: false,
        showSelectedStatus: false
    });
</script>
