<template>
    <div class="module_item display-flex" @click="click">
        <div v-if="node.data.lockIs == 1" style="left: -48px;" class="module-item_lock">
            <el-icon :size="8">
                <Lock />
            </el-icon>
        </div>
        <div class="module_item-title display-flex">{{ node.label }}</div>
        
        <el-link :underline="false"
                 class="module_item-more"
                 @click.stop="addModule"
                 :icon="Plus" />
        
        <popover-menu-list :menu-list="data.menuList"
                           :item="node.data"
                           v-model:visible="data.moreVisible"
                           placement="right">
            <el-link :underline="false"
                     class="module_item-more"
                     @click.stop="data.moreVisible = true"
                     :icon="More" />
        </popover-menu-list>
        
        <rename-dialog v-model="data.renameVisible"
                       @confirm="confirmRename"
                       :name-value="data.renameModuleName" />
        
        <delete-dialog v-model="data.deleteVisible"
                       @confirm="confirmDelete"
                       :name="data.deleteModuleName" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Lock, More, Plus } from '@element-plus/icons-vue';
import PopoverMenuList from '@/components/popover/popover-menu-list.vue';
import { MenuItem } from '@/types/entity';
import { ModuleGroup } from '@/types/R';
import RenameDialog from '@/components/dialog/rename-dialog.vue';
import DeleteDialog from '@/components/dialog/delete-dialog.vue';

const $emit = defineEmits(['click', 'addModule', 'rename', 'delete']);
const props = withDefaults(defineProps<{
    node?: any
}>(), {
    node: () => ({})
});

const data = reactive({
    moreVisible: false,
    renameVisible: false,
    renameModuleName: null,
    deleteVisible: false,
    deleteModuleName: null,
    currentModule: null,
    menuList: [
        {
            name: '重命名', click: clickRenameDialog
        },
        {
            name: '删除', click: clickDeleteDialog
        }
    
    ] as MenuItem[]
});

function clickRenameDialog(module: ModuleGroup) {
    data.renameVisible = true;
    data.renameModuleName = module.name;
    data.currentModule = module;
}

function clickDeleteDialog(module: ModuleGroup) {
    data.deleteVisible = true;
    data.deleteModuleName = module.name;
    data.currentModule = module;
}

function confirmRename(name: string) {
    $emit('rename', data.currentModule, name);
    data.renameVisible = false;
}

function confirmDelete() {
    $emit('delete', data.currentModule);
    data.deleteVisible = false;
}

function click() {
    $emit('click', props.node.data);
}

function addModule() {
    $emit('addModule', props.node.data);
}
</script>
