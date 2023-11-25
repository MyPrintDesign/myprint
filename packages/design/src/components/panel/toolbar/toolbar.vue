<template>
  <div class="toolbar-container">
    
    <div class="display-flex space-between width-100-p">
      <style-design/>
      
      <div class="display-flex-column toolbar-tool">
        <div class="display-flex">
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
import { ElIcon, ElButton } from 'element-plus'
import {inject, ref} from 'vue'
import StyleDesign from "./styleDesign.vue";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {i18n} from "@cp-print/design/locales";
import {clearPanel} from "@cp-print/design/utils/elementUtil";
import {ActionEnum, record, Snapshot} from "@cp-print/design/utils/historyUtil";
import {Printer} from "@element-plus/icons-vue";

const panel = inject(panelKey)
const mitt = inject(mittKey)

function preview() {
  mitt.emit('previewPanel')
}

function save() {
  mitt.emit('saveTemplate')
}

function clearPanelClick() {
  clearPanel(panel)
  record(<Snapshot>{
    action: ActionEnum.CLEAR,
  })
}
</script>

<style lang="scss" scoped>
.toolbar-container {
  height: var(--header-height);
  display: flex;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .toolbar-tool {
    justify-content: center;
  }
}
</style>

<style>
.el-input-group__append {
  padding: 0;
}

</style>
