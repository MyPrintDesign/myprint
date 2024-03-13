<template>
  <cp-collapse v-model="configStore.settingPanel.operation.visible" :element="handlePanelElementList.operation">
    <template #head>
      | {{ title }}
    </template>
    <template v-if="appStore.currentElement.length > 0">
      <cp-data-table-setting
          v-if="appStore.currentElement[0].type == 'DataTable' || appStore.currentElement[0].runtimeOption.parent!.type == 'DataTable'"
          class="advanced-config"/>
      <CpElementSetting v-else class="advanced-config"/>
    </template>
    <CpPanelSetting v-else class="advanced-config"/>
  </cp-collapse>
</template>


<script setup lang="ts">

import {handlePanelElementList} from "@cp-print/design/constants/settingPanel";
import CpCollapse from "../../cp/cp-collapse/cp-collapse.vue";
import CpElementSetting from "../content/cp-element-setting.vue";
import CpPanelSetting from "../content/cp-panel-setting.vue";
import {elementTypeFormat} from "@cp-print/design/types/entity";
import {computed} from "vue";
import {useConfigStore} from "@cp-print/design/stores/config";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import CpDataTableSetting from "@cp-print/design/components/panel/content/cp-data-table-setting.vue";

const appStore = useAppStoreHook()
const configStore = useConfigStore()

const title = computed(() => {
  
  if (appStore.currentElement.length > 0) {
    const current = appStore.currentElement[0];
    let type = elementTypeFormat[current.type]
    if (current.label) {
      type = type + ':' + current.label
    }
    return type
  }
  return '面板'
})

</script>
