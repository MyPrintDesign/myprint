<template>
    <div class="my-select-wrapper display-flex cursor-pointer user-select-none"
         :class="{'my-icon-disabled': disabled}">
        <tool-icon-popover
            :disabled="disabled">
            <template #reference>
                <div class="my-select-input">
                    {{ modelValue }}
                </div>
            </template>
            <template #panel>
                <my-scrollbar height="270px">
                    <element-align :model-value="modelValue"
                                   showSelectedStatus
                                   :elementAlignList="dataList"
                                   @update:model-value="(val:any)=>emit('update:modelValue', val)" />
                </my-scrollbar>
            
            </template>
        
        </tool-icon-popover>
    </div>
</template>

<script setup lang="ts">
import ElementAlign from '@myprint/design/components/content/toolbar/toolbar-style/element-align.vue';
import ToolIconPopover from '@myprint/design/components/my/icon/tool-icon-popover.vue';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';

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
