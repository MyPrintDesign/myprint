<template>
    <my-form class="my-form" label-width="80px" size="small"
             label-position="right">
        
        <my-divider-panel>
            <template #divider>
                {{ i18n('common.panel') }}
            </template>
            
            <my-form-item :label="i18n('handle.template.name')">
                <my-history-input v-model="panel.name"
                                  type="textarea"
                                  :placeholder="i18n('handle.please.template.name')"
                                  :historyLabel="i18n('handle.template.name')"
                                  style="margin-right: 18px" />
            </my-form-item>
            
            <my-form-item :label="i18n('common.unit')">
                <my-history-select v-model="panel.pageUnit"
                                   @change="selectPageUnit"
                                   class="width-160"
                                   :data-list="pageUnitList"
                                   :historyLabel="i18n('common.unit')" />
            </my-form-item>
            
            <my-form-item :label="i18n('common.font.size.unit')">
                <my-history-select v-model="panel.fontSizeUnit"
                                   class="width-160"
                                   :data-list="fontSizeUnitList"
                                   :historyLabel="i18n('common.font.size.unit')" />
            </my-form-item>
            
            <my-form-item :label="i18n('common.paper')">
                <my-history-select v-model="panel.pageSize"
                                   class="width-160"
                                   @change="selectPageSize"
                                   :data-list="pageSizeList"
                                   :historyLabel="i18n('common.paper')" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.width&height')">
                <my-group>
                    <my-history-input-number class="width-66" v-model="panel.width"
                                             @change="changePanelWidth"
                                             :historyLabel="i18n('handle.page.width')" />
                    <my-history-input-number class="width-66" v-model="panel.height"
                                             @change="changePanelHeight"
                                             :disabled="panel.pageSize == 'AutoHeight'"
                                             :historyLabel="i18n('handle.page.height')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <!--    <style-icon tips="水印" v-model="panel.watermark" enable>-->
            <!--      <i class="iconfont-color icon-color-watermark my-watermark"/>-->
            <!--    </style-icon>-->
            <!--    <el-form-item label="水印">-->
            <!--      <el-switch-->
            <!--          v-model="panel.watermark"-->
            <!--          class="ml-2"-->
            <!--          inline-prompt-->
            <!--          style="&#45;&#45;el-switch-on-color: var(&#45;&#45;drag-h-color); &#45;&#45;el-switch-off-color: var(&#45;&#45;switch-off-color)"-->
            <!--          active-text="开启"-->
            <!--          inactive-text="关闭"/>-->
            <!--    </el-form-item>-->
            
            <my-form-item :label="i18n('handle.watermark')" v-if="panel.watermark">
                <my-history-input v-model="panel.watermarkContent"
                                  :placeholder="i18n('handle.watermark')"
                                  size="small"
                                  :historyLabel="i18n('handle.watermark')"
                                  style="margin-right: 20px" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.drag.snap.panel')">
                <my-switch
                    v-model="panel.dragSnapPanelIs"
                    class="ml-2" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.drag.snap')">
                <my-switch v-model="panel.dragSnapIs"
                           class="ml-2" />
            </my-form-item>
        </my-divider-panel>
    
    </my-form>

</template>
<script setup lang="ts">
import { i18n } from '@myprint/design/locales';

import { fontSizeUnitList, pageSizeList, pageUnitList } from '@myprint/design/constants/common';
import { MyHistoryInput, MyHistoryInputNumber, MyHistorySelect, MyUnit } from '@myprint/design/components/my/input';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { changePageSize, changePageUnit, getCurrentPanel } from '@myprint/design/utils/elementUtil';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';
const panel = getCurrentPanel()
function selectPageSize(val: any) {
    for (let valueElement of pageSizeList) {
        if (valueElement.value == val) {
            changePageSize(valueElement);
            break;
        }
    }
}

function changePanelWidth(_val: number) {
    changePageSize();
    // console.log(val)
}

function changePanelHeight(_val: number) {
    changePageSize();
    // console.log(val)
}

function selectPageUnit() {
    // console.log(123)
    changePageUnit();
    
    // for (let valueElement of pageSizeList) {
    //   if (valueElement.value == val) {
    //     panel.width = valueElement.width
    //     panel.height = valueElement.height
    //     panel.pageSize = valueElement.value
    //     break
    //   }
    // }
}
</script>
