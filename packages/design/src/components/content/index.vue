<template>
    <section class="design-container-root cursor-resize" v-bind="$attrs"
             :style="style"
             :data-rotation="appStore.dataRotation">
        <aside class="my-aside" style="border-right: 1px #e9e9e9 solid; background: #f8f8f8">
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
import { computed, CSSProperties, inject, onMounted, PropType, provide, reactive, Ref, ref, watch } from 'vue';
import { Container, Panel, Provider, RuntimeElementOption } from '@myprint/design/types/entity';
import { to } from '@myprint/design/utils/utils';
import { mittKey, panelKey, previewDataKey, providerKey } from '@myprint/design/constants/keys';
import { init } from '@myprint/design/utils/historyUtil';
import { Module, SaveResult, Template } from '@myprint/design/types/R';
import { useAppStoreHook } from '@myprint/design/stores/app';
import MyMouseTips from '@myprint/design/components/my/mouse-tips/my-mouse-tips.vue';
import { displayModel, initPanel, parentInitElement, setCurrentPanel } from '@myprint/design/utils/elementUtil';
import { newSelecto } from '@myprint/design/plugins/moveable/selecto';

const appStore = useAppStoreHook();

const $emit = defineEmits(['saveTemplate', 'back', 'panelImg']);

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
const props = defineProps(
    {
        template: {
            type: Object as PropType<Template>
        },
        saveTemplate: {
            type: Object as PropType<(template: Template) => SaveResult>
        },
        module: {
            type: Object as PropType<Module>
        },
        height: {
            type: String
        },
        generateImg: {
            type: Boolean,
            default: false
        },
        showBackButton: {
            // 是否展示返回按钮
            type: Boolean,
            default: true
        }
    }
) as {
    template: Template,
    module: Module,
    saveTemplate: (template: Template) => SaveResult
    height: string,
    generateImg: boolean,
    showBackButton: boolean
};

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
        panel.watermarkContent = 'my-print';
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
        parentInitElement(panel as Container, element, i);
    }
    panel.pageHeader && parentInitElement(panel, panel.pageHeader, 0);
    panel.pageFooter && parentInitElement(panel, panel.pageFooter, 0);
    
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
    displayModel('print');
    if (props.generateImg) {
    
    }
    // MyPrinter.print2Img({ previewDataList: [previewData.value[0]] })
    //     .then(res => {
    //         $emit('panelImg', res);
    //     });
    
    const template = {} as Template;
    console.log(panel.name);
    template.name = panel.name;
    template.content = JSON.stringify(panel, (key, value) => {
        if ('runtimeOption' == key) return undefined;
        return value;
    });
    $emit('saveTemplate', template);
}
</script>
