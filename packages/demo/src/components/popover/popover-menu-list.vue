<template>
    <el-popover
        :width="100"
        trigger="none"
        popper-class="module_item-popper"
        :visible="visible"
        @update:visible="updateVisible"
        :hide-after="0">
        <template #reference>
            <slot />
        </template>
        <div class="display-flex-column">
            <div v-for="(menu, index) in menuList"
                 :key="index"
                 :class="{'popover-menu_item_disabled': menu.disabled}"
                 class="popover-menu_item display-flex user-select-none cursor-pointer"
                 @click="clickItem(menu, item)">{{ menu.name }}
            </div>
        </div>
    </el-popover>
</template>

<script setup lang="ts">

import { MenuItem } from '@/types/entity';

const emit = defineEmits(['update:visible']);

withDefaults(defineProps<{
    menuList?: Array<MenuItem>,
    visible?: boolean,
    item: any,
}>(), {
    menuList: () => ([]),
    item: () => ({}),
    visible: false
});

function updateVisible(val: boolean) {
    emit('update:visible', val);
}

function clickItem(menu: MenuItem, item: MenuItem) {
    !menu.disabled && menu.click(item);
}
</script>
