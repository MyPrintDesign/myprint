<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        <my-divider-panel>
            <template #divider>
                {{ i18n('common.basics') }}
            </template>
            
            <!--    <my-button class="my-element-setting-choose-img" v-if="multipleElementGetValue('type') == 'Image'">-->
            <!--      更换图片-->
            <!--    </my-button>-->
            
            <!--    <el-form-item label="标题显示" v-if="getElementSetting(multipleElementGetValue('type')).includes('label')">-->
            <!--      <el-switch-->
            <!--          :model-value="multipleElementGetValue('option.hiddenLabel')"-->
            <!--          @update:model-value="(val:any)=>multipleElementSetValue('option.hiddenLabel', val)"-->
            <!--          class="ml-2"-->
            <!--          inline-prompt-->
            <!--          style="&#45;&#45;el-switch-on-color: var(&#45;&#45;drag-h-color); &#45;&#45;el-switch-off-color: var(&#45;&#45;switch-off-color)"-->
            <!--          active-text="显示"-->
            <!--          inactive-text="隐藏"/>-->
            <!--&lt;!&ndash;            <el-switch v-if="appStore.currentElement.option.hiddenLabel"&ndash;&gt;-->
            <!--&lt;!&ndash;                       v-model="appStore.currentElement.option.labelSplit"&ndash;&gt;-->
            <!--&lt;!&ndash;                       class="ml-2"&ndash;&gt;-->
            <!--&lt;!&ndash;                       inline-prompt&ndash;&gt;-->
            <!--&lt;!&ndash;                       style="&#45;&#45;el-switch-on-color: var(&#45;&#45;drag-h-color); &#45;&#45;el-switch-off-color: gray; margin-left: 10px"&ndash;&gt;-->
            <!--&lt;!&ndash;                       active-text="拆分"&ndash;&gt;-->
            <!--&lt;!&ndash;                       inactive-text="合并"/>&ndash;&gt;-->
            <!--    </el-form-item>-->
            
            <!--    <el-form-item label="标题" v-if="getElementSetting(multipleElementGetValue('type')).includes('label')">-->
            <!--      <my-history-input style="margin-right: 20px"-->
            <!--                        :model-value="multipleElementGetValue('label')"-->
            <!--                        @update:model-value="(val:any)=>multipleElementSetValue('label', val)"-->
            <!--                        historyLabel="标题"/>-->
            <!--    </el-form-item>-->
            <my-form-item :label="i18n('common.content')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('data')">
                <my-history-input style="margin-right: 20px"
                                  :historyLabel="i18n('common.content')"
                                  :model-value="multipleElementGetValue('data')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('data', val)"
                                  type="textarea" />
            </my-form-item>
            <my-form-item :label="i18n('handle.formatter')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('formatter')">
                <my-history-input style="margin-right: 20px"
                                  :model-value="multipleElementGetValue('option.formatter')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('option.formatter', val)"
                                  type="textarea"
                                  :historyLabel="i18n('handle.formatter')" />
            </my-form-item>
        </my-divider-panel>
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                {{ i18n('common.layout') }}
                <tip-icon class="divider-setting-layout-lock iconfont"
                          placement="top"
                          :tips="i18n('handle.lock.edit')"
                          :size="14"
                          padding="11px"
                          :model-value="multipleElementGetValue('lock')"
                          :class="[multipleElementGetValue('lock')? 'icon-lock': 'icon-unlock']"
                          @click="changeLock"
                          @update:model-value="(val:any)=>multipleElementSetValue('lock', val)" />
            </template>
            
            <my-form-item :label="i18n('common.xy')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('x')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('x')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('x', val)"
                                             @change="changeLocationX"
                                             :historyLabel="i18n('common.position')" />
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('y')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('y', val)"
                                             @change="changeLocationY"
                                             :historyLabel="i18n('common.position')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.width&height')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('width')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                             @change="changeElementWidth"
                                             :historyLabel="i18n('handle.page.width')" />
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('height')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('height', val)"
                                             @change="changeElementWidth"
                                             :historyLabel="i18n('handle.page.height')" />
                    <my-unit />
                    <my-icon class="setting-wh-lock iconfont"
                             :size="16"
                             padding="11px"
                             :class="[multipleElementGetValue('option.keepRatio')? 'icon-wh-lock': 'icon-wh-unlock']"
                             :model-value="multipleElementGetValue('option.keepRatio')"
                             @update:model-value="(val:any)=>multipleElementSetValue('option.keepRatio', val)"
                             @click="changeElementKeepRatio" />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.border.radius')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('borderRadius')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('option.borderRadius')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.borderRadius', val)"
                                             :historyLabel="i18n('handle.border.radius')" />
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
            <my-form-item :label="i18n('handle.rotate')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('rotate')">
                <my-slider class="width-120"
                           :model-value="multipleElementGetValue('option.rotate')"
                           @update:model-value="(val:any)=>multipleElementSetValue('option.rotate', val)"
                           :max="359" :min="0" :step="1"
                           @change="rotatedPoint(appStore.currentElement)"
                           :show-tooltip="false" size="small" />
                <div style="margin-left: 20px">{{ multipleElementGetValue('option.rotate') }}</div>
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
                                   :model-value="multipleElementGetValue('option.barCodeType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.barCodeType', val)"
                                   :data-list="barcodeTypes"
                                   :historyLabel="i18n('handle.barCode.type')" />
                <!--popper-class="barcode-type-tooltip"-->
                <!--
                                    :max-width="200"
                -->
                <my-tooltip
                    :content="currentBarCodeEg"
                    placement="top">
                    <my-icon>
                        <QuestionFilled />
                    </my-icon>
                </my-tooltip>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.barCode.value')"
                          v-if="multipleElementGetValue('contentType') == 'Barcode'">
                <my-switch
                    :model-value="multipleElementGetValue('option.barCodeDisplayValIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.barCodeDisplayValIs', val)"
                    class="ml-2"
                    :active-text="i18n('common.show')"
                    :inactive-text="i18n('common.hidden')" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.line.break')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('lineBreak')">
                <my-switch
                    :model-value="multipleElementGetValue('option.lineBreak')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.lineBreak', val)"
                    class="ml-2" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.text.auto.height')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('autoTextHeight')">
                <my-switch
                    :model-value="multipleElementGetValue('option.autoTextHeight')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.autoTextHeight', val)"
                    class="ml-2" />
            </my-form-item>
            
            <my-form-item :label="i18n('handle.line.height')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('lineHeight')">
                <my-group>
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.lineHeight')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.lineHeight', val)"
                                             :historyLabel="i18n('handle.line.height')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            <my-form-item :label="i18n('handle.line.width')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('lineWidth')">
                <my-group>
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.lineWidth')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.lineWidth', val)"
                                             :historyLabel="i18n('handle.line.width')" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.dotted.style')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
                <my-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                                   class="width-120"
                                   :data-list="dottedStyleList"
                                   :historyLabel="i18n('handle.dotted.style')" />
            </my-form-item>
            <my-form-item :label="i18n('handle.padding')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('padding')">
                <my-group>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.top')"
                                             :historyLabel="i18n('handle.padding.top')"
                                             :model-value="multipleElementGetValue('option.padding.top')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.top', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.bottom')"
                                             :historyLabel="i18n('handle.padding.bottom')"
                                             :model-value="multipleElementGetValue('option.padding.bottom')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.bottom', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.left')"
                                             :historyLabel="i18n('handle.padding.left')"
                                             :model-value="multipleElementGetValue('option.padding.left')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.left', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.right')"
                                             :historyLabel="i18n('handle.padding.right')"
                                             :model-value="multipleElementGetValue('option.padding.right')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.right', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.margin')"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('margin')">
                <my-group>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.top')"
                                             :historyLabel="i18n('handle.margin.top')"
                                             :model-value="multipleElementGetValue('option.margin.top')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.top', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.bottom')"
                                             :historyLabel="i18n('handle.margin.bottom')"
                                             :model-value="multipleElementGetValue('option.margin.bottom')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.bottom', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.left')"
                                             :historyLabel="i18n('handle.margin.left')"
                                             :model-value="multipleElementGetValue('option.margin.left')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.left', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             :placeholder="i18n('handle.right')"
                                             :historyLabel="i18n('handle.margin.right')"
                                             :model-value="multipleElementGetValue('option.margin.right')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.right', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                </my-group>
            </my-form-item>
            
            <my-form-item :label="i18n('handle.fixed.position')">
                <my-switch
                    :model-value="multipleElementGetValue('option.fixed')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.fixed', val)"
                    @change="changeOptionFixed"
                    class="ml-2" />
            </my-form-item>
            
            <my-button size="small"
                       v-if="getElementSetting(multipleElementGetValue('type')).includes('clearDrawPanel')"
                       @click="clearDrawPanel">{{ i18n('handle.clear.canvas') }}
            </my-button>
        
        </my-divider-panel>
        
        <my-divider-panel>
            <template #divider>
                {{ i18n('handle.print.strategy') }}
            </template>
            
            <my-form-item :label="i18n('handle.display.strategy')"
                          v-if="multipleElementGetValue('option.fixed') == true">
                <my-history-select :model-value="multipleElementGetValue('option.displayStrategy')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.displayStrategy', val)"
                                   class="width-120"
                                   :data-list="displayStrategyList"
                                   :historyLabel="i18n('handle.display.strategy')" />
            </my-form-item>
        
        </my-divider-panel>
    
    </my-form>

