<template>
    <my-collapse v-model="configStore.settingPanel.operation.visible"
                 :element="handlePanelElementList.operation"
                 :position="configStore.settingPanel.operation">
        <template #head>
            | {{ title }}
        </template>
        <template v-if="appStore.currentElement.length > 0">
            <MyElementSetting class="advanced-config" />
        </template>
        <MyPanelSetting v-else class="advanced-config" />
    </my-collapse>
</template>

<script setup lang="ts">
import { handlePanelElementList } from '@myprint/design/constants/settingPanel';
import MyCollapse from '@myprint/design/components/my/collapse/my-collapse.vue';
import MyElementSetting from './my-element-setting.vue';
import MyPanelSetting from './my-panel-setting.vue';
import { elementTypeFormat } from '@myprint/design/types/entity';
import { computed } from 'vue-demi';
import { useConfigStore } from '@myprint/design/stores/config';
import { useAppStoreHook } from '@myprint/design/stores/app';

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
