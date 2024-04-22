<template>
    <my-collapse v-model="configStore.settingPanel.history.visible"
                 :element="handlePanelElementList.history"
                 :position="configStore.settingPanel.history">
        <template #head>
            <div class="display-flex">
                <div @mousedown="($event)=>$event.stopPropagation()" @click="undoPanel"
                     :class="[{'my-icon-disabled': !canUndo}]"
                     class="my-icon iconfont icon-undo my-handle-panel-icon" />
                <div @mousedown="($event)=>$event.stopPropagation()" @click="redoPanel"
                     :class="[{'my-icon-disabled': !canRedo}]"
                     class="my-icon iconfont icon-redo my-handle-panel-icon" />
            </div>
        </template>
        <div class="history-list">
            <div v-for="(item) in redoStack.slice().reverse()" :key="item.timestamp"
                 class="history-list-item">
                <history-line-text :content="item.snapshot.action" />
            </div>
            <div
                v-for="(item, index) in history"
                :class="[{'currentHistory': index == 0, 'history-list-item': index != 0}]"
                :key="item.timestamp"
                :content="item.snapshot.action" />
        </div>
    </my-collapse>
</template>

<script setup lang="ts">

import { redoStack, undoPanel, redoPanel,
    // @ts-ignore
    history,
    canRedo, canUndo } from '@myprint/design/utils/historyUtil';
import { handlePanelElementList } from '@myprint/design/constants/settingPanel';
import MyCollapse from '@myprint/design/components/my/collapse/my-collapse.vue';
import { useConfigStore } from '@myprint/design/stores/config';
import HistoryLineText from '@myprint/design/components/content/handle-panel/history-line-text.vue';

// console.log(history);
const configStore = useConfigStore();

</script>
