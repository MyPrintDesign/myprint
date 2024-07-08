<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                布局
                <my-icon class="divider-setting-layout-lock iconfont"
                         :model-value="multipleElementGetValue('lock')"
                         :class="[multipleElementGetValue('lock')? 'icon-lock': 'icon-unlock']"
                         @click="changeLock"
                         @update:model-value="(val:any)=>multipleElementSetValue('lock', val)" />
            </template>
            
            <my-form-item label="高度属性">
                <my-radio v-model="table.option.tableHeightType"
                          :dataList="tableBodyHeightTypeList"
                          size="small" />
            </my-form-item>
            
            <my-form-item label="坐标(x/y)">
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
            </my-form-item>
            
            <my-form-item label="宽/高" v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
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
            </my-form-item>
            
            <my-form-item label="不透明度"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('opacity')">
                <my-slider class="width-120"
                           :model-value="multipleElementGetValue('option.opacity')"
                           @update:model-value="(val:any)=>multipleElementSetValue('option.opacity', val)"
                           :max="1" :min="0" :step="0.01"
                           :show-tooltip="false" size="small"
                           historyLabel="不透明度" />
                <div style="margin-left: 20px">{{ multipleElementGetValue('option.opacity') }}</div>
            </my-form-item>
        </my-divider-panel>
        
        
        <my-divider-panel>
            <template #divider>
                属性
            </template>
            <my-form-item label="行高">
                <my-radio v-model="table.option.tableBodyHeightType"
                          :dataList="tableBodyHeightTypeList"
                          size="small" />
                
                <my-group style="margin-top: 10px"
                          v-if="table.option.tableBodyHeightType == 'FIXED'">
                    
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.tableBodyHeight')"
                                             @change="changeTableBodyHeight"
                                             historyLabel="行高" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            
            <my-form-item label="分页表头">
                <my-switch
                    :model-value="multipleElementGetValue('option.tablePageHeadIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.tablePageHeadIs', val)"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                    active-text="是"
                    inactive-text="否" />
            </my-form-item>
        
        </my-divider-panel>
        
        <my-button size="small" @click="handleAddStatisticsRow">新增统计行</my-button>
        
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
    
    </my-form>

</template>
<script setup lang="ts">
import { inject } from 'vue';

import { getElementSetting, tableBodyHeightTypeList } from '@myprint/design/constants/common';
import { mittKey } from '@myprint/design/constants/keys';
import { ActionEnum, Snapshot } from '@myprint/design/utils/historyUtil';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { MyHistoryInputNumber, MyUnit } from '@myprint/design/components/my/input';
import { useAppStoreHook } from '@myprint/design/stores/app';
import {
    multipleElementGetValue,
    multipleElementSetValue,
    setElementHeightPx
} from '@myprint/design/utils/elementUtil';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import { freshMoveableOption } from '@myprint/design/plugins/moveable/moveable';
import { addStatisticsRow } from '@myprint/design/utils/table/dataTable';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';
import MySlider from '@myprint/design/components/my/slider/my-slider.vue';
import MyRadio from '@myprint/design/components/my/radio/my-radio.vue';

const mitt = inject(mittKey)!;
const appStore = useAppStoreHook();

const table = appStore.currentElement[0];

function changeTableBodyHeight(val: number) {
    console.log(123);
    multipleElementSetValue('option.tableBodyHeight', val);
    for (let tableBodyListElement of table.tableBodyList) {
        for (let tableBodyListElementElement of tableBodyListElement) {
            if (tableBodyListElementElement == null) {
                continue;
            }
            setElementHeightPx(unit2px(val), tableBodyListElementElement);
        }
    }
}

function changeLock() {
    freshMoveableOption(appStore.currentElement[0]);
}

function change(_val: any) {
    mitt.emit('panelSnapshot', { action: ActionEnum.UPDATE_STYLE, elementList: appStore.currentElement } as Snapshot);
}

function handleAddStatisticsRow() {
    addStatisticsRow(appStore.currentElement[0]);
}

</script>
