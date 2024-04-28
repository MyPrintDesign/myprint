<template>
    <el-form label-width="80px" size="small"
             label-position="right">
        
        <el-divider class="divider-setting-layout">
            布局
            <my-icon class="divider-setting-layout-lock iconfont"
                     :model-value="multipleElementGetValue('lock')"
                     :class="[multipleElementGetValue('lock')? 'icon-lock': 'icon-unlock']"
                     @click="changeLock"
                     @update:model-value="(val:any)=>multipleElementSetValue('lock', val)" />
        </el-divider>
        
        <el-form-item label="高度属性">
            <el-radio-group v-model="table.option.tableHeightType" size="small">
                <el-radio-button label="AUTO" value="AUTO">自动高度</el-radio-button>
                <el-radio-button label="FIXED" value="FIXED">固定高度</el-radio-button>
            </el-radio-group>
        </el-form-item>
        
        <el-form-item label="坐标(x/y)">
            <my-group>
                <my-history-input-number class="width-60"
                                         :model-value="multipleElementGetValue('x')"
                                         @update:model-value="(val:any)=>multipleElementSetValue('x', val)"
                                         @change="change"
                                         historyLabel="位置" />
                <my-history-input-number class="width-60"
                                         :model-value="multipleElementGetValue('y')"
                                         @update:model-value="(val:any)=>multipleElementSetValue('y', val)"
                                         historyLabel="位置" />
                <my-unit />
            </my-group>
        </el-form-item>
        
        <el-form-item label="宽/高" v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
            <my-group>
                <my-history-input-number class="width-60"
                                         :model-value="multipleElementGetValue('width')"
                                         @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                         historyLabel="尺寸" />
                <my-history-input-number class="width-60"
                                         :disabled="table.option.tableHeightType == 'AUTO'"
                                         :model-value="multipleElementGetValue('height')"
                                         @update:model-value="(val:any)=>multipleElementSetValue('height', val)"
                                         historyLabel="尺寸" />
                <my-unit />
            </my-group>
        </el-form-item>
        
        <el-form-item label="不透明度" v-if="getElementSetting(multipleElementGetValue('type')).includes('opacity')">
            <el-slider class="width-120"
                       :model-value="multipleElementGetValue('option.opacity')"
                       @update:model-value="(val:any)=>multipleElementSetValue('option.opacity', val)"
                       :max="1" :min="0" :step="0.01"
                       :show-tooltip="false" size="small"
                       historyLabel="不透明度" />
            <div style="margin-left: 20px">{{ multipleElementGetValue('option.opacity') }}</div>
        </el-form-item>
        
        <el-divider>
            属性
        </el-divider>
        
        <!--    errorCorrectionLevel-->
        <!--      <el-form-item label="换行策略" prop="region">-->
        <!--      <my-history-select v-model="form.region" placeholder="Activity zone">-->
        <!--        <el-option label="Zone one" value="shanghai"/>-->
        <!--      </my-history-select>-->
        <!--      </el-form-item>-->
        
        <el-form-item label="行高" v-if="getElementSetting(multipleElementGetValue('type')).includes('lineHeight')">
            <my-group>
                <my-history-input-number class="num-2"
                                         :min="0.01"
                                         :model-value="multipleElementGetValue('option.lineHeight')"
                                         @update:model-value="(val:any)=>multipleElementSetValue('option.lineHeight', val)"
                                         historyLabel="行高" />
                <my-unit />
            </my-group>
        </el-form-item>
        
        <el-form-item label="虚线样式" prop="region"
                      v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
            <my-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                               @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                               placeholder="Activity zone"
                               historyLabel="虚线样式">
                <el-option v-for="(item, index) in dottedStyleList" :key="index" :label="item.label"
                           :value="item.value" />
            </my-history-select>
        </el-form-item>
        
        <el-form-item label="分页表头">
            <el-switch
                :model-value="multipleElementGetValue('tablePageHeadIs')"
                @update:model-value="(val:any)=>multipleElementSetValue('tablePageHeadIs', val)"
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                active-text="是"
                inactive-text="否" />
        </el-form-item>
        
        <el-button @click="handleAddStatisticsRow">新增统计行</el-button>
        
<!--        <el-divider>-->
<!--            背景样式-->
<!--        </el-divider>-->
<!--        -->
<!--        <el-radio-group v-model="table.option.tableBodyBgStyleType" size="small">-->
<!--            <el-radio-button label="NONE" value="NONE">无</el-radio-button>-->
<!--            <el-radio-button label="COMMON" value="COMMON">通用样式</el-radio-button>-->
<!--            <el-radio-button label="CUSTOM" value="CUSTOM" disabled>自定义样式</el-radio-button>-->
<!--        </el-radio-group>-->
<!--        -->
<!--        <div v-if="multipleElementGetValue('option.tableBodyBgStyleType') == 'COMMON'">-->
<!--            123-->
<!--        </div>-->
        
        <!--        <el-form-item label="分页表头">-->
        <!--            <el-switch-->
        <!--                :model-value="multipleElementGetValue('tablePageHeadIs')"-->
        <!--                @update:model-value="(val:any)=>multipleElementSetValue('tablePageHeadIs', val)"-->
        <!--                class="ml-2"-->
        <!--                inline-prompt-->
        <!--                style="&#45;&#45;el-switch-on-color: var(&#45;&#45;drag-h-color); &#45;&#45;el-switch-off-color: var(&#45;&#45;switch-off-color)"-->
        <!--                active-text="是"-->
        <!--                inactive-text="否" />-->
        <!--        </el-form-item>-->
    
    
    </el-form>

</template>
<script setup lang="ts">
// import { ElForm, ElFormItem, ElDivider, ElSwitch, ElTooltip } from 'element-plus'
import { inject } from 'vue';

import { dottedStyleList, getElementSetting } from '@myprint/design/constants/common';
import { mittKey } from '@myprint/design/constants/keys';
import { ActionEnum, Snapshot } from '@myprint/design/utils/historyUtil';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { MyHistoryInputNumber, MyHistorySelect, MyUnit } from '@myprint/design/components/my/input';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { multipleElementGetValue, multipleElementSetValue } from '@myprint/design/utils/elementUtil';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import { freshMoveableOption } from '@myprint/design/plugins/moveable/moveable';
import { addStatisticsRow } from '@myprint/design/utils/table/dataTable';

const mitt = inject(mittKey)!;
// const data = reactive({
//   currentBarCodeEg: null
// })
const appStore = useAppStoreHook();

const table = appStore.currentElement[0];

function rotatedPoint(rotate) {
    console.log(rotate);
    // freshMoveableOption(appStore.currentElement)
}

function changeLock() {
    freshMoveableOption(appStore.currentElement[0]);
}

function change(_val: any) {
    // record()
    mitt.emit('panelSnapshot', { action: ActionEnum.UPDATE_STYLE, elementList: appStore.currentElement } as Snapshot);
    // console.log('change', val)
}

function handleAddStatisticsRow() {
    addStatisticsRow(appStore.currentElement[0]);
}

</script>
