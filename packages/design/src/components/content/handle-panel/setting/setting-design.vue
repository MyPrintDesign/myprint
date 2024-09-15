<template>
    <div class="printer-panel">
        <my-form>
            <my-form-item label-width="100px" :label="i18n('common.show.element.design.border')">
                <my-switch
                    v-model="configStore.settingDesign.showElementDesignBorderIs"
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
import { i18n } from '@myprint/design/locales';

const configStore = useConfigStore();

</script>
