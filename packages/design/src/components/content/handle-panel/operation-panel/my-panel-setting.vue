<template>
    <my-form class="my-form" label-width="80px" size="small"
             label-position="right">
        
        <my-divider-panel>
            <template #divider>
                面板
            </template>
            
            <my-form-item label="模版名称">
                <my-history-input v-model="panel.name"
                                  type="textarea"
                                  :placeholder="i18n('common.width')"
                                  size="small"
                                  historyLabel="模版名称"
                                  style="margin-right: 20px" />
            </my-form-item>
            
            <my-form-item label="单位" prop="region">
                <my-history-select v-model="panel.pageUnit"
                                   @change="selectPageUnit"
                                   class="width-140"
                                   placeholder="Select"
                                   size="small"
                                   :data-list="pageUnitList"
                                   historyLabel="单位" />
            </my-form-item>
            
            <my-form-item label="纸张" prop="region">
                <my-history-select v-model="panel.pageSize" class="width-140" placeholder="Select" size="small"
                                   @change="selectPageSize"
                                   :data-list="pageSizeList"
                                   historyLabel="纸张"/>
            </my-form-item>
            
            <my-form-item label="宽/高">
                <my-group>
                    <my-history-input-number class="width-60" v-model="panel.width"
                                             @change="changePanelWidth"
                                             historyLabel="纸张宽" />
                    <my-history-input-number class="width-60" v-model="panel.height"
                                             @change="changePanelHeight"
                                             historyLabel="纸张高" />
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
            
            <my-form-item label="水印内容" v-if="panel.watermark">
                <my-history-input v-model="panel.watermarkContent"
                                  :placeholder="i18n('common.width')"
                                  size="small"
                                  historyLabel="水印内容"
                                  style="margin-right: 20px" />
            </my-form-item>
            
            <my-form-item label="边界限制">
                <my-switch
                    v-model="panel.dragSnapPanelIs"
                    class="ml-2"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                    active-text="开"
                    inactive-text="关" />
            </my-form-item>
            
            <my-form-item label="拖动磁吸">
                <my-switch
                    v-model="panel.dragSnapIs"
                    class="ml-2"
                    inline-prompt
                    :active-value="1"
                    :inactive-value="0"
                    style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                    active-text="开"
                    inactive-text="关" />
            </my-form-item>
        </my-divider-panel>
        
    
    
    </my-form>

</template>
<script setup lang="ts">
import { inject } from 'vue';
import { i18n } from '@myprint/design/locales';

import { pageSizeList, pageUnitList } from '@myprint/design/constants/common';
import { panelKey } from '@myprint/design/constants/keys';
import { MyHistoryInput, MyHistoryInputNumber, MyHistorySelect, MyUnit } from '@myprint/design/components/my/input';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { changePageSize, changePageUnit } from '@myprint/design/utils/elementUtil';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';

const panel = inject(panelKey)!;

function selectPageSize(val: any) {
    console.log(123)
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
