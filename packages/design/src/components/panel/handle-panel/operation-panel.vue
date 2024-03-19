<template>
  <my-collapse v-model="configStore.settingPanel.operation.visible" :element="handlePanelElementList.operation">
    <template #head>
      | {{ title }}
    </template>
    <template v-if="appStore.currentElement.length > 0">
      <my-data-table-setting
          v-if="appStore.currentElement[0].type == 'DataTable'"
          class="advanced-config"/>
      <my-data-table-column-setting
          v-else-if="appStore.currentElement[0].runtimeOption.parent!.type == 'DataTable'"
          class="advanced-config"/>
      <MyElementSetting v-else class="advanced-config"/>
    </template>
    <MyPanelSetting v-else class="advanced-config"/>
  </my-collapse>
</template>


<script setup lang="ts">
import {handlePanelElementList} from "@myprint/design/constants/settingPanel";
import MyCollapse from "@myprint/design/components/my/collapse/my-collapse.vue";
import MyElementSetting from "../content/my-element-setting.vue";
import MyPanelSetting from "../content/my-panel-setting.vue";
import {elementTypeFormat} from "@myprint/design/types/entity";
import {computed} from "vue";
import {useConfigStore} from "@myprint/design/stores/config";
import {useAppStoreHook} from "@myprint/design/stores/app";
import MyDataTableSetting from "@myprint/design/components/panel/content/my-data-table-setting.vue";
import MyDataTableColumnSetting from "@myprint/design/components/panel/content/my-data-table-column-setting.vue";

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
