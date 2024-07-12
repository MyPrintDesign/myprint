<template>
    <my-dialog
        v-model="data.dialogVisible"
        class="preview-dialog"
        fullscreen
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
                <template v-if="useSocket().connect">
                    <div>打印机：
                        <my-select v-model="data.printer" placeholder="请选择" size="large"
                                   :data-list="useSocket().printerList" />
                    </div>
                    <my-button style="margin-left: 0" :disabled="!data.printer" @click="print">{{
                            i18n('toolbar.print')
                        }}
                    </my-button>
                </template>
                
                <my-button style="margin-left: 0" @click="printChromePdf">{{ i18n('toolbar.chrome.print') }}</my-button>
                <my-button style="margin-left: 0" @click="downloadPdf">{{ i18n('preview.download.pdf') }}</my-button>
                <my-button style="margin-left: 0" @click="()=>data.dialogVisible = false">{{ i18n('common.close') }}
                </my-button>
            </div>
        </div>
    
    </my-dialog>
</template>

<script setup lang="ts">
import { inject, nextTick, reactive, ref } from 'vue';
import { toPdf } from '@myprint/design/utils/pdfUtil';
import { download, printCssStyle } from '@myprint/design/utils/utils';
import { unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import Preview from './preview.vue';
import { ClientCmd, MyElement, Panel, PrintResult } from '@myprint/design/types/entity';
import { messageFun } from '@myprint/design/constants/keys';
import { useSocket } from '@myprint/design/stores/socket';
import { i18n } from '@myprint/design/locales';
import { displayModel, getCurrentPanelUnit, valueUnit } from '@myprint/design/utils/elementUtil';
import { useConfigStore } from '@myprint/design/stores/config';
import { autoPage } from './autoPage';
import { PrintProps } from '@myprint/design/types/entity';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';
import MyDialog from '@myprint/design/components/my/dialog/my-dialog.vue';
import MySelect from '@myprint/design/components/my/select/my-select.vue';

defineExpose({ handlePreview });

const configStore = useConfigStore();
const data = reactive({
    dialogVisible: false,
    printer: configStore.defaultPrinter,
    pageList: [] as any,
    resolveMap: {},
    previewTimeOut: null! as any,
    printTaskId: null as any
});
const previewContentRef = ref<HTMLDivElement[]>()!;
const panel = ref({} as Panel);
const onMessage = inject(messageFun)!;
let itemRefs = {} as any;

function print() {
    let html = '';
    for (let i = 0; i < previewContentRef.value!.length; i++) {
        html += previewContentRef.value![i].outerHTML;
    }
    useSocket().SEND(JSON.stringify({
            content: { html, printer: data.printer },
            cmd: 'print',
            taskId: data.printTaskId,
            width: unit2unit(getCurrentPanelUnit(panel.value), 'mm', panel.value.width),
            height: unit2unit(getCurrentPanelUnit(panel.value), 'mm', panel.value.height)
        })
    );
}

function downloadPdf() {
    // console.log(previewContent.value)
    if (useSocket().connect) {
        let html = '';
        for (let i = 0; i < previewContentRef.value!.length; i++) {
            html += previewContentRef.value![i].outerHTML;
        }
        useSocket().SEND(JSON.stringify({
                taskId: data.printTaskId,
                content: { html },
                cmd: 'generatePdf',
                width: unit2unit(getCurrentPanelUnit(panel.value), 'mm', panel.value.width),
                height: unit2unit(getCurrentPanelUnit(panel.value), 'mm', panel.value.height)
            })
        );
    } else {
        toPdf(previewContentRef.value, {
            width: unit2px(panel.value.width, panel.value), height: unit2px(panel.value.height, panel.value)
        });
    }
}

function printChromePdf() {
    printResult(data.printTaskId, {
        status: 'SUCCESS',
        type: 'CHROME_PRINT'
    });
    printArea();
}

function printResult(printTaskId: string, result: PrintResult) {
    
    if (data.previewTimeOut) {
        clearTimeout(data.previewTimeOut);
    }
    
    if (data.resolveMap[printTaskId]) {
        data.resolveMap[printTaskId](result);
        delete data.resolveMap[printTaskId];
    }
}

function setItemRef(el: any, item: MyElement) {
    // console.log('setItemRef', item.label)
    // console.log('setItemRef')
    itemRefs[item.id] = el;
}

function handlePreview(printProps: PrintProps) {
    data.dialogVisible = true;
    panel.value = printProps.panel as Panel;
    data.printTaskId = crypto.randomUUID();
    
    if (printProps.timeout! > 0) {
        data.previewTimeOut = setTimeout(() => {
            printResult(data.printTaskId, {
                status: 'TIMEOUT',
                type: 'TIMEOUT'
            });
        }, printProps.timeout);
    }
    
    return new Promise<PrintResult>((resolve, _reject) => {
        data.resolveMap[data.printTaskId] = resolve;
        nextTick(() => {
            autoPage(data.pageList, panel.value, printProps.previewDataList);
        });
    });
}

function closePreviewPanel() {
    displayModel('design');
    data.pageList = [];
}

function printArea() {
    let html = '<div style="  --tcolor: black;">';
    for (let i = 0; i < previewContentRef.value!.length; i++) {
        html += previewContentRef.value![i].outerHTML;
    }
    html += '</div>';
    // 创建iframe
    let iframe = document.createElement('iframe');
    // 设置iframe样式
    iframe.setAttribute('id', 'print-box');
    iframe.setAttribute(
        'style',
        `height: ${valueUnit(panel.value.height, panel.value)}; width: ${valueUnit(panel.value.width, panel.value)}; position: absolute; left : 100px; top: 0;border: 0;
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
        size: ${valueUnit(panel.value.width, panel.value)} ${valueUnit(panel.value.height, panel.value)};
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
        document.body.removeChild(iframe);
    }, 100);
    
}

onMessage.value = (msg: ClientCmd) => {
    if (msg.cmd == 'printResult') {
        printResult(msg.taskId, {
            status: msg.content.success ? 'SUCCESS' : 'ERROR',
            msg: msg.content.failureReason,
            type: 'CLIENT_PRINT'
        });
    }
    
    if (msg.cmd == 'generatePdfResult') {
        printResult(msg.taskId, {
            status: 'SUCCESS',
            msg: '',
            type: 'CLIENT_GENERATE_PDF'
        });
        
        let pdf = msg.pdf;
        // console.log(pdf)
        if (pdf != null) {
            // 将Buffer对象转换为Uint8Array数组
            // @ts-ignore
            const uint8Array = new Uint8Array(pdf.data);
            // 将Uint8Array数组转换为Blob对象
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            download(blob, panel.value.name);
        }
    }
    
};
</script>
