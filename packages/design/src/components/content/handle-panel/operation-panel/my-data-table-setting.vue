<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                {{ i18n('common.layout') }}
                <my-icon class="divider-setting-layout-lock iconfont"
                         :size="14"
                         :model-value="multipleElementGetValue('lock')"
                         padding="11px"
                         :class="[multipleElementGetValue('lock')? 'icon-lock': 'icon-unlock']"
                         @click="changeLock"
                         @update:model-value="(val:any)=>multipleElementSetValue('lock', val)" />
            </template>
            
            <my-form-item :label="i18n('handle.height.attr')">
                <my-radio v-model="table.option.tableHeightType"
                          :dataList="tableBodyHeightTypeList" />
            </my-form-item>
            
            <my-form-item :label="i18n('common.xy')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('x')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('x', val)"
                                             @change="change"
                                             :historyLabel="i18n('common.position')" />
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('y')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('y', val)"
                                             :historyLabel="i18n('common.position')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.width&height')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('width')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                             :historyLabel="i18n('handle.page.width')" />
                    <my-history-input-number class="width-60"
                                             :disabled="table.option.tableHeightType == 'AUTO'"
                                             :model-value="multipleElementGetValue('height')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('height', val)"
                                             :historyLabel="i18n('handle.page.height')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.opacity')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('opacity')">
                <my-slider class="width-120"
                           :model-value="multipleElementGetValue('option.opacity')"
                           @update:model-value="(val:any)=>multipleElementSetValue('option.opacity', val)"
                           :max="1" :min="0" :step="0.01"
                           :show-tooltip="false" size="small"
                           :historyLabel="i18n('handle.opacity')" />
                <div style="margin-left: 20px">{{ multipleElementGetValue('option.opacity') }}</div>
            </my-form-item>
        </my-divider-panel>
        
        <my-divider-panel>
            <template #divider>
                {{ i18n('common.attr') }}
            </template>
            <my-form-item :label="i18n('handle.line.height')">
                <my-radio v-model="table.option.tableBodyHeightType"
                          :dataList="tableBodyHeightTypeList" />
                
                <my-group style="margin-top: 10px"
                          v-if="table.option.tableBodyHeightType == 'FIXED'">
                    
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.tableBodyHeight')"
                                             @change="changeTableBodyHeight"
                                             :historyLabel="i18n('handle.line.height')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.table.page.head')">
                <my-switch
                    :model-value="multipleElementGetValue('option.tablePageHeadIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.tablePageHeadIs', val)"
                    class="ml-2" />
            </my-form-item>
        
        </my-divider-panel>
        
<!--        <my-button size="small" @click="handleAddStatisticsRow">{{ i18n('handle.add.statistics.row') }}</my-button>-->
        
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
import { getElementSetting, tableBodyHeightTypeList } from '../../../../constants/common';
import { ActionEnum, Snapshot } from '../../../../utils/historyUtil';
import MyGroup from '../../../../components/my/group/my-group.vue';
import { MyHistoryInputNumber, MyUnit } from '../../../../components/my/input';
import { useAppStoreHook } from '../../../../stores/app';
import { multipleElementGetValue, multipleElementSetValue, setElementHeightPx } from '../../../../utils/elementUtil';
import MyIcon from '../../../../components/my/icon/my-icon.vue';
import { freshMoveableOption } from '../../../../plugins/moveable/moveable';
import { addStatisticsRow } from '../../../../utils/table/dataTable';
import { unit2px } from '../../../../utils/devicePixelRatio';
import MySwitch from '../../../../components/my/switch/my-switch.vue';
import MyForm from '../../../../components/my/form/my-form.vue';
import MyFormItem from '../../../../components/my/form/my-form-item.vue';
// import MyButton from '../../../../components/my/button/my-Button.vue';
import MyDividerPanel from '../../../../components/my/divider/my-divider-panel.vue';
import MySlider from '../../../../components/my/slider/my-slider.vue';
import MyRadio from '../../../../components/my/radio/my-radio.vue';
import { i18n } from '../../../../locales';
import { mitt } from '../../../../utils/utils';

const appStore = useAppStoreHook();

const table = appStore.currentElement[0];

function changeTableBodyHeight(val: number) {
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
