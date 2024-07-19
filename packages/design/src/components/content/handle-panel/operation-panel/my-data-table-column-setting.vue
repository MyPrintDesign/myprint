<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        <my-divider-panel>
            <template #divider>
                列
            </template>
            <my-form-item label="内容" v-if="getElementSetting(multipleElementGetValue('type')).includes('data')">
                <my-history-input style="margin-right: 20px"
                                  historyLabel="内容"
                                  :model-value="multipleElementGetValue('data')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('data', val)"
                                  type="textarea" />
            </my-form-item>
        </my-divider-panel>
        
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                布局
            </template>
            
            <my-form-item label="宽/高" v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('width')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                             historyLabel="尺寸" />
                    <my-history-input-number class="width-60"
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
            <my-form-item label="打印类型" prop="region"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('contentType')">
                <my-history-select :model-value="multipleElementGetValue('contentType')"
                                   class="width-140"
                                   @update:model-value="(val:any)=>multipleElementSetValue('contentType', val)"
                                   placeholder="Activity zone"
                                   :data-list="textContentTypes"
                                   historyLabel="打印类型" />
            </my-form-item>
            <my-form-item label="条码编码" prop="region" v-if="multipleElementGetValue('contentType') == 'Barcode'">
                <my-history-select class="width-120"
                                   :model-value="multipleElementGetValue('barCodeType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('barCodeType', val)"
                                   placeholder="条码类型"
                                   :data-list="barcodeTypes"
                                   historyLabel="条码类型" />
                <my-tooltip
                    popper-class="barcode-type-tooltip"
                    effect="dark"
                    :max-width="200"
                    placement="top"
                >
                    <my-icon style="margin-left: 5px" :size="14">
                        <QuestionFilled />
                    </my-icon>
                </my-tooltip>
            </my-form-item>
            
            <my-form-item label="换行"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('lineBreak')">
                <my-switch
                    :model-value="multipleElementGetValue('option.lineBreak')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.lineBreak', val)"
                    class="ml-2"
                    inline-prompt
                    active-text="是"
                    inactive-text="否" />
            </my-form-item>
            
            <!--        <el-form-item label="行高" v-if="getElementSetting(multipleElementGetValue('type')).includes('lineHeight')">-->
            <!--            <my-group>-->
            <!--                <my-history-input-number class="num-2"-->
            <!--                                         :min="0.01"-->
            <!--                                         :model-value="multipleElementGetValue('option.lineHeight')"-->
            <!--                                         @update:model-value="(val:any)=>multipleElementSetValue('option.lineHeight', val)"-->
            <!--                                         historyLabel="行高" />-->
            <!--                <my-unit />-->
            <!--            </my-group>-->
            <!--        </el-form-item>-->
            
            <my-form-item label="虚线样式" prop="region"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
                <my-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                                   :data-list="dottedStyleList"
                                   placeholder="Activity zone"
                                   historyLabel="虚线样式" />
            </my-form-item>
            
            <my-form-item label="统计方式" prop="statistics"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-history-select :model-value="multipleElementGetValue('statisticsType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('statisticsType', val)"
                                   @change="changeStatistics"
                                   placeholder="Activity zone"
                                   :data-list="statisticsTypeList"
                                   historyLabel="统计方式" />
            </my-form-item>
            
            <my-form-item label="每页统计"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-switch
                    :model-value="multipleElementGetValue('everyPageStatisticsIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('everyPageStatisticsIs', val)"
                    class="ml-2"
                    inline-prompt
                    active-text="显示"
                    inactive-text="隐藏" />
            </my-form-item>
            <my-form-item label="整表统计"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-switch
                    :model-value="multipleElementGetValue('tableStatisticsIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('tableStatisticsIs', val)"
                    class="ml-2"
                    inline-prompt
                    active-text="显示"
                    inactive-text="隐藏" />
            </my-form-item>
        </my-divider-panel>
    </my-form>

</template>
<script setup lang="ts">
import {
    barcodeTypes,
    dottedStyleList,
    getElementSetting,
    statisticsTypeList,
    textContentTypes
} from '@myprint/design/constants/common';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { MyHistoryInput, MyHistoryInputNumber, MyHistorySelect, MyUnit } from '@myprint/design/components/my/input';
import { multipleElementGetValue, multipleElementSetValue } from '@myprint/design/utils/elementUtil';
import { computed } from 'vue-demi';
import { MyElement, statisticsType, statisticsTypeFormat } from '@myprint/design/types/entity';
import { useAppStoreHook } from '@myprint/design/stores/app';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyTooltip from '@myprint/design/components/my/tooltip/my-tooltip.vue';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';
import MySlider from '@myprint/design/components/my/slider/my-slider.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import QuestionFilled from '@myprint/design/components/my/icon/icons/QuestionFilled.vue';
//
// const mitt = inject(mittKey)!
// // const data = reactive({
// //   currentBarCodeEg: null
// // })
// const appStore = useAppStoreHook()
//
const appStore = useAppStoreHook();

const element = computed(() => {
    if (appStore.currentElement.length > 0) {
        return appStore.currentElement[0] as MyElement;
    } else {
        return {} as MyElement;
    }
});

function changeStatistics() {
    const statisticsType = multipleElementGetValue('statisticsType') as statisticsType;
    multipleElementSetValue('data', statisticsTypeFormat[statisticsType]);
}

</script>
