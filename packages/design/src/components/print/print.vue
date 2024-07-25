<template>
    <div class="my-print-preview-panel__wrap"
         :class="{'my-print-print_hidden': displayModelPrint()}">
        <div class="preview-panel__model">
            <div class="my-print-preview-panel__content">
                <div v-for="(page, index) in data.pageList"
                     ref="previewContentRef"
                     :key="index"
                     class="my-print-preview-panel__content_page preview-page-top"
                     :style="{
                    width: valueUnit(page.width, data.panel),
                    minHeight: valueUnit(page.height, data.panel),
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
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue-demi';
import { MyElement, Panel, PrintProps, PrintResult } from '@myprint/design/types/entity';
import { displayModelPrint, getCurrentPanelUnit, valueUnit } from '@myprint/design/utils/elementUtil';
import { useConfigStore } from '@myprint/design/stores/config';
import Preview from '@myprint/design/components/preview/preview.vue';
import { autoPage } from '@myprint/design/components/preview/autoPage';
import { chrome2Img } from '@myprint/design/utils/pdfUtil';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { downloadImg, downloadPdf } from '@myprint/design/api/pdfServer';
import { getPrintElementHtml, iFramePrint } from '@myprint/design/utils/myprint';
import {
    handleClientResult,
    handleTimeOut,
    myPrintClientService,
    printResult
} from '@myprint/design/plugins/myprintClientService';
import { isEmpty } from 'lodash';

defineExpose({
    handleChromePrint,
    handleClientPrint,
    handleChromeDownloadImg,
    handleServerDownloadImg,
    handleServerDownloadPdf
});
const configStore = useConfigStore();
const data = reactive({
    dialogVisible: false,
    pageList: [] as any,
    resolveMap: {},
    previewTimeOutMap: {},
    panel: null! as Panel
});
const previewContentRef = ref<HTMLDivElement[]>()!;
let itemRefs = {} as any;

function setItemRef(el: any, item: MyElement) {
    itemRefs[item.id] = el;
}

function handleChromePrint(printProps: PrintProps) {
    return new Promise<PrintResult>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        await nextTick();
        await autoPage(data.pageList, data.panel, printProps.previewDataList);
        await nextTick();
        printArea();
        printResult(printProps.taskId!, {
            status: 'SUCCESS',
            type: 'CHROME_PRINT'
        }, data.previewTimeOutMap, data.resolveMap);
    });
}

function handleClientPrint(printProps: PrintProps) {
    return new Promise<PrintResult>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        await nextTick();
        await autoPage(data.pageList, data.panel, printProps.previewDataList);
        await nextTick();
        let printer = printProps.printer;
        
        if (isEmpty(printer)) {
            printer = configStore.defaultPrinter!;
        }
        
        if (isEmpty(printer)) {
            printResult(printProps.taskId!, {
                status: 'ERROR',
                msg: '未指定打印机',
                type: 'CLIENT_PRINT'
            }, data.previewTimeOutMap, data.resolveMap);
            return;
        }
        
        if (!myPrintClientService.connectIs()) {
            printResult(printProps.taskId!, {
                status: 'ERROR',
                msg: '客户端未连接',
                type: 'CLIENT_PRINT'
            }, data.previewTimeOutMap, data.resolveMap);
            return;
        }
        
        myPrintClientService.print({
            content: { html: getPrintElementHtml(previewContentRef.value!), printer: printProps.printer },
            cmd: 'print',
            taskId: printProps.taskId!
        }, data.panel).then(res => {
            handleClientResult(res, printResult, data.previewTimeOutMap, data.resolveMap, data.panel.name);
        });
    });
}

function handleChromeDownloadImg(printProps: PrintProps) {
    return new Promise<Blob[]>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        await nextTick();
        await autoPage(data.pageList, data.panel, printProps.previewDataList);
        chrome2Img(previewContentRef.value, {
            width: unit2px(data.panel.width, data.panel), height: unit2px(data.panel.height, data.panel)
        }).then(res => {
            // 清空内容
            data.pageList = [];
            resolve(res);
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                type: 'CHROME_GENERATE_IMG'
            }, data.previewTimeOutMap, data.resolveMap);
        });
    });
}

function handleServerDownloadImg(printProps: PrintProps) {
    return new Promise<Blob>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(data.pageList, data.panel, printProps.previewDataList);
        const html = getPrintElementHtml(previewContentRef.value!);
        downloadImg({
            content: html,
            height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
            width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
        }).then(async blob => {
            resolve(blob);
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                type: 'SERVER_GENERATE_IMG'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            reject(e);
        });
    });
}

function handleServerDownloadPdf(printProps: PrintProps) {
    debugger
    return new Promise<Blob>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(data.pageList, data.panel, printProps.previewDataList);
        const html = getPrintElementHtml(previewContentRef.value!);
        downloadPdf({
            content: html,
            height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
            width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
        }).then(async blob => {
            resolve(blob);
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                type: 'SERVER_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            reject(e);
        });
    });
}

function printArea() {
    const html = getPrintElementHtml(previewContentRef.value!);
    iFramePrint(data.panel, html);
}


</script>
