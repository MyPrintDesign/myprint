<template>
  <div class="toolbar-container">
    
    <div class="display-flex space-between width-100-p">
      <style-design/>
      
      <div class="display-flex-column toolbar-tool">
        <div class="display-flex">
          <el-button @click="testMoveable">t</el-button>
          <el-button @click="refresh">r</el-button>
          <el-button size="small">
            <el-icon>
              <Printer/>
            </el-icon>
            {{ i18n('toolbar.print') }}
          </el-button>
          <el-button size="small" @click="preview">
            <i class="icon-zitiyulan iconfont"/>
            {{ i18n('toolbar.preview') }}
          </el-button>
          <el-button size="small" @click="clearPanelClick">{{ i18n('toolbar.clear') }}</el-button>
          <el-button size="small" @click="save">{{ i18n('toolbar.save') }}</el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
// import { ElIcon, ElButton } from 'element-plus'
import {inject} from 'vue'
import StyleDesign from "./styleDesign.vue";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {i18n} from "@cp-print/design/locales";
import {clearPanel} from "@cp-print/design/utils/elementUtil";
import {ActionEnum, record, Snapshot} from "@cp-print/design/utils/historyUtil";
import {Printer} from "@element-plus/icons-vue";
import {testMoveable} from "@cp-print/design/components/moveable/moveable";

const panel = inject(panelKey)
const mitt = inject(mittKey)!

function preview() {
  mitt.emit('previewPanel', {} as any)
}

function refresh() {
  window.location.reload()
}

function save() {
  mitt.emit('saveTemplate', {} as any)
}

function clearPanelClick() {
  clearPanel(panel)
  record(<Snapshot>{
    action: ActionEnum.CLEAR,
  })
}
</script>
