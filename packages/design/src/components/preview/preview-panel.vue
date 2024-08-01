<template>
    <my-dialog
        v-model="data.dialogVisible"
        class="preview-dialog"
        fullscreen
        :showHeader="false"
        @close="closePreviewPanel">
        <div class="preview-panel">
            <my-scrollbar height="100%" class="preview-panel__scrollbar"
                          :style="{minWidth: valueUnit(panel.width, panel)}">
                <div class="my-print-preview-panel__wrap">
                    <div class="preview-panel__model">
                        <div class="my-print-preview-panel__content">
                            <div v-for="(page, index) in data.pageList"
                                 ref="previewContentRef"
                                 :key="index"
                                 class="my-print-preview-panel__content_page preview-page-top"
                                 :style="{
                    width: valueUnit(page.width, panel),
                    minHeight: valueUnit(page.height, panel),
                    }">
                                <preview
                                    v-for="(element, index) in page.elementList"
                                    :ref="(el) => setItemRef(el, element)"
                                    :key="index"
                                    :preview="element" />
                            </div>
                        </div>
                    </div>
                </div>
            </my-scrollbar>
            <div class="preview-panel__tool display-flex-column display-flex-wrap">
                <div>名称：{{ panel.name }}</div>
                <div>打印份数：测试</div>
                <div>客户端未连接，无法使用直接打印功能，去下载</div>
                <template v-if="MyPrinter.clientConnectIs()">
                    <div>{{ i18n('toolbar.printer') }}：
                        <my-select v-model="data.printer" placeholder="请选择" size="middle"
                                   :data-list="printList" />
                    </div>
                    <my-button style="margin-top: 40px" :disabled="!data.printer" @click="print">{{
                            i18n('toolbar.print')
                        }}
                    </my-button>
                </template>
                
                <my-button class="preview-panel__tool_button" @click="printChromePdf">{{ i18n('toolbar.chrome.print') }}</my-button>
                <my-button class="preview-panel__tool_button" @click="downloadPdf">{{ i18n('preview.download.pdf') }}</my-button>
                <my-button class="preview-panel__tool_button" @click="()=>data.dialogVisible = false">{{ i18n('common.close') }}
                </my-button>
            </div>
        </div>
    
    </my-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue-demi';
import { toPdf } from '@myprint/design/utils/pdfUtil';
import { download } from '@myprint/design/utils/utils';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import Preview from './preview.vue';
import { MyElement, Panel, PrintProps, PrintResult } from '@myprint/design/types/entity';
import { i18n } from '@myprint/design/locales';
import { displayModel, valueUnit } from '@myprint/design/utils/elementUtil';
import { useConfigStore } from '@myprint/design/stores/config';
import { autoPage } from './autoPage';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';
import MyDialog from '@myprint/design/components/my/dialog/my-dialog.vue';
import MySelect from '@myprint/design/components/my/select/my-select.vue';
import { getPrintElementHtml, iFramePrint } from '@myprint/design/utils/myprint';
import {
    handleClientResult,
    handleTimeOut,
    myPrintClientService,
    printResult
} from '@myprint/design/plugins/myprintClientService';
import { MyPrinter } from '@myprint/design/printer';

defineExpose({ handleChromePreview });

const configStore = useConfigStore();
const data = reactive({
    dialogVisible: false,
    printer: configStore.defaultPrinter,
    pageList: [] as any,
    resolveMap: {},
    previewTimeOutMap: {},
    taskId: null as any
});
const previewContentRef = ref<HTMLDivElement[]>()!;
const panel = ref({} as Panel);
let itemRefs = {} as any;

const printList = computed(() => {
    return MyPrinter.getPrinterList().map(res => {
        return {
            label: res.name,
            value: res.name
        };
    });
});

function print() {
    myPrintClientService.print({
        content: { html: getPrintElementHtml(previewContentRef.value!, data.pageList), printer: data.printer },
        cmd: 'print',
        taskId: data.taskId
    }, panel.value)
        .then(res => {
            console.log(res);
            handleClientResult(res, printResult, data.previewTimeOutMap, data.resolveMap);
        })
        .catch(e => {
            // console.log(e);
            printResult(data.taskId, {
                status: 'ERROR',
                msg: e.msg,
                type: 'CLIENT_PRINT'
            }, data.previewTimeOutMap, data.resolveMap);
        });
}

function downloadPdf() {
    if (MyPrinter.clientConnectIs()) {
        myPrintClientService.print({
            content: { html: getPrintElementHtml(previewContentRef.value!, data.pageList) },
            cmd: 'generatePdf',
            taskId: data.taskId
        }, panel.value).then(res => {
            const blob = handleClientResult(res, printResult, data.previewTimeOutMap, data.resolveMap);
            if (blob) {
                download(blob, panel.value.name + '.pdf');
            }
        }).catch(e => {
            printResult(data.taskId, {
                status: 'ERROR',
                msg: e.msg,
                type: 'CLIENT_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        });
    } else {
        toPdf(previewContentRef.value, {
            width: unit2px(panel.value.width, panel.value), height: unit2px(panel.value.height, panel.value)
        }).then(blob => {
            download(blob, panel.value.name + '.pdf');
            printResult(data.taskId, {
                status: 'SUCCESS',
                msg: '',
                type: 'CHROME_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            printResult(data.taskId, {
                status: 'ERROR',
                msg: e.msg,
                type: 'CHROME_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        });
    }
}

function printChromePdf() {
    iFramePrint(panel.value, getPrintElementHtml(previewContentRef.value!, data.pageList));
    printResult(data.taskId, {
        status: 'SUCCESS',
        type: 'CHROME_PRINT'
    }, data.previewTimeOutMap, data.resolveMap);
}

function setItemRef(el: any, item: MyElement) {
    itemRefs[item.id] = el;
}

function handleChromePreview(printProps: PrintProps) {
    data.dialogVisible = true;
    panel.value = printProps.panel as Panel;
    data.taskId = printProps.taskId;
    
    handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
    
    return new Promise<PrintResult>((resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        nextTick(() => {
            autoPage(data.pageList, panel.value, printProps.previewDataList);
        });
    });
}

function closePreviewPanel() {
    displayModel('design');
    data.pageList = [];
    
    printResult(data.taskId, {
        status: 'CLOSE',
        type: 'CLOSE'
    }, data.previewTimeOutMap, data.resolveMap);
}
</script>
