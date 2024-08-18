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
import StyleDesign from './style-design.vue';
import { i18n } from '../../../locales';
import { clearPanel, defaultPreviewData, getCurrentPanel, getPreviewData } from '../../../utils/elementUtil';
import { ActionEnum, record, Snapshot } from '../../../utils/historyUtil';
import { updatePanel } from '../../../plugins/moveable/moveable';
import { MyPrinter } from '../../../printer';
import { download, mitt } from '../../../utils/utils';
import MyButton from '../../../components/my/button/my-Button.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';
import Printer from '../../../components/my/icon/icons/Printer.vue';
import { MyMessage } from '../../../components/my/message/my-message';
//@ts-ignore
import { DesignPanelProps } from '../../../types/entity';
import { useAppStoreHook as appStore } from '@myprint/design/stores/app';
const useApp = appStore()
withDefaults(defineProps<{
    designProps: DesignPanelProps;
}>(), {

});

function print() {
    const defaultPrinter = MyPrinter.getDefaultPrinter();
    MyPrinter.clientPrinter({ previewDataList: useApp.previewData, printer: defaultPrinter?.name })
        .then(res => {
            switch (res.status) {
                case 'SUCCESS':
                    break;
                case 'TIMEOUT':
                    MyMessage.error('打印超时');
                    break;
                case 'ERROR':
                    MyMessage.error('打印失败，' + res.msg);
                    break;
            }
        }).catch(e => {
        MyMessage.error('打印失败，' + e.msg);
    });
}

function serverDownloadPdf() {
    MyPrinter.pdfServer({ previewDataList: useApp.previewData })
        .then(res => {
            switch (res.status) {
                case 'SUCCESS':
                    download(res.blob!, 'myprint.pdf');
                    break;
                case 'TIMEOUT':
                    MyMessage.error('下载超时');
                    break;
                case 'ERROR':
                    MyMessage.error('下载失败，' + res.msg);
                    break;
            }
        }).catch(e => {
        MyMessage.error('下载失败，' + e.msg);
    });
}

function preview() {
    MyPrinter.chromePreview({ previewDataList: defaultPreviewData(useApp.previewData) });
}

function save() {
    mitt.emit('saveTemplate', {} as any);
}

function clearPanelClick() {
    clearPanel(getCurrentPanel());
    updatePanel();
    record(<Snapshot>{
        action: ActionEnum.CLEAR
    });
}
</script>
