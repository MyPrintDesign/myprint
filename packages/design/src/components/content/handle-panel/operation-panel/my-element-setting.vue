<template>
    <my-form label-width="80px" size="small"
             label-position="right">
        <my-divider-panel>
            <template #divider>
                基础
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
            <my-form-item label="内容" v-if="getElementSetting(multipleElementGetValue('type')).includes('data')">
                <my-history-input style="margin-right: 20px"
                                  historyLabel="内容"
                                  :model-value="multipleElementGetValue('data')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('data', val)"
                                  type="textarea" />
            </my-form-item>
            <my-form-item label="格式化器"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('formatter')">
                <my-history-input style="margin-right: 20px"
                                  :model-value="multipleElementGetValue('option.formatter')"
                                  @update:model-value="(val:any)=>multipleElementSetValue('option.formatter', val)"
                                  type="textarea"
                                  historyLabel="格式化器" />
            </my-form-item>
        </my-divider-panel>
        
        <my-divider-panel class="divider-setting-layout">
            <template #divider>
                布局
                <tip-icon class="divider-setting-layout-lock iconfont"
                          placement="top"
                          tips="锁定编辑"
                          :size="14"
                          padding="11px"
                          :model-value="multipleElementGetValue('lock')"
                          :class="[multipleElementGetValue('lock')? 'icon-lock': 'icon-unlock']"
                          @click="changeLock"
                          @update:model-value="(val:any)=>multipleElementSetValue('lock', val)" />
            </template>
            
            <my-form-item label="坐标(x/y)" v-if="getElementSetting(multipleElementGetValue('type')).includes('x')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('x')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('x', val)"
                                             @change="changeLocationX"
                                             historyLabel="位置" />
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('y')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('y', val)"
                                             @change="changeLocationY"
                                             historyLabel="位置" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item label="宽/高" v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('width')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                             @change="changeElementWidth"
                                             historyLabel="尺寸" />
                    <my-history-input-number class="width-60"
                                             :disabled="multipleElementGetValue('lock')"
                                             :model-value="multipleElementGetValue('height')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('height', val)"
                                             @change="changeElementWidth"
                                             historyLabel="尺寸" />
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
            
            <my-form-item label="圆角边框"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('borderRadius')">
                <my-group>
                    <my-history-input-number class="width-60"
                                             :model-value="multipleElementGetValue('option.borderRadius')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.borderRadius', val)"
                                             historyLabel="圆角" />
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
            <my-form-item label="旋转角度" v-if="getElementSetting(multipleElementGetValue('type')).includes('rotate')">
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
                                   :model-value="multipleElementGetValue('option.barCodeType')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.barCodeType', val)"
                                   placeholder="条码类型"
                                   :data-list="barcodeTypes"
                                   historyLabel="条码类型" />
                <my-tooltip
                    popper-class="barcode-type-tooltip"
                    effect="dark"
                    :max-width="200"
                    :content="currentBarCodeEg"
                    placement="top">
                    <my-icon>
                        <QuestionFilled />
                    </my-icon>
                </my-tooltip>
            </my-form-item>
            <my-form-item label="条码值"
                          v-if="multipleElementGetValue('contentType') == 'Barcode'">
                <my-switch
                    :model-value="multipleElementGetValue('option.barCodeDisplayValIs')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.barCodeDisplayValIs', val)"
                    class="ml-2"
                    inline-prompt
                    active-text="显示"
                    inactive-text="隐藏" />
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
            
            <my-form-item label="行高" v-if="getElementSetting(multipleElementGetValue('type')).includes('lineHeight')">
                <my-group>
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.lineHeight')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.lineHeight', val)"
                                             historyLabel="行高" />
                    <my-unit />
                </my-group>
            </my-form-item>
            <my-form-item label="线宽" v-if="getElementSetting(multipleElementGetValue('type')).includes('lineWidth')">
                <my-group>
                    <my-history-input-number class="num-2"
                                             :min="0.01"
                                             :model-value="multipleElementGetValue('option.lineWidth')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.lineWidth', val)"
                                             historyLabel="线宽" />
                    <my-unit />
                </my-group>
            </my-form-item>
            
            <my-form-item label="虚线样式" prop="region"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
                <my-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                                   placeholder="Activity zone"
                                   :data-list="dottedStyleList"
                                   historyLabel="虚线样式" />
            </my-form-item>
            <my-form-item label="内边距" prop="region"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('padding')">
                <my-group>
                    <my-history-input-number class="num-4"
                                             placeholder="顶"
                                             historyLabel="顶内边距"
                                             :model-value="multipleElementGetValue('option.padding.top')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.top', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="底"
                                             historyLabel="底内边距"
                                             :model-value="multipleElementGetValue('option.padding.bottom')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.bottom', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="左"
                                             historyLabel="左内边距"
                                             :model-value="multipleElementGetValue('option.padding.left')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.left', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="右"
                                             historyLabel="右内边距"
                                             :model-value="multipleElementGetValue('option.padding.right')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.padding.right', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                </my-group>
            </my-form-item>
            
            <my-form-item label="外边距" prop="region"
                          v-if="getElementSetting(multipleElementGetValue('type')).includes('margin')">
                <my-group>
                    <my-history-input-number class="num-4"
                                             placeholder="顶"
                                             historyLabel="顶外边距"
                                             :model-value="multipleElementGetValue('option.margin.top')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.top', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="底"
                                             historyLabel="底外边距"
                                             :model-value="multipleElementGetValue('option.margin.bottom')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.bottom', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="左"
                                             historyLabel="左外边距"
                                             :model-value="multipleElementGetValue('option.margin.left')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.left', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                    <my-history-input-number class="num-4"
                                             placeholder="右"
                                             historyLabel="右外边距"
                                             :model-value="multipleElementGetValue('option.margin.right')"
                                             @update:model-value="(val:any)=>multipleElementSetValue('option.margin.right', val)">
                        <template #append>mm</template>
                    </my-history-input-number>
                </my-group>
            </my-form-item>
            
            <my-form-item label="固定位置">
                <my-switch
                    :model-value="multipleElementGetValue('option.fixed')"
                    @update:model-value="(val:any)=>multipleElementSetValue('option.fixed', val)"
                    @change="changeOptionFixed"
                    class="ml-2"
                    inline-prompt
                    active-text="是"
                    inactive-text="否" />
            </my-form-item>
            
            <my-button size="small" @click="clearDrawPanel">清空画布</my-button>
        
        </my-divider-panel>
        
        <my-divider-panel>
            <template #divider>
                打印策略
            </template>
            
            <my-form-item label="显示策略" prop="region"
                          v-if="multipleElementGetValue('option.fixed') == true">
                <my-history-select :model-value="multipleElementGetValue('option.displayStrategy')"
                                   @update:model-value="(val:any)=>multipleElementSetValue('option.displayStrategy', val)"
                                   placeholder="Activity zone"
                                   :data-list="displayStrategyList"
                                   historyLabel="显示策略" />
            </my-form-item>
        
        </my-divider-panel>
    
    </my-form>