</template>
<script setup lang="ts">
import { computed } from 'vue-demi';

import {
    barcodeTypes,
    displayStrategyList,
    dottedStyleList,
    getElementSetting,
    textContentTypes
} from '@myprint/design/constants/common';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { MyHistoryInput, MyHistoryInputNumber, MyHistorySelect, MyUnit } from '@myprint/design/components/my/input';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import {
    addCanSelectElement,
    freshMoveableOption,
    moveableMoveX,
    moveableMoveY,
    moveableResize,
    moveableRotate,
    removeCanSelectElement
} from '@myprint/design/plugins/moveable/moveable';
import { MyElement } from '@myprint/design/types/entity';
import {
    getPositionX,
    getPositionY,
    multipleElementGetValue,
    multipleElementSetValue
} from '@myprint/design/utils/elementUtil';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import TipIcon from '@myprint/design/components/my/icon/tip-icon.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyTooltip from '@myprint/design/components/my/tooltip/my-tooltip.vue';
import QuestionFilled from '@myprint/design/components/my/icon/icons/QuestionFilled.vue';
import MySlider from '@myprint/design/components/my/slider/my-slider.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';
import { i18n } from '@myprint/design/locales';
import { mitt } from '@myprint/design/utils/utils';

const appStore = useAppStoreHook();


