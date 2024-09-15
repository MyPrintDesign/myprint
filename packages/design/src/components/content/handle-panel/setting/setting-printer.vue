<template>
    <div class="printer-panel">
        
        <my-form label-width="80px" size="small"
                 label-position="right">
            
            <my-form-item :label="i18n('common.connect.status')">
                <div class="printer-status-icon" :class="[{
        'printer-status-icon-normal': useSocketData.connect,
        'printer-status-icon-error': !useSocketData.connect,
      }]">
                    {{ statusName }}
                </div>
            </my-form-item>
            
            <my-form-item :label="i18n('common.auto.connect')">
                <my-switch
                    v-model="configStore.autoConnect"
                    class="ml-2" />
            
            </my-form-item>
            
<!--            <my-form-item label="客户端协议">-->
<!--                <my-select v-model="configStore.clientProtocol"-->
<!--                           :data-list="clientProtocolList" />-->
<!--            -->
<!--            </my-form-item>-->
            
            <my-form-item :label="i18n('common.client.url')">
                <my-input v-model="configStore.clientUrl" />
            </my-form-item>
            
            
<!--            <my-form-item label="默认打印机">-->
<!--                <my-select v-model="configStore.defaultPrinter"-->
<!--                           :data-list="useSocketData.printerList" />-->
<!--            </my-form-item>-->
        
        </my-form>
        
        <!--    <div>下载客户端 myprint/lodop/hiprint</div>-->
    
    </div>
</template>

<script setup lang="ts">
import { useSocket } from '@myprint/design/stores/socket';
import { computed } from 'vue-demi';
// import { clientProtocolList } from '@myprint/design/constants/common';
import { useConfigStore } from '@myprint/design/stores/config';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
// import MySelect from '@myprint/design/components/my/select/my-select.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyInput from '@myprint/design/components/my/input/my-input.vue';
import { i18n } from '@myprint/design/locales';

const useSocketData = useSocket();
const configStore = useConfigStore();

const statusName = computed(() => {
    return useSocketData.connect ? '连接成功' : '连接断开';
});

</script>
