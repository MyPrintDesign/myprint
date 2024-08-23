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
                <history-line-text :content="item.snapshot.label" />
            </div>
            <history-line-text
                v-for="(item, index) in history"
                :class="[{'currentHistory': index == 0, 'history-list-item': index != 0}]"
                :key="item.timestamp"
                :content="item.snapshot.label" />
        </div>
    </my-collapse>
</template>

<script setup lang="ts">

import { redoStack, undoPanel, redoPanel, history, canRedo, canUndo } from '../../../utils/historyUtil';
import { handlePanelElementList } from '../../../constants/settingPanel';
import MyCollapse from '../../../components/my/collapse/my-collapse.vue';
import { useConfigStore } from '../../../stores/config';
import HistoryLineText from '../../../components/content/handle-panel/history-line-text.vue';

const configStore = useConfigStore();

</script>
