<template>
    <div class="my-print-preview-panel__wrap my-print-print_hidden">
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
                        v-for="(element, index) in page.previewWrapperList"
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
import { MyElement, Panel, PrintOptions, PrintResult } from '@myprint/design/types/entity';
import { getCurrentPanelUnit, valueUnit } from '@myprint/design/utils/elementUtil';
import Preview from '@myprint/design/components/preview/preview.vue';
import { autoPage } from '@myprint/design/components/preview/autoPage';
import { chrome2Img, toPdf } from '@myprint/design/utils/pdfUtil';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { downloadImg, downloadPdf } from '@myprint/design/api/pdfServer';
import { getPrintElementHtml, iFramePrint } from '@myprint/design/utils/myprint';
import {
    handleClientResult,
    handleTimeOut,
    myPrintClientService,
    printResult
} from '@myprint/design/plugins/myprintClientService';

defineExpose({
    handleChromePrint,
    handleClientPrint,
    handleChromeDownloadImg,
    handleServerDownloadImg,
    handleChromeDownloadPdf,
    handleClientDownloadPdf,
    handleServerDownloadPdf
});
const data = reactive({
    dialogVisible: false,
    pageList: [] as any[],
    resolveMap: {},
    previewTimeOutMap: {},
    panel: null! as Panel
});
const previewContentRef = ref<HTMLDivElement[]>()!;
let itemRefs = {} as any;

function setItemRef(el: any, item: MyElement) {
    itemRefs[item.id] = el;
}

function handleChromePrint(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        data.panel = printProps.panel as Panel;
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        await nextTick();
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        printArea();
        data.pageList.length = 0;
        printResult(printProps.taskId!, {
            status: 'SUCCESS',
            type: 'CHROME_PRINT'
        }, data.previewTimeOutMap, data.resolveMap);
    });
}

function handleClientPrint(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        if (printProps.panel) {
            data.panel = printProps.panel as Panel;
            await nextTick();
            await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
            await nextTick();
        }
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        // let printer = printProps.printer;
        
        if (!myPrintClientService.connectIs()) {
            printResult(printProps.taskId!, {
                status: 'ERROR',
                msg: '客户端未连接',
                type: 'CLIENT_PRINT'
            }, data.previewTimeOutMap, data.resolveMap);
            return;
        }
        
        // if (isEmpty(printer)) {
        // printResult(printProps.taskId!, {
        //     status: 'ERROR',
        //     msg: '未指定打印机',
        //     type: 'CLIENT_PRINT'
        // }, data.previewTimeOutMap, data.resolveMap);
        // return;
        // }
        
        myPrintClientService.print({
            cmd: 'print',
            taskId: printProps.taskId!,
            options: {
                ...printProps,
                title: printProps.title ? printProps.title : (printProps.panel ? (printProps.panel as Panel).name : undefined),
                html: printProps.panel ? getPrintElementHtml(previewContentRef.value!, data.pageList) : undefined,
                file: printProps.file ? printProps.file as string : undefined,
                panel: undefined!,
                previewDataList: undefined!
            }
        }, data.panel).then(clientCmd => {
            handleClientResult(clientCmd, printResult, data.previewTimeOutMap, data.resolveMap);
        });
    });
}

function handleChromeDownloadImg(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, _reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        chrome2Img(previewContentRef.value, {
            width: unit2px(data.panel.width, data.panel), height: unit2px(data.panel.height, data.panel)
        }).then(blobList => {
            // 清空内容
            data.pageList = [];
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                blobList,
                type: 'CHROME_GENERATE_IMG'
            }, data.previewTimeOutMap, data.resolveMap);
        });
    });
}

function handleServerDownloadImg(printProps: PrintOptions) {
    return new Promise<Blob>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        const html = getPrintElementHtml(previewContentRef.value!, data.pageList);
        downloadImg({
            content: html,
            height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
            width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
        }).then(blob => {
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                blob,
                type: 'SERVER_GENERATE_IMG'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            reject({
                status: 'SUCCESS',
                msg: e.msg,
                type: 'SERVER_GENERATE_IMG'
            });
        });
    });
}

function handleChromeDownloadPdf(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        toPdf(previewContentRef.value, {
            width: unit2px(data.panel.width, data.panel), height: unit2px(data.panel.height, data.panel)
        }).then(blob => {
            data.pageList.length = 0;
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                blob,
                type: 'CHROME_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            data.pageList.length = 0;
            reject({
                status: 'ERROR',
                msg: e.msg,
                type: 'CHROME_GENERATE_PDF'
            });
        });
    });
}

function handleClientDownloadPdf(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        
        myPrintClientService.print({
            options: { html: getPrintElementHtml(previewContentRef.value!, data.pageList) },
            cmd: 'generatePdf',
            taskId: printProps.taskId!
        }, data.panel).then(res => {
            handleClientResult(res, printResult, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            reject({
                status: 'ERROR',
                msg: e.msg,
                type: 'CLIENT_GENERATE_PDF'
            });
        });
    });
}

function handleServerDownloadPdf(printProps: PrintOptions) {
    return new Promise<PrintResult>(async (resolve, reject) => {
        data.resolveMap[printProps.taskId!] = resolve;
        
        handleTimeOut(printProps, data.previewTimeOutMap, data.resolveMap);
        data.panel = printProps.panel as Panel;
        
        await nextTick();
        await autoPage(previewContentRef, data.pageList, data.panel, printProps.previewDataList);
        const html = getPrintElementHtml(previewContentRef.value!, data.pageList);
        downloadPdf({
            content: html,
            height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
            width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
        }).then(blob => {
            printResult(printProps.taskId!, {
                status: 'SUCCESS',
                blob: blob,
                type: 'SERVER_GENERATE_PDF'
            }, data.previewTimeOutMap, data.resolveMap);
        }).catch(e => {
            reject({
                status: 'ERROR',
                msg: e.msg,
                type: 'SERVER_GENERATE_PDF'
            });
        });
    });
}

function printArea() {
    const html = getPrintElementHtml(previewContentRef.value!, data.pageList);
    iFramePrint(data.panel, html);
}

</script>
