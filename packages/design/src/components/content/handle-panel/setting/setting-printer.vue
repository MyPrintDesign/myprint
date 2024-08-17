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
import { useSocket } from '../../../../stores/socket';
import { computed } from 'vue-demi';
// import { clientProtocolList } from '../../../../constants/common';
import { useConfigStore } from '../../../../stores/config';
import MySwitch from '../../../../components/my/switch/my-switch.vue';
// import MySelect from '../../../../components/my/select/my-select.vue';
import MyFormItem from '../../../../components/my/form/my-form-item.vue';
import MyForm from '../../../../components/my/form/my-form.vue';
import MyInput from '../../../../components/my/input/my-input.vue';
import { i18n } from '../../../../locales';

const useSocketData = useSocket();
const configStore = useConfigStore();

const statusName = computed(() => {
    return useSocketData.connect ? '连接成功' : '连接断开';
});

</script>
