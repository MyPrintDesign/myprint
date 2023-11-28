<template>
  <div class="printer-panel">
    
    <el-form label-width="80px" size="small"
             label-position="right">
      
      <el-form-item label="连接状态">
        <div class="printer-status-icon" :class="[{
        'printer-status-icon-normal': useSocketData.connect,
        'printer-status-icon-error': !useSocketData.connect,
      }]">
          {{ statusName }}
        </div>
      </el-form-item>
      
      <el-form-item label="自动连接">
        <el-switch
            v-model="configStore.autoConnect"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: gray"/>
      
      </el-form-item>
      
      <el-form-item label="客户端协议">
        <el-select v-model="configStore.clientProtocol" placeholder="Select" size="small">
          <el-option
              v-for="item in clientProtocolList"
              :key="item.protocol"
              :label="item.protocol"
              :value="item.protocol"
          />
        </el-select>
      
      </el-form-item>
      
      <el-form-item label="客户端地址">
        <el-input v-model="configStore.clientUrl"/>
      </el-form-item>
      
      
      <el-form-item label="默认打印机">
        <el-select v-model="configStore.defaultPrinter" placeholder="Select" size="small"
                   clearable>
          <el-option
              v-for="item in useSocketData.printerList"
              :key="item.name"
              :label="item.displayName"
              :value="item.name"
          />
        </el-select>
      </el-form-item>
    
    </el-form>
    
    <!--    <div>下载客户端 cprint/lodop/hiprint</div>-->
  
  </div>
</template>

<script setup lang="ts">
// import { ElForm, ElFormItem, ElSwitch, ElSelect, ElOption } from 'element-plus'
import {useSocket} from "@cp-print/design/stores/socket";
import {computed} from "vue";
import {clientProtocolList} from "@cp-print/design/constants/common";
import {useConfigStore} from "@cp-print/design/stores/config";

const useSocketData = useSocket()
const configStore = useConfigStore()

const statusName = computed(() => {
  return useSocketData.connect ? '连接成功' : '连接断开'
})

</script>
