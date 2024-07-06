<template>
    <div class="toolbar-container">
        
        <div class="display-flex space-between width-100-p">
                                    <style-design />
            
            <div class="display-flex-column toolbar-tool">
                <div class="display-flex">
                    <el-button @click="refresh">r</el-button>
                    <el-button size="small" @click="print">
                        <el-icon>
                            <Printer />
                        </el-icon>
                        {{ i18n('toolbar.print') }}
                    </el-button>
                    <el-button size="small" @click="serverDownloadPdf">
                        <el-icon>
                            <Printer />
                        </el-icon>
                        下载
                    </el-button>
                    <my-button size="small" @click="preview">
                        <i class="icon-zitiyulan iconfont" />
                        {{ i18n('toolbar.preview') }}
                    </my-button>
                    <el-button size="small" @click="clearPanelClick">{{ i18n('toolbar.clear') }}</el-button>
                    <el-button size="small" :disabled="getCurrentPanel().name == null || getCurrentPanel().name == ''"
                               @click="save">{{ i18n('toolbar.save') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
// import { ElIcon, ElButton } from 'element-plus'
import { inject } from 'vue';
import StyleDesign from './style-design.vue';
import { mittKey, panelKey, previewDataKey } from '@myprint/design/constants/keys';
import { i18n } from '@myprint/design/locales';
import { clearPanel, displayModel, getCurrentPanel } from '@myprint/design/utils/elementUtil';
import { ActionEnum, record, Snapshot } from '@myprint/design/utils/historyUtil';
import { updatePanel } from '@myprint/design/plugins/moveable/moveable';
import { Printer } from '@element-plus/icons-vue';
import { MyPrinter } from '@myprint/design/printer';
import { download } from '@myprint/design/utils/utils';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';

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
