<template>
  <div class="printer-panel">
    
    <el-form label-width="80px" size="small"
             label-position="right">
      
      <el-form-item label="自动对齐">
        <el-switch
            v-model="configStore.settingDesign.autoAlign"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: gray"/>
      
      </el-form-item>
    
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem, ElSwitch } from 'element-plus'
import {useConfigStore} from "@cp-print/design/stores/config";

const configStore = useConfigStore()


</script>

<style scoped>
.printer-panel {
  padding: 20px;
  height: calc(100% - 100px);
  
}
</style>
