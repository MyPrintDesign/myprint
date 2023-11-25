<template>
  <el-dialog v-model="configStore.settingPanel.setting.visible" :show-close="false"
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
          <el-icon color="#666666" size="20" @click="clickClose" class="cursor-pointer">
            <CloseBold/>
          </el-icon>
        </div>
        
        <setting-design v-if="currentSettingItem.type == 'DESIGN'"/>
        <setting-printer v-if="currentSettingItem.type == 'PRINTER'"/>
        <setting-about v-if="currentSettingItem.type == 'ABOUT'"/>
      
      </div>
    </div>
  </el-dialog>
</template>


<script setup lang="ts">
import { ElDialog } from 'element-plus'
import {CloseBold} from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import SettingPrinter from "./setting-printer.vue";
import SettingAbout from "./setting-about.vue";
import {useConfigStore} from "@cp-print/design/stores/config";
import SettingDesign from "./setting-design.vue";

const configStore = useConfigStore()

const settingItemList = reactive([{
  title: "设计面板",
  type: "DESIGN",
  active: true
}, {
  title: "打印机设置",
  type: "PRINTER",
  active: false
}, {
  title: "关于",
  type: "ABOUT",
  active: false
}])
const currentSettingItem = ref(settingItemList[0])

function clickItem(item) {
  currentSettingItem.value.active = false
  currentSettingItem.value = item
  currentSettingItem.value.active = true
}

function clickClose() {
  configStore.settingPanel.setting.visible = false
}
</script>


<style scoped lang="scss">
.setting-body {
  width: 800px;
  height: 500px;
  
  .setting-menu {
    width: 170px;
    background: #f8f8f8;
    
    .setting-menu-title {
      height: 60px;
      padding-left: 30px;
      line-height: 60px;
      font-weight: 600;
      font-size: 16px;
      color: #2b2b2b;
    }
    
    .setting-item-item {
      padding-left: 30px;
      align-items: center;
      height: 36px;
      
      .setting-item-item-title {
        font-weight: 400;
        font-size: 12px;
        padding-left: 13px;
      }
    }
    
    .setting-item-item-active {
      padding-left: 26px;
      box-sizing: border-box;
      background-color: #f2f2f2;
      border-left: 4px solid var(--drag-h-color);
      color: var(--drag-h-color);
    }
  }
  
  .setting-panel {
    flex: 1;
    
    .setting-panel-header {
      height: 60px;
      padding: 0 37px;
      background: white;
      box-sizing: border-box;
      border-bottom: 1px solid #e9e9e9;
      align-items: center;
      justify-content: space-between;
      
      .setting-panel-header-title {
        font: inherit;
        font-weight: 600;
        font-size: 14px;
        color: #2b2b2b;
      }
      
      .setting-panel-header-close {
        width: 24px;
      }
    }
  }
}
</style>
