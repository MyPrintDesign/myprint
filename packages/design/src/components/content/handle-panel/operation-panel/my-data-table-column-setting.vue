<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        <my-divider-panel>
            <template #divider>
                {{ i18n('handle.column') }}
            </template>
            <my-form-item :label="i18n('common.content')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('data')">
                <my-history-input style="margin-right: 20px"
                                  :historyLabel="i18n('common.content')"
                                  :model-value="multipleElementGetValue('data')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('data', val)"
                                  type="textarea" />
            </my-form-item>
        </my-divider-panel>
        
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                {{ i18n('common.layout') }}
            </template>
            
            <my-form-item :label="i18n('handle.width&height')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('width')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                             :historyLabel="i18n('handle.page.width')" />
                    <my-history-input-number class="width-60"
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
            <my-form-item :label="i18n('handle.content.type')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('contentType')">
                <my-history-select :model-value="multipleElementGetValue('contentType')"
                                   class="width-140"
                                   @update:model-value="(val:any)=>multipleElementSetValue('contentType', val)"
                                   :data-list="textContentTypes"
                                   :historyLabel="i18n('handle.content.type')" />
            </my-form-item>
            <my-form-item :label="i18n('handle.barCode.type')"
                          v-if="multipleElementGetValue('contentType') == 'Barcode'">
                <my-history-select class="width-120"
                                   :model-value="multipleElementGetValue('barCodeType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('barCodeType', val)"
                                   :data-list="barcodeTypes"
                                   :historyLabel="i18n('handle.barCode.type')" />
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
            
            <my-form-item :label="i18n('handle.line.break')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('lineBreak')">
                <my-switch
                    :model-value="multipleElementGetValue('option.lineBreak')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.lineBreak', val)"
                    class="ml-2" />
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
            
            <my-form-item :label="i18n('handle.dotted.style')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
                <my-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                                   :data-list="dottedStyleList"
                                   :historyLabel="i18n('handle.dotted.style')" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.table.statistics.type')" prop="statistics"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-history-select :model-value="multipleElementGetValue('statisticsType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('statisticsType', val)"
                                   @change="changeStatistics"
                                   :data-list="statisticsTypeList"
                                   :historyLabel="i18n('handle.table.statistics.type')" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.table.every.page.statistics')"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-switch
                    :model-value="multipleElementGetValue('everyPageStatisticsIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('everyPageStatisticsIs', val)"
                    class="ml-2"
                    :active-text="i18n('common.show')"
                    :inactive-text="i18n('common.hidden')" />
            </my-form-item>
            <my-form-item :label="i18n('handle.table.all.table.statistics')"
                          v-if="multipleElementGetValue('runtimeOption.cellType') == 'Statistics'">
                <my-switch
                    :model-value="multipleElementGetValue('tableStatisticsIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('tableStatisticsIs', val)"
                    class="ml-2"
                    :active-text="i18n('common.show')"
                    :inactive-text="i18n('common.hidden')" />
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
import { i18n } from '@myprint/design/locales';
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
