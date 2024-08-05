<template>
    <div class="printer-panel">
        
        <my-form>
            <my-form-item label-width="100px" label="显示元素边界">
                <my-switch
                    v-model="configStore.settingDesign.autoAlign"
                    class="ml-2" />
            
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
