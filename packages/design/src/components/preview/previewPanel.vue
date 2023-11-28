<template>
  <el-dialog
      v-model="data.dialogVisible"
      class="preview-dialog"
      fullscreen
      append-to-body
      destroy-on-close
      @close="closePreviewPanel"
      :show-close="false">
    <div class="preview-panel">
      <el-scrollbar height="100%" class="preview-panel__scrollbar"
                    :style="{minWidth: valueUnit(panel.width),}">
        <div class="cp-print-preview-panel__wrap">
          <div class="preview-panel__model">
            <div class="cp-print-preview-panel__content">
              <div v-for="(page, index) in data.pageList"
                   ref="previewContent"
                   :key="index"
                   class="cp-print-preview-panel__content_page preview-page-top"
                   :style="{
                    width: valueUnit(page.width),
                    minHeight: valueUnit(page.height),
                    }">
                <preview
                    v-for="(element, index) in page.elementList"
                    :ref="(el) => setItemRef(el, element.element)"
                    :key="index" :preview="element"/>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="preview-panel__tool display-flex-column display-flex-wrap">
        <div>名称：{{ panel.name }}</div>
        <div>打印份数：测试</div>
        <div>客户端未连接，无法使用直接打印功能，去下载</div>
        <template v-if="connect">
          <div>打印机：
            <el-select v-model="data.printer" placeholder="请选择" size="large">
              <el-option
                  v-for="item in printerList"
                  :key="item.name"
                  :label="item.displayName"
                  :value="item.name"
              />
            </el-select>
          </div>
          <el-button style="margin-left: 0" :disabled="!configStore.printer" @click="print">{{
              i18n("toolbar.print")
            }}
          </el-button>
        </template>
        
        <el-button style="margin-left: 0" @click="printChromePdf">{{ i18n("toolbar.chrome.print") }}</el-button>
        <el-button style="margin-left: 0" @click="downloadPdf">{{ i18n('preview.download.pdf') }}</el-button>
        <el-button style="margin-left: 0" @click="()=>data.dialogVisible = false">{{ i18n('common.close') }}</el-button>
      </div>
    </div>
  
  </el-dialog>
</template>

<script setup lang="ts">
// import { ElDialog, ElScrollbar, ElButton, ElSelect, ElOption } from 'element-plus'
import {ref, inject, onMounted, reactive} from "vue";
import {toPdf} from "@cp-print/design/utils/pdfUtil";
import {download, printCssStyle} from "@cp-print/design/utils/utils";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";
import Preview from "./preview.vue";
import {Element, Panel} from "@cp-print/design/types/entity";
import {messageFun,
  // mittKey,
  panelKey
  // , previewDataKey
} from "@cp-print/design/constants/keys";
import {useSocket} from "@cp-print/design/stores/socket";
import {i18n} from "@cp-print/design/locales";
import {valueUnit} from "@cp-print/design/utils/elementUtil";
import {useConfigStore} from "@cp-print/design/stores/config";
// import {autoPage} from "./autoPage";

const {SEND: socketSend, printerList, connect} = useSocket()
const configStore = useConfigStore()
const data = reactive({
  dialogVisible: false,
  printer: configStore.defaultPrinter,
  pageList: [] as any
})
const previewContent = ref<HTMLDivElement[]>()!
// const mitt = inject(mittKey)!
const panel = inject(panelKey)! as Panel
const onMessage = inject(messageFun)!
// const previewData = inject(previewDataKey)!
let itemRefs = {} as any;

// mitt.on('previewPanel', previewPanel)

function print() {
  let html = ''
  for (let i = 0; i < previewContent.value!.length; i++) {
    html += previewContent.value![i].outerHTML
  }
  socketSend(JSON.stringify({
        content: {html, printer: data.printer},
        cmd: 'print',
        width: panel.width, height: panel.height,
      })
  )
}

function downloadPdf() {
  // console.log(previewContent.value)
  if (connect) {
    let html = ''
    for (let i = 0; i < previewContent.value!.length; i++) {
      html += previewContent.value![i].outerHTML
    }
    socketSend(JSON.stringify({
          content: {html},
          cmd: 'generatePdf',
          width: panel.width, height: panel.height,
        })
    )
  } else {
    toPdf(previewContent.value, {
      width: unit2px(panel.width), height: unit2px(panel.height),
    })
  }
}

function printChromePdf() {
  printArea()
}

onMounted(() => {

})

function setItemRef(el:any, item: Element) {
  // console.log('setItemRef', item.label)
  // console.log('setItemRef')
  itemRefs[item.id] = el
}

// function previewPanel() {
//   data.dialogVisible = true
//   // console.log(itemRefs)
//   // console.log(previewData)
//   autoPage(data.pageList, previewContent, itemRefs, previewData)
// }

function closePreviewPanel() {
  data.pageList = []
}

function printArea() {
  let html = '<div>'
  for (let i = 0; i < previewContent.value!.length; i++) {
    html += previewContent.value![i].outerHTML
  }
  html += '</div>'
  // 创建iframe
  let iframe = document.createElement("iframe");
  // 设置iframe样式
  iframe.setAttribute("id", "print-box");
  iframe.setAttribute(
      "style",
      "height: 800px; width: 2000px; position: absolute; left : 0; top: 0;border: 0;" +
      "z-index: 10000; background: wheat;"
  );
  // 在页面插入iframe
  document.body.appendChild(iframe);
  // 获取iframe内的html
  let iframeDocument = iframe.contentWindow!.document;
  // 经需要打印的DOM插入iframe
  
  const linkElement = iframeDocument.createElement('style');
  linkElement.type = 'text/css';
  linkElement.textContent = printCssStyle(); // 根据实际文件路径修改
  iframeDocument.body.innerHTML = html
  
  // 设置iframe内的header，添加样式文件
  iframeDocument.getElementsByTagName("head")[0].innerHTML = `
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
  setTimeout(function () {
    document.body.removeChild(iframe);
  }, 100)
  
}

onMessage.value = (msg: any) => {
  console.log(msg)
  let pdf = msg.pdf
  // console.log(pdf)
  if (pdf != null) {
    // 将Buffer对象转换为Uint8Array数组
    const uint8Array = new Uint8Array(pdf.data);
    // 将Uint8Array数组转换为Blob对象
    const blob = new Blob([uint8Array], {type: 'application/octet-stream'});
    download(blob, panel.name)
  }
}
</script>

<style lang="scss" scoped>
.preview-panel {
  width: 100%;
  position: absolute;
  display: flex;
  height: 100%;
  
  .preview-panel__scrollbar {
    flex: 1;
    width: calc(100% - 320px);
    padding: 10px;
    height: auto;
    background: rgb(96, 99, 104);
  }
  
  .preview-panel__model {
    margin: 10px;
  }
  
  .preview-page-top {
    margin: 10px 0;
    box-shadow: 0 0 12px rgba(0, 0, 0, .32)
  }
  
  .preview-panel__tool {
    //color: white;
    //background: rgb(41, 42, 45);
    min-width: 300px;
    max-width: 300px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
}


</style>
