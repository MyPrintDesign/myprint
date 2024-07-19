<template>
    <div class="printer-panel">
        
        <my-form label-width="80px" size="small"
                 label-position="right">
            
            <my-form-item label="连接状态">
                <div class="printer-status-icon" :class="[{
        'printer-status-icon-normal': useSocketData.connect,
        'printer-status-icon-error': !useSocketData.connect,
      }]">
                    {{ statusName }}
                </div>
            </my-form-item>
            
            <my-form-item label="自动连接">
                <my-switch
                    v-model="configStore.autoConnect"
                    class="ml-2"
                    inline-prompt/>
            
            </my-form-item>
            
            <my-form-item label="客户端协议">
                <my-select v-model="configStore.clientProtocol"
                           :data-list="clientProtocolList"
                           placeholder="Select" size="small" />
            
            </my-form-item>
            
            <my-form-item label="客户端地址">
                <my-input v-model="configStore.clientUrl" />
            </my-form-item>
            
            
            <my-form-item label="默认打印机">
                <my-select v-model="configStore.defaultPrinter" placeholder="Select" size="small"
                           :data-list="useSocketData.printerList"
                           clearable />
            </my-form-item>
        
        </my-form>
        
        <!--    <div>下载客户端 myprint/lodop/hiprint</div>-->
    
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '@myprint/design/stores/socket';
import { computed } from 'vue-demi';
import { clientProtocolList } from '@myprint/design/constants/common';
import { useConfigStore } from '@myprint/design/stores/config';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MySelect from '@myprint/design/components/my/select/my-select.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyInput from '@myprint/design/components/my/input/my-input.vue';

const useSocketData = useSocket();
const configStore = useConfigStore();

const statusName = computed(() => {
    return useSocketData.connect ? '连接成功' : '连接断开';
});

</script>
