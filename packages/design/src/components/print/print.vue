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
                    width: valueUnit(page.width),
                    minHeight: valueUnit(page.height),
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
import { inject, nextTick, reactive, ref } from 'vue';
import { download, printCssStyle } from '@myprint/design/utils/utils';
import { MyElement, Panel } from '@myprint/design/types/entity';
import { messageFun, mittKey } from '@myprint/design/constants/keys';
import { displayModelPrint, getCurrentPanel, getCurrentPanelUnit, valueUnit } from '@myprint/design/utils/elementUtil';
import { useConfigStore } from '@myprint/design/stores/config';
import Preview from '@myprint/design/components/preview/preview.vue';
import { autoPage } from '@myprint/design/components/preview/autoPage';
import { PrintProps } from '@myprint/design/types/entity';
import { toImg } from '@myprint/design/utils/pdfUtil';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { downloadImg, downloadPdf } from '@myprint/design/api/pdfServer';

defineExpose({ handlePrint, design2Img, handleServerDownloadImg, handleServerDownloadPdf });
// const { SEND: socketSend, printerList, connect } = useSocket();
const configStore = useConfigStore();
const data = reactive({
    dialogVisible: false,
    printer: configStore.defaultPrinter,
    pageList: [] as any,
    panel: null! as Panel
});
const previewContentRef = ref<HTMLDivElement[]>()!;
const mitt = inject(mittKey)!;
const onMessage = inject(messageFun)!;
let itemRefs = {} as any;
mitt.on('design2Img', design2Img);

function setItemRef(el: any, item: MyElement) {
    // console.log('setItemRef', item.label)
    // console.log('setItemRef')
    itemRefs[item.id] = el;
}

function handlePrint(printProps: PrintProps) {
    data.panel = printProps.panel as Panel;
    data.dialogVisible = true;
    nextTick(() => {
        // console.log(printProps);
        autoPage(data.pageList, data.panel, printProps.previewDataList)
            .then(() => {
                printArea();
            });
    });
}

function design2Img(printProps: PrintProps) {
    return new Promise<ArrayBuffer[]>((resolve, reject) => {
        data.panel = printProps.panel as Panel;
        data.dialogVisible = true;
        nextTick(() => {
            autoPage(data.pageList, data.panel, printProps.previewDataList)
                .then(() => {
                    toImg((imgList) => {
                        // 清空内容
                        data.pageList = [];
                        resolve(imgList);
                    }, previewContentRef.value, {
                        width: unit2px(data.panel.width), height: unit2px(data.panel.height)
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
                    const html = getPrintElementHtml();
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
                    const html = getPrintElementHtml();
                    
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

function getPrintElementHtml() {
    let html = '<div style="  --tcolor: black;">';
    for (let i = 0; i < previewContentRef.value!.length; i++) {
        html += previewContentRef.value![i].outerHTML;
    }
    html += '</div>';
    
    return html;
}

function printArea() {
    const panel = getCurrentPanel();
    const html = getPrintElementHtml();
    // 创建iframe
    let iframe = document.createElement('iframe');
    // 设置iframe样式
    iframe.setAttribute('id', 'print-box');
    iframe.setAttribute(
        'style',
        `height: ${valueUnit(panel.height)}; width: ${valueUnit(panel.width)}; position: absolute;; left: 0; top: 0;border: 0;
      z-index: 10000;`
    );
    // 在页面插入iframe
    document.body.appendChild(iframe);
    // 获取iframe内的html
    let iframeDocument = iframe.contentWindow!.document;
    // 经需要打印的DOM插入iframe
    
    const linkElement = iframeDocument.createElement('style');
    linkElement.type = 'text/css';
    linkElement.textContent = printCssStyle(); // 根据实际文件路径修改
    iframeDocument.body.innerHTML = html;
    
    // 设置iframe内的header，添加样式文件
    iframeDocument.getElementsByTagName('head')[0].innerHTML = `
  <style>
    *{ margin:0;padding:0; }
    @media print {
      @page {
        size: ${valueUnit(panel.width)} ${valueUnit(panel.height)};
        margin: 0;
      }
    }
  </style>
  <meta http-equiv="content-type" content="text/html;charset=utf-8">`;
    iframeDocument.head.appendChild(linkElement);
    
    // 关闭iframe
    iframeDocument.close();
    // 使iframe失去焦点
    iframe.contentWindow!.focus();
    // 调用iframe的打印方法
    iframe.contentWindow!.print();
    // 移除iframe
    setTimeout(function() {
        // console.log('关闭');
        // data.pageList = [];
        // document.body.removeChild(iframe);
    }, 100);
    
}

onMessage.value = (msg: any) => {
    console.log(msg);
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
