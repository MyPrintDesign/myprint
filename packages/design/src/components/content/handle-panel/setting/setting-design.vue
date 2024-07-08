<template>
    <div class="printer-panel">
        
        <my-form label-width="80px" size="small"
                 label-position="right">
            
            <my-form-item label="自动对齐">
                <my-switch
                    v-model="configStore.settingDesign.autoAlign"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: gray" />
            
            </my-form-item>
        
        </my-form>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@myprint/design/stores/config';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';

const configStore = useConfigStore();


</script>
