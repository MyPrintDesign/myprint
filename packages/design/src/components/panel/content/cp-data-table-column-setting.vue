<template>
  <el-form label-width="80px" size="small"
           label-position="right">
    <el-divider>
      列
    </el-divider>
    
    <el-form-item label="内容" v-if="getElementSetting(multipleElementGetValue('type')).includes('data')">
      <cp-history-input style="margin-right: 20px"
                        historyLabel="内容"
                        :model-value="multipleElementGetValue('data')"
                        @update:model-value="(val:any)=>multipleElementSetValue('data', val)"
                        type="textarea"/>
    </el-form-item>
    <el-divider class="divider-setting-layout">
      布局
    </el-divider>
    
    <el-form-item label="宽/高" v-if="getElementSetting(multipleElementGetValue('type')).includes('width')">
      <group-input>
        <cp-history-input-number class="width-60"
                                 :model-value="multipleElementGetValue('width')"
                                 @update:model-value="(val:any)=>multipleElementSetValue('width', val)"
                                 historyLabel="尺寸"/>
        <cp-history-input-number class="width-60"
                                 :model-value="multipleElementGetValue('height')"
                                 @update:model-value="(val:any)=>multipleElementSetValue('height', val)"
                                 historyLabel="尺寸"/>
        <cp-unit/>
      </group-input>
    </el-form-item>
    
    <el-form-item label="不透明度" v-if="getElementSetting(multipleElementGetValue('type')).includes('opacity')">
      <el-slider class="width-120"
                 :model-value="multipleElementGetValue('option.opacity')"
                 @update:model-value="(val:any)=>multipleElementSetValue('option.opacity', val)"
                 :max="1" :min="0" :step="0.01"
                 :show-tooltip="false" size="small"
                 historyLabel="不透明度"/>
      <div style="margin-left: 20px">{{ multipleElementGetValue('option.opacity') }}</div>
    </el-form-item>
    
    <el-divider>
      属性
    </el-divider>
    
    <el-form-item label="打印类型" prop="region"
                  v-if="getElementSetting(multipleElementGetValue('type')).includes('contentType')">
      <cp-history-select :model-value="multipleElementGetValue('contentType')"
                         @update:model-value="(val:any)=>multipleElementSetValue('contentType', val)"
                         placeholder="Activity zone"
                         historyLabel="打印类型">
        <el-option v-for="(item, index) in textContentTypes" :key="index" :label="item.label" :value="item.value"/>
      </cp-history-select>
    </el-form-item>
    <el-form-item label="条码编码" prop="region" v-if="multipleElementGetValue('option.contentType') == 'Barcode'">
      <cp-history-select class="width-140"
                         :model-value="multipleElementGetValue('option.barCodeType')"
                         @update:model-value="(val:any)=>multipleElementSetValue('option.barCodeType', val)"
                         placeholder="条码类型"
                         historyLabel="条码类型">
        <el-option v-for="(item, index) in barcodeTypes" :key="index" :label="item.label" :value="item.value"
        />
      </cp-history-select>
      <el-tooltip
          popper-class="barcode-type-tooltip"
          effect="dark"
          :max-width="200"
          placement="top"
      >
        <el-icon style="margin-left: 5px" :size="14">
          <QuestionFilled/>
        </el-icon>
      </el-tooltip>
    </el-form-item>
    <!--    errorCorrectionLevel-->
    <!--      <el-form-item label="换行策略" prop="region">-->
    <!--      <cp-history-select v-model="form.region" placeholder="Activity zone">-->
    <!--        <el-option label="Zone one" value="shanghai"/>-->
    <!--      </cp-history-select>-->
    <!--      </el-form-item>-->
    
    <el-form-item label="行高" v-if="getElementSetting(multipleElementGetValue('type')).includes('lineHeight')">
      <group-input>
        <cp-history-input-number class="num-2"
                                 :min="0.01"
                                 :model-value="multipleElementGetValue('option.lineHeight')"
                                 @update:model-value="(val:any)=>multipleElementSetValue('option.lineHeight', val)"
                                 historyLabel="行高"/>
        <cp-unit/>
      </group-input>
    </el-form-item>
    
    <el-form-item label="虚线样式" prop="region"
                  v-if="getElementSetting(multipleElementGetValue('type')).includes('dottedStyle')">
      <cp-history-select :model-value="multipleElementGetValue('option.dottedStyle')"
                         @update:model-value="(val:any)=>multipleElementSetValue('option.dottedStyle', val)"
                         placeholder="Activity zone"
                         historyLabel="虚线样式">
        <el-option v-for="(item, index) in dottedStyleList" :key="index" :label="item.label" :value="item.value"/>
      </cp-history-select>
    </el-form-item>
    <!--      <el-form-item label="内边距" prop="region" v-if="getElementSetting(multipleElementGetValue('type')].includes(')adding')">-->
    <!--        <group-input>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.padding.top">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.padding.bottom">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.padding.left">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.padding.right">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--        </group-input>-->
    <!--      </el-form-item>-->
    <!--      -->
    <!--      <el-form-item label="外边距" prop="region" v-if="getElementSetting(multipleElementGetValue('type')].includes(')argin')">-->
    <!--        <group-input>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.margin.top">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.margin.bottom">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.margin.left">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="appStore.currentElement.option.margin.right">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--        </group-input>-->
    <!--      </el-form-item>-->
    <!--    -->
  </el-form>

</template>
<script setup lang="ts">
// import { ElForm, ElFormItem, ElDivider, ElSwitch, ElTooltip } from 'element-plus'

import {barcodeTypes, dottedStyleList, getElementSetting, textContentTypes} from "@cp-print/design/constants/common";
import {QuestionFilled} from "@element-plus/icons-vue";
import GroupInput from "../../cp/cp-group/groupInput.vue";
import {CpHistoryInput, CpHistoryInputNumber, CpHistorySelect, CpUnit} from "@cp-print/design/components/cp/input";
import {multipleElementGetValue, multipleElementSetValue} from "@cp-print/design/utils/elementUtil";
//
// const mitt = inject(mittKey)!
// // const data = reactive({
// //   currentBarCodeEg: null
// // })
// const appStore = useAppStoreHook()
// const head = ref<CpElement>()
//

</script>
