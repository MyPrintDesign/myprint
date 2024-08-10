<template>
    <section class="design-container-root cursor-resize" v-bind="$attrs"
             :style="style"
             :data-rotation="appStore.dataRotation">
        <aside class="my-aside display-flex-column" style="border-right: 1px #e9e9e9 solid; background: #f8f8f8">
            <widget :module="props.module" :showBackButton="showBackButton" @back="back" />
        </aside>
        <main class=" my-main design-container-root_main">
            <PanelView />
        </main>
    </section>
    <my-mouse-tips />
</template>

<script setup lang="ts">
import widget from '@myprint/design/components/content/widget/index.vue';
import PanelView from '@myprint/design/components/content/panel/index.vue';
import { computed, CSSProperties, inject, onMounted, provide, reactive, Ref, ref, watch } from 'vue-demi';
import { Panel, Provider, RuntimeElementOption } from '@myprint/design/types/entity';
import { to } from '@myprint/design/utils/utils';
import { designPropsKey, mittKey, panelKey, previewDataKey, providerKey } from '@myprint/design/constants/keys';
import { init } from '@myprint/design/utils/historyUtil';
// @ts-ignore
import { Module, SaveResult, Template } from '@myprint/design/types/R';
import { useAppStoreHook } from '@myprint/design/stores/app';
import MyMouseTips from '@myprint/design/components/my/mouse-tips/my-mouse-tips.vue';
import { defaultPreviewData, initPanel, parentInitElement, setCurrentPanel } from '@myprint/design/utils/elementUtil';
import { newSelecto } from '@myprint/design/plugins/moveable/selecto';
import { MyMessage } from '@myprint/design/components/my/message/my-message';
import { MyPrinter } from '@myprint/design/printer';
import { i18n } from '@myprint/design/locales';

const appStore = useAppStoreHook();

const $emit = defineEmits<{
    (e: 'back'): void;
    (e: 'panelImg', blobList: Blob[]): void;
}>();

const data = reactive({
    buildImgIs: false
});

const provider = ref({}) as Ref<Provider>;
const panel = reactive({
    runtimeOption: {
        dragInIs: false
    },
    type: 'Panel',
    dragSnapPanelIs: 1,
    dragSnapIs: 1
}) as Panel;
const mitt = inject(mittKey)!;
const previewData = ref<any[]>([]);
provide(panelKey, panel);
provide(providerKey, provider);
provide(previewDataKey, previewData);

mitt.on('saveTemplate', saveTemplate);

const props = withDefaults(defineProps<{
    module?: Module;
    template?: Template;
    height?: string;
    saveTemplate?: (template: Template) => Promise<SaveResult>;
    generateImg?: boolean;
    showBackButton?: boolean;
    showPrintButton?: boolean;
    showDownloadPdfButton?: boolean;
    showPreviewButton?: boolean;
    showClearButton?: boolean;
    showSaveButton?: boolean;
}>(), {
    showBackButton: true,
    showPrintButton: true,
    showDownloadPdfButton: true,
    showPreviewButton: true,
    showClearButton: true,
    showSaveButton: true
});
provide(designPropsKey, props);

const style = computed(() => {
    return <CSSProperties>{
        height: props.height
    };
});

onMounted(() => {
    initModule();
    initTemplate();
    newSelecto();
});

const moduleWatchStop = watch(() => props.module, (_n, _o) => {
    if (props.module) {
        initModule();
        moduleWatchStop();
    }
});

function initModule() {
    if (!props.module) {
        return;
    }
    provider.value = JSON.parse(props.module.provider!);
    previewData.value = JSON.parse(props.module.previewData!);
    initPanel(panel, provider);
    setCurrentPanel(panel);
}

const templateWatchStop = watch(() => props.template, (_n, _o) => {
    if (props.template) {
        initTemplate();
        templateWatchStop();
    }
});

function initTemplate() {
    if (!props.template) {
        return;
    }
    to(JSON.parse(props.template.content), panel);
    setCurrentPanel(panel);
    
    // initPanel();
    
    if (!panel.watermarkContent) {
        // panel.watermarkContent = 'my-print';
    }
    if (!panel.groupList) {
        panel.groupList = [];
    }
    if (!panel.auxiliaryLineList) {
        panel.auxiliaryLineList = [];
    }
    for (let myAuxiliaryLine of panel.auxiliaryLineList) {
        myAuxiliaryLine.runtimeOption = { x: 0, y: 0, auxiliaryLineStatus: 'SHOW' } as RuntimeElementOption;
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
        parentInitElement(panel, panel, element, i);
    }
    panel.pageHeader && parentInitElement(panel, panel, panel.pageHeader, 0);
    panel.pageFooter && parentInitElement(panel, panel, panel.pageFooter, 0);
    
    init();
    
    if (provider.value.pageUnit == undefined) {
        provider.value.pageUnit = 'px';
    }
    
    mitt.emit('updatePanel');
    mitt.emit('changePageSize');
}

function back() {
    $emit('back');
}

function saveTemplate() {
    if (props.generateImg) {
        if (!data.buildImgIs) {
            data.buildImgIs = true;
            MyPrinter.imgChrome({ previewDataList: [defaultPreviewData(previewData.value)[0]] })
                .then(res => {
                    $emit('panelImg', res.blobList!);
                    data.buildImgIs = false;
                }).catch(_e => {
                data.buildImgIs = false;
            });
        }
    }
    
    const template = {} as Template;
    template.name = panel.name;
    template.content = JSON.stringify(panel, (key, value) => {
        if ('runtimeOption' == key) return undefined;
        return value;
    });
    if (props.saveTemplate != null) {
        props.saveTemplate(template)
            .then(_res => {
                // 保存成功
                MyMessage.success(i18n('common.save.success'));
            }).catch(_e => {
            MyMessage.success(i18n('common.save.fail'));
            // 保存失败
        });
    }
}
</script>
