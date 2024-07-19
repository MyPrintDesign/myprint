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
import { inject, nextTick, reactive, ref } from 'vue-demi';
import { download } from '@myprint/design/utils/utils';
import { MyElement, Panel, PrintProps } from '@myprint/design/types/entity';
import { messageFun } from '@myprint/design/constants/keys';
import { displayModelPrint, getCurrentPanelUnit, valueUnit } from '@myprint/design/utils/elementUtil';
import { useConfigStore } from '@myprint/design/stores/config';
import Preview from '@myprint/design/components/preview/preview.vue';
import { autoPage } from '@myprint/design/components/preview/autoPage';
import { chrome2Img } from '@myprint/design/utils/pdfUtil';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { downloadImg, downloadPdf } from '@myprint/design/api/pdfServer';
import { getPrintElementHtml, iFramePrint } from '@myprint/design/utils/myprint';

defineExpose({ handleClientPrint, handleChromeDownloadImg, handleServerDownloadImg, handleServerDownloadPdf });
// const { SEND: socketSend, printerList, connect } = useSocket();
const configStore = useConfigStore();
const data = reactive({
    dialogVisible: false,
    printer: configStore.defaultPrinter,
    pageList: [] as any,
    panel: null! as Panel
});
const previewContentRef = ref<HTMLDivElement[]>()!;
const onMessage = inject(messageFun)!;
let itemRefs = {} as any;

function setItemRef(el: any, item: MyElement) {
    itemRefs[item.id] = el;
}

function handleClientPrint(printProps: PrintProps) {
    data.panel = printProps.panel as Panel;
    data.dialogVisible = true;
    nextTick(() => {
        // console.log(printProps);
        autoPage(data.pageList, data.panel, printProps.previewDataList)
            .then(() => {
                nextTick(() => {
                    printArea();
                });
            });
    });
}

function handleChromeDownloadImg(printProps: PrintProps) {
    return new Promise<ArrayBuffer[]>((resolve, reject) => {
        data.panel = printProps.panel as Panel;
        data.dialogVisible = true;
        nextTick(() => {
            autoPage(data.pageList, data.panel, printProps.previewDataList)
                .then(() => {
                    chrome2Img((imgList) => {
                        // 清空内容
                        data.pageList = [];
                        resolve(imgList);
                    }, previewContentRef.value, {
                        width: unit2px(data.panel.width, data.panel), height: unit2px(data.panel.height, data.panel)
                    });
                }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

function handleServerDownloadImg(printProps: PrintProps) {
    return new Promise<Blob>((resolve, reject) => {
        data.panel = printProps.panel as Panel;
        data.dialogVisible = true;
        nextTick(() => {
            autoPage(data.pageList, data.panel, printProps.previewDataList)
                .then(() => {
                    const html = getPrintElementHtml(previewContentRef.value!);
                    downloadImg({
                        content: html,
                        height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
                        width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
                    }).then(async blob => {
                        resolve(blob);
                    }).catch(e => {
                        reject(e);
                    });
                }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

function handleServerDownloadPdf(printProps: PrintProps) {
    return new Promise<Blob>((resolve, reject) => {
        data.panel = printProps.panel as Panel;
        data.dialogVisible = true;
        nextTick(() => {
            autoPage(data.pageList, data.panel, printProps.previewDataList)
                .then(() => {
                    const html = getPrintElementHtml(previewContentRef.value!);
                    downloadPdf({
                        content: html,
                        height: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.height),
                        width: unit2unit(getCurrentPanelUnit(data.panel), 'mm', data.panel.width)
                    }).then(async blob => {
                        resolve(blob);
                    }).catch(e => {
                        reject(e);
                    });
                }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

function printArea() {
    const html = getPrintElementHtml(previewContentRef.value!);
    iFramePrint(data.panel, html);
}

onMessage.value = (msg: any) => {
    let pdf = msg.pdf;
    // console.log(pdf)
    if (pdf != null) {
        // 将Buffer对象转换为Uint8Array数组
        const uint8Array = new Uint8Array(pdf.data);
        // 将Uint8Array数组转换为Blob对象
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
        download(blob, data.panel.name);
    }
};
</script>
