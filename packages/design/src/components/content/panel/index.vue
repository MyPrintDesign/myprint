<template>
    <div class="design-panel-container">
        <Toolbar :designProps="designProps"/>
        <div class="display-flex design-panel-container-height">
            <my-panel />
            <div style="background: white;" class="display-flex-column width-20">
                <div v-for="(value, key) in handlePanelElementList"
                     @click="clickHandlePanelIcon(key)"
                     :class="['my-icon handle-panel-icon iconfont',{'handle-panel-icon-active': configStore.settingPanel[key].visible}, value.icon]"
                     :key="key" />
                <history-panel />
                <operation-panel />
                <setting-panel />
            </div>
            <minimap-panel />
        </div>
    </div>
</template>

<script setup lang="ts">
import Toolbar from '../../../components/content/toolbar/toolbar.vue';
import MyPanel from './my-panel.vue';
import { handlePanelElementList } from '../../../constants/settingPanel';
import HistoryPanel from '../handle-panel/history-panel.vue';
import OperationPanel from '../handle-panel/operation-panel/index.vue';
import SettingPanel from '../handle-panel/setting/setting-panel.vue';
import { useConfigStore } from '../../../stores/config';
import MinimapPanel from '../../../components/content/handle-panel/minimap-panel.vue';
//@ts-ignore
import { DesignPanelProps } from '../../../types/entity';

withDefaults(defineProps<{
    designProps: DesignPanelProps;
}>(), {

});
const configStore = useConfigStore();

function clickHandlePanelIcon(key: any) {
    configStore.settingPanel[key].visible = !configStore.settingPanel[key].visible;
}

</script>
