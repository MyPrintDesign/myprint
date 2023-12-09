<template>
  <cp-collapse v-model="configStore.settingPanel.operation.visible" :element="handlePanelElementList.operation">
    <template #head>
      | {{ title }}
    </template>
    <CpElementSetting v-if="appStore.currentElement.id" class="advanced-config"/>
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
const appStore = useAppStoreHook()
const configStore = useConfigStore()

const title = computed(() => {
  const current = appStore.currentElement;
  if (current.id == null) {
    return '面板'
  }
  
  let type = elementTypeFormat[current.type]
  if (current.label) {
    type = type + ':' + current.label
  }
  return type
})

</script>
