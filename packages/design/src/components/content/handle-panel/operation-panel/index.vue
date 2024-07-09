<template>
    <my-collapse v-model="configStore.settingPanel.operation.visible"
                 :element="handlePanelElementList.operation"
                 :position="configStore.settingPanel.operation">
        <template #head>
            | {{ title }}
        </template>
        <template v-if="appStore.currentElement.length > 0">
            <my-data-table-setting
                v-if="appStore.currentElement[0].type == 'DataTable'"
                class="advanced-config" />
            <my-data-table-column-setting
                v-else-if="appStore.currentElement[0].runtimeOption.parent!.type == 'DataTable'"
                class="advanced-config" />
            <MyElementSetting v-else class="advanced-config" />
        </template>
        <MyPanelSetting v-else class="advanced-config" />
    </my-collapse>
</template>

<script setup lang="ts">
import { handlePanelElementList } from '../../../../constants/settingPanel';
import MyCollapse from '../../../../components/my/collapse/my-collapse.vue';
import MyElementSetting from './my-element-setting.vue';
import MyPanelSetting from './my-panel-setting.vue';
import { elementTypeFormat } from '../../../../types/entity';
import { computed } from 'vue';
import { useConfigStore } from '../../../../stores/config';
import { useAppStoreHook } from '../../../../stores/app';
import MyDataTableSetting
    from '../../../../components/content/handle-panel/operation-panel/my-data-table-setting.vue';
import MyDataTableColumnSetting
    from '../../../../components/content/handle-panel/operation-panel/my-data-table-column-setting.vue';

const appStore = useAppStoreHook();
const configStore = useConfigStore();

const title = computed(() => {
    
    if (appStore.currentElement.length > 0) {
        const current = appStore.currentElement[0];
        let type = elementTypeFormat[current.type];
        if (current.label) {
            type = type + ':' + current.label;
        }
        return type;
    }
    return '面板';
});

</script>
