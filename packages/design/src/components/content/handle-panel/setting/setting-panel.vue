<template>
    <my-dialog v-model="configStore.settingPanel.setting.visible"
               :show-close="false"
               class="setting-dialog"
               :modal="false"
               width="800"
               :show-header="false">
        <div class="setting-body display-flex">
            <div class="setting-menu">
                <div class="setting-menu-title">设置</div>
                <div v-for="(item, index) in settingItemList"
                     :class="[{ 'setting-item-item-active':item.active}]"
                     class="display-flex setting-item-item"
                     @click="clickItem(item)"
                     :key="index">
                    <div class="setting-item-item-title">{{ item.title }}</div>
                </div>
            </div>
            <div class="setting-panel">
                <div class="setting-panel-header display-flex">
                    <div class="setting-panel-header-title">{{ currentSettingItem.title }}</div>
                    <my-icon color="#666666" size="20" @click="clickClose" class="cursor-pointer">
                        <CloseBold />
                    </my-icon>
                </div>
                
                <setting-design v-if="currentSettingItem.type == 'DESIGN'" />
                <setting-printer v-if="currentSettingItem.type == 'PRINTER'" />
                <setting-about v-if="currentSettingItem.type == 'ABOUT'" />
            
            </div>
        </div>
    </my-dialog>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue';
import SettingPrinter from './setting-printer.vue';
import SettingAbout from './setting-about.vue';
import { useConfigStore } from '../../../../stores/config';
import SettingDesign from './setting-design.vue';
import MyDialog from '../../../../components/my/dialog/my-dialog.vue';
import MyIcon from '../../../../components/my/icon/my-icon.vue';
import CloseBold from '../../../../components/my/icon/icons/CloseBold.vue';

const configStore = useConfigStore();

const settingItemList = reactive([{
    title: '设计面板',
    type: 'DESIGN',
    active: true
}, {
    title: '打印机设置',
    type: 'PRINTER',
    active: false
}, {
    title: '关于',
    type: 'ABOUT',
    active: false
}]);
const currentSettingItem = ref(settingItemList[0]);

function clickItem(item: any) {
    currentSettingItem.value.active = false;
    currentSettingItem.value = item;
    currentSettingItem.value.active = true;
}

function clickClose() {
    configStore.settingPanel.setting.visible = false;
}
</script>
