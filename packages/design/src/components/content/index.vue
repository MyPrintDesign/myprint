<template>
    <el-container class="design-container-root cursor-resize" :data-rotation="appStore.dataRotation">
        <el-aside width="180" style="border-right: 1px #e9e9e9 solid; background: #f8f8f8">
            <widget :module="data.template.module" @back="back" />
        </el-aside>
        <el-main class="design-container-root_main">
            <PanelView />
        </el-main>
    </el-container>
    <my-mouse-tips />
</template>

<script setup lang="ts">
import widget from '@myprint/design/components/content/widget/index.vue';
import PanelView from '@myprint/design/components/content/panel/index.vue';
import { inject, provide, reactive, Ref, ref, watch } from 'vue';
import { Container, Panel, Provider } from '@myprint/design/types/entity';
import { to } from '@myprint/design/utils/utils';
import { mittKey, panelKey, previewDataKey, providerKey } from '@myprint/design/constants/keys';
import { init } from '@myprint/design/utils/historyUtil';
import { Template } from '@myprint/design/types/R';
import { useAppStoreHook } from '@myprint/design/stores/app';
import MyMouseTips from '@myprint/design/components/my/mouse-tips/my-mouse-tips.vue';
import { parentInitElement, setCurrentPanel } from '@myprint/design/utils/elementUtil';

const appStore = useAppStoreHook();

const $emit = defineEmits(['saveTemplate', 'back']);

const provider = ref({}) as Ref<Provider>;
const panel = reactive({
    runtimeOption: {
        dragInIs: false
    },
    dragSnapPanelIs: 1,
    dragSnapIs: 1
}) as Panel;
const mitt = inject(mittKey)!;
const previewData = ref<any>({} as any);
provide(panelKey, panel);
provide(providerKey, provider);
provide(previewDataKey, previewData);

mitt.on('saveTemplate', saveTemplate);

const props = withDefaults(defineProps<{
    template?: Template
}>(), {
    template: () => ({} as Template)
});
const data = reactive({
    template: {} as Template
});

watch(() => props.template.id, (n, _o) => {
    if (n != null) {
        data.template = props.template;
        to(JSON.parse(props.template.content), panel);
        previewData.value = JSON.parse(props.template.module.previewData!);
        setCurrentPanel(panel);
        panel.type = 'Panel';
        if (!panel.watermarkContent) {
            panel.watermarkContent = 'my-print';
        }
        if (!panel.groupList) {
            panel.groupList = [];
        }
        if (!panel.auxiliaryLineList) {
            panel.auxiliaryLineList = [];
        }
        panel.runtimeOption = {} as any;
        
        // console.log(JSON.parse(JSON.stringify(panel.elementList[0])))
        // for (let i = 0; i < 1000; i++) {
        //   const  tmp = JSON.parse(JSON.stringify(panel.elementList[0]))
        //   tmp.y = tmp.y + 0.2
        //   // panel.elementList?.unshift(tmp)
        //
        // }
        for (let i = 0; i < panel.elementList.length; i++) {
            const element = panel.elementList[i];
            parentInitElement(panel as Container, element, i);
        }
        panel.pageHeader && parentInitElement(panel, panel.pageHeader, 0);
        panel.pageFooter && parentInitElement(panel, panel.pageFooter, 0);
        
        init();
        
        provider.value = JSON.parse(data.template.module.provider!);
        if (provider.value.pageUnit == undefined) {
            provider.value.pageUnit = 'px';
        }
        
        mitt.emit('updatePanel');
        mitt.emit('changePageSize');
        
    }
}, { immediate: true });

function back() {
    $emit('back');
}

function saveTemplate() {
    // console.log(panel)
    // console.log(template)
    const template = {} as Template;
    template.name = panel.name;
    template.content = JSON.stringify(panel, (key, value) => {
        // console.log(key)
        // 清除runtime参数
        // console.log(this)
        if ('runtimeOption' == key) return undefined;
        if ('status' == key) return undefined;
        return value;
    });
    console.log(JSON.parse(template.content));
    $emit('saveTemplate', template);
}
</script>
