<template>
    <div class="toolbar-container">
        <div class="display-flex space-between width-100-p">
            <style-design />
            
            <div class="display-flex-column toolbar-tool">
                <div class="display-flex">
                    <my-button @click="refresh">r</my-button>
                    <my-button size="small" @click="print">
                        <my-icon>
                            <Printer />
                        </my-icon>
                        {{ i18n('toolbar.print') }}
                    </my-button>
                    <my-button size="small" @click="serverDownloadPdf">
                        <my-icon>
                            <Printer />
                        </my-icon>
                        下载
                    </my-button>
                    <my-button size="small" @click="preview">
                        <i class="icon-zitiyulan iconfont" />
                        {{ i18n('toolbar.preview') }}
                    </my-button>
                    <my-button size="small" @click="clearPanelClick">{{ i18n('toolbar.clear') }}</my-button>
                    <my-button size="small" :disabled="getCurrentPanel().name == null || getCurrentPanel().name == ''"
                               @click="save">{{ i18n('toolbar.save') }}
                    </my-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { inject } from 'vue';
import StyleDesign from './style-design.vue';
import { mittKey, panelKey, previewDataKey } from '../../../constants/keys';
import { i18n } from '../../../locales';
import { clearPanel, displayModel, getCurrentPanel } from '../../../utils/elementUtil';
import { ActionEnum, record, Snapshot } from '../../../utils/historyUtil';
import { updatePanel } from '../../../plugins/moveable/moveable';
import { MyPrinter } from '../../../printer';
import { download } from '../../../utils/utils';
import MyButton from '../../../components/my/button/my-Button.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';
import Printer from '../../../components/my/icon/icons/Printer.vue';

const panel = inject(panelKey);
const mitt = inject(mittKey)!;
const previewData = inject(previewDataKey)!;

function print() {
    displayModel('print');
    MyPrinter.printer({ previewDataList: previewData.value });
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
    MyPrinter.preview({ previewDataList: previewData.value })
        .then(res => {
            console.log(res);
        });
}

function refresh() {
    window.location.reload();
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
