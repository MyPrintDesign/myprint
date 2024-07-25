<template>
    <div class="toolbar-container">
        <div class="display-flex space-between width-100-p">
            <style-design />
            
            <div class="display-flex-column toolbar-tool">
                <div class="display-flex">
                    <my-button v-if="designProps.showPrintButton" size="small" class="toolbar-tool_button_margin_right"
                               @click="print">
                        <my-icon>
                            <Printer />
                        </my-icon>
                        {{ i18n('toolbar.print') }}
                    </my-button>
                    <my-button v-if="designProps.showDownloadPdfButton" size="small"
                               class="toolbar-tool_button_margin_right"
                               @click="serverDownloadPdf">
                        <my-icon>
                            <Printer />
                        </my-icon>
                        {{ i18n('toolbar.download') }}
                    </my-button>
                    <my-button v-if="designProps.showPreviewButton" size="small"
                               class="toolbar-tool_button_margin_right" @click="preview">
                        <i class="icon-zitiyulan iconfont" />
                        {{ i18n('toolbar.preview') }}
                    </my-button>
                    <my-button v-if="designProps.showClearButton" size="small" class="toolbar-tool_button_margin_right"
                               @click="clearPanelClick">
                        {{ i18n('toolbar.clear') }}
                    </my-button>
                    <my-button v-if="designProps.showSaveButton" size="small" class="toolbar-tool_button_margin_right"
                               :disabled="getCurrentPanel().name == null || getCurrentPanel().name == ''"
                               @click="save">{{ i18n('toolbar.save') }}
                    </my-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { inject } from 'vue-demi';
import StyleDesign from './style-design.vue';
import { designPropsKey, mittKey, panelKey, previewDataKey } from '@myprint/design/constants/keys';
import { i18n } from '@myprint/design/locales';
import { clearPanel, displayModel, getCurrentPanel } from '@myprint/design/utils/elementUtil';
import { ActionEnum, record, Snapshot } from '@myprint/design/utils/historyUtil';
import { updatePanel } from '@myprint/design/plugins/moveable/moveable';
import { MyPrinter } from '@myprint/design/printer';
import { download } from '@myprint/design/utils/utils';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import Printer from '@myprint/design/components/my/icon/icons/Printer.vue';

const panel = inject(panelKey);
const mitt = inject(mittKey)!;
const previewData = inject(previewDataKey)!;
const designProps = inject(designPropsKey)!;

function print() {
    displayModel('print');
    MyPrinter.clientPrinter({ previewDataList: previewData.value, printer: 'PDFWriter' })
        .then(res => {
            console.log(res);
        });
}

function serverDownloadPdf() {
    displayModel('print');
    MyPrinter.pdfServer({ previewDataList: previewData.value })
        .then(blob => {
            download(blob, 'myprint.pdf');
        }).catch(e => {
        console.error(e);
        console.log('生成失败');
    });
}

function preview() {
    displayModel('preview');
    MyPrinter.chromePreview({ previewDataList: previewData.value })
        .then(res => {
            console.log(res);
        });
}

function save() {
    mitt.emit('saveTemplate', {} as any);
}

function clearPanelClick() {
    clearPanel(panel!);
    updatePanel();
    record(<Snapshot>{
        action: ActionEnum.CLEAR
    });
}
</script>
