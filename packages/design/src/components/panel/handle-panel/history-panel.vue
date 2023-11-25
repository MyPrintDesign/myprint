<template>
  <cp-collapse v-model="configStore.settingPanel.history.visible" :element="handlePanelElementList.history">
    <template #head>
      <div class="display-flex">
        <div @mousedown="($event)=>$event.stopPropagation()" @click="undoPanel"
             :class="[{'cp-icon-disabled': !canUndo}]"
             class="cp-icon iconfont icon-undo cp-handle-panel-icon"/>
        <div @mousedown="($event)=>$event.stopPropagation()" @click="redoPanel"
             :class="[{'cp-icon-disabled': !canRedo}]"
             class="cp-icon iconfont icon-redo cp-handle-panel-icon"/>
      </div>
    </template>
    <div class="history-list">
      <div v-for="(item, index) in redoStack.slice().reverse()" :key="index"
           class="history-list-item">
        {{ item.snapshot.action }}
      </div>
      <div v-for="(item, index) in history" :class="[{'currentHistory': index == 0, 'history-list-item': index != 0}]"
           :key="index">
        {{ item.snapshot.action }}
      </div>
    </div>
  </cp-collapse>
</template>

<script setup lang="ts">
import {redoStack, undoPanel, redoPanel, history, canRedo, canUndo} from "@cp-print/design/utils/historyUtil";
import {handlePanelElementList} from "@cp-print/design/constants/settingPanel";
import CpCollapse from "../../cp/cp-collapse/cp-collapse.vue";
import {useConfigStore} from "@cp-print/design/stores/config";

const configStore = useConfigStore()

</script>

<style scoped lang="scss">


.history-list {
  font-size: 13px;
  
  .currentHistory {
    color: white;
    padding-left: 3px;
    background: var(--drag-h-color);
  }
  
  .history-list-item {
    color: rgb(128, 128, 128);
    padding-left: 3px;
  }
}
</style>
