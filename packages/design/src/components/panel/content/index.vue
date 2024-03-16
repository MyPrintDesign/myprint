<template>
  <div class="design-panel-container" v-show="useAppStoreHook().displayModel == 'design'">
    <Toolbar/>
    <div class="display-flex design-panel-container-height">
      <cp-panel/>
      <div style="background: white;" class="display-flex-column width-20">
        <div v-for="(value, key) in handlePanelElementList"
             @click="clickHandlePanelIcon(key)"
             :class="['cp-icon handle-panel-icon iconfont',{'handle-panel-icon-active': configStore.settingPanel[key].visible}, value.icon]"
             :key="key"/>
        <history-panel/>
        <operation-panel/>
        <setting-panel/>
      </div>
      <minimap-panel/>
    </div>
  </div>
  <preview-panel/>
</template>

<script setup lang="ts">
import Toolbar from '../toolbar/toolbar.vue'
import PreviewPanel from "../../preview/previewPanel.vue";
import CpPanel from "./cp-panel.vue";
import {handlePanelElementList} from "@cp-print/design/constants/settingPanel";
import HistoryPanel from "../handle-panel/history-panel.vue";
import OperationPanel from "../handle-panel/operation-panel.vue";
import SettingPanel from "../handle-panel/setting/setting-panel.vue";
import {useConfigStore} from "@cp-print/design/stores/config";
import MinimapPanel from "@cp-print/design/components/panel/handle-panel/minimap-panel.vue";
import {useAppStoreHook} from "@cp-print/design/stores/app";

const configStore = useConfigStore()

function clickHandlePanelIcon(key: any) {
  configStore.settingPanel[key].visible = !configStore.settingPanel[key].visible
}

</script>