const currentBarCodeEg = computed(() => {
    if (element.value.option && element.value.option.barCodeType) {
        return changeBarCodeType(element.value.option.barCodeType);
    }
});

const element = computed(() => {
    if (appStore.currentElement.length > 0) {
        return appStore.currentElement[0] as MyElement;
    } else {
        return {} as MyElement;
    }
});

function changeOptionFixed() {
    mitt.emit('changeElement');
}

function changeLock() {
    if (element.value.lock) {
        removeCanSelectElement(element.value);
    } else {
        addCanSelectElement(element.value);
    }
    freshMoveableOption(element.value);
}

function rotatedPoint(_rotate: any) {
    // console.log(rotate);
    moveableRotate(element.value.option.rotate);
    // freshMoveableOption(appStore.currentElement)
}

function changeLocationX(_val: any) {
    moveableMoveX(unit2px(getPositionX(element.value)));
}

function changeLocationY(_val: any) {
    moveableMoveY(unit2px(getPositionY(element.value)));
}

function changeElementWidth(_val) {
    // console.log(_val);
    moveableResize(unit2px(element.value.width), unit2px(element.value.height), element.value.option.keepRatio);
}

function changeElementKeepRatio() {
    // console.log(val)
    freshMoveableOption(element.value);
}

function clearDrawPanel() {
    element.value.data = JSON.stringify([]);
}

function changeBarCodeType(val: any) {
    // record()
    // console.log('change', val)
    return barcodeTypes.find(v => v.value == val)!.eg;
}
</script>