</template>
<script setup lang="ts">
import { computed, inject } from 'vue-demi';

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
    freshMoveableOption,
    moveableMoveX,
    moveableMoveY,
    moveableResize,
    moveableRotate
} from '@myprint/design/plugins/moveable/moveable';
import { MyElement } from '@myprint/design/types/entity';
import { multipleElementGetValue, multipleElementSetValue } from '@myprint/design/utils/elementUtil';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import TipIcon from '@myprint/design/components/my/icon/tip-icon.vue';
import MyDividerPanel from '@myprint/design/components/my/divider/my-divider-panel.vue';
import { mittKey } from '@myprint/design/constants/keys';
import MySwitch from '@myprint/design/components/my/switch/my-switch.vue';
import MyTooltip from '@myprint/design/components/my/tooltip/my-tooltip.vue';
import QuestionFilled from '@myprint/design/components/my/icon/icons/QuestionFilled.vue';
import MySlider from '@myprint/design/components/my/slider/my-slider.vue';
import MyFormItem from '@myprint/design/components/my/form/my-form-item.vue';
import MyForm from '@myprint/design/components/my/form/my-form.vue';
import MyButton from '@myprint/design/components/my/button/my-Button.vue';

const mitt = inject(mittKey)!;

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
    freshMoveableOption(element.value);
}

function rotatedPoint(_rotate: any) {
    // console.log(rotate);
    moveableRotate(element.value.option.rotate);
    // freshMoveableOption(appStore.currentElement)
}

function changeLocationX(_val: any) {
    moveableMoveX(unit2px(element.value.x));
}

function changeLocationY(_val: any) {
    moveableMoveY(unit2px(element.value.y));
}

function changeElementWidth(_val) {
    console.log(_val);
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
