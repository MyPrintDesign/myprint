<template>
  <el-form label-width="80px" size="small"
           label-position="right">
    <el-divider>
      基础
    </el-divider>
    
    <el-form-item label="标题显示" v-if="elementSetting[selectElement.type].includes('label')">
      <el-switch
          v-model="selectElement.option.hiddenLabel"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
          active-text="显示"
          inactive-text="隐藏"/>
      <!--      <el-switch v-if="selectElement.option.hiddenLabel"-->
      <!--                 v-model="selectElement.option.labelSplit"-->
      <!--                 class="ml-2"-->
      <!--                 inline-prompt-->
      <!--                 style="&#45;&#45;el-switch-on-color: var(&#45;&#45;drag-h-color); &#45;&#45;el-switch-off-color: gray; margin-left: 10px"-->
      <!--                 active-text="拆分"-->
      <!--                 inactive-text="合并"/>-->
    </el-form-item>
    
    <el-form-item label="标题" v-if="elementSetting[selectElement.type].includes('label')">
      <cp-history-input style="margin-right: 20px" v-model="selectElement.label" historyLabel="标题"/>
    </el-form-item>
    <el-form-item label="内容" v-if="elementSetting[selectElement.type].includes('data')">
      <cp-history-input style="margin-right: 20px"
                        historyLabel="内容"
                        v-model="selectElement.data"
                        type="textarea"/>
    </el-form-item>
    <el-form-item label="格式化器" v-if="elementSetting[selectElement.type].includes('formatter')">
      <cp-history-input v-model="selectElement.option.formatter"
                        historyLabel="格式化器"/>
    </el-form-item>
    
    <el-divider>
      样式
    </el-divider>
    
    <el-form-item label="位置(x/y)" v-if="elementSetting[selectElement.type].includes('x')">
      <group-input>
        <cp-history-input-number class="width-60" v-model="selectElement.x" @change="change"
                                 historyLabel="位置"/>
        <cp-history-input-number class="width-60" v-model="selectElement.y"
                                 historyLabel="位置"/>
        <cp-unit/>
      
      </group-input>
    </el-form-item>
    
    <el-form-item label="尺寸(宽/高)" v-if="elementSetting[selectElement.type].includes('width')">
      <group-input>
        <cp-history-input-number class="width-60" v-model="selectElement.width"
                                 historyLabel="尺寸"/>
        <cp-history-input-number class="width-60" v-model="selectElement.height"
                                 historyLabel="尺寸"/>
        <cp-unit/>
      </group-input>
    </el-form-item>
    
    <el-form-item label="宽高比例" v-if="elementSetting[selectElement.type].includes('contentType')">
      <group-input>
        <cp-history-input-number placeholder="例:1.25" class="width-60" v-model="selectElement.option.aspectRatio"
                                 historyLabel="宽高比例"/>
      </group-input>
    </el-form-item>
    
    <el-form-item label="不透明度" v-if="elementSetting[selectElement.type].includes('opacity')">
      <el-slider class="width-120" v-model="selectElement.option.opacity"
                 :max="1" :min="0" :step="0.01"
                 :show-tooltip="false" size="small"
                 historyLabel="不透明度"/>
      <div style="margin-left: 20px">{{ selectElement.option.opacity }}</div>
    </el-form-item>
    <el-form-item label="旋转角度" v-if="elementSetting[selectElement.type].includes('rotate')">
      <!--      <el-slider v-model="value1"/>-->
      <el-slider class="width-120" v-model="selectElement.option.rotate"
                 :max="359" :min="0" :step="1"
                 @change="rotatedPoint(selectElement)"
                 :show-tooltip="false" size="small"/>
      <div style="margin-left: 20px">{{ selectElement.option.rotate }}</div>
    </el-form-item>
    
    <el-divider>
      属性
    </el-divider>
    
    <el-form-item label="打印类型" prop="region" v-if="elementSetting[selectElement.type].includes('contentType')">
      <cp-history-select v-model="selectElement.contentType" placeholder="Activity zone"
                         historyLabel="打印类型">
        <el-option v-for="(item, index) in textContentTypes" :key="index" :label="item.label" :value="item.value"/>
      </cp-history-select>
    </el-form-item>
    <el-form-item label="条码编码" prop="region" v-if="selectElement.contentType == 'Barcode'">
      <cp-history-select class="width-140" v-model="selectElement.option.barCodeType"
                         placeholder="条码类型"
                         historyLabel="条码类型">
        <el-option v-for="(item, index) in barcodeTypes" :key="index" :label="item.label" :value="item.value"
        />
      </cp-history-select>
      <el-tooltip
          popper-class="barcode-type-tooltip"
          effect="dark"
          :max-width="200"
          :content="currentBarCodeEg"
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
    
    <el-form-item label="行高" v-if="elementSetting[selectElement.type].includes('lineHeight')">
      <group-input>
        <cp-history-input-number class="num-2"
                                 :min="0.01"
                                 v-model="selectElement.option.lineHeight"
                                 historyLabel="行高"/>
        <cp-unit/>
      </group-input>
    </el-form-item>
    
    <el-form-item label="虚线样式" prop="region" v-if="elementSetting[selectElement.type].includes('dottedStyle')">
      <cp-history-select v-model="selectElement.option.dottedStyle" placeholder="Activity zone"
                         historyLabel="虚线样式">
        <el-option v-for="(item, index) in dottedStyleList" :key="index" :label="item.label" :value="item.value"/>
      </cp-history-select>
    </el-form-item>
    <!--      <el-form-item label="内边距" prop="region" v-if="elementSetting[selectElement.type].includes('padding')">-->
    <!--        <group-input>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.padding.top">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.padding.bottom">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.padding.left">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.padding.right">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--        </group-input>-->
    <!--      </el-form-item>-->
    <!--      -->
    <!--      <el-form-item label="外边距" prop="region" v-if="elementSetting[selectElement.type].includes('margin')">-->
    <!--        <group-input>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.margin.top">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.margin.bottom">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.margin.left">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--          <cp-history-input-number class="num-4" v-model="selectElement.option.margin.right">-->
    <!--            <template #append>mm</template>-->
    <!--          </cp-history-input-number>-->
    <!--        </group-input>-->
    <!--      </el-form-item>-->
    <!--    -->
  </el-form>

</template>
<script setup lang="ts">
// import { ElForm, ElFormItem, ElDivider, ElSwitch, ElTooltip } from 'element-plus'
import {computed, inject} from "vue";

import {barcodeTypes, dottedStyleList, elementSetting, textContentTypes} from "@cp-print/design/constants/common";
import {mittKey} from "@cp-print/design/constants/keys";
import {ActionEnum, Snapshot} from "@cp-print/design/utils/historyUtil";
import {getCurrentElement, rotatedPoint} from "@cp-print/design/utils/elementUtil";
import {QuestionFilled} from "@element-plus/icons-vue";
import GroupInput from "../../cp/cp-group/groupInput.vue";
import {CpUnit, CpHistoryInput, CpHistorySelect, CpHistoryInputNumber} from "@cp-print/design/components/cp/input";

const mitt = inject(mittKey)!
// const data = reactive({
//   currentBarCodeEg: null
// })
const selectElement = getCurrentElement()


const currentBarCodeEg = computed(() => {
  if (selectElement.value.option && selectElement.value.option.barCodeType) {
    return changeBarCodeType(selectElement.value.option.barCodeType)
  }
})

function change(_val:any) {
  // record()
  mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, element: selectElement.value} as Snapshot)
  // console.log('change', val)
}

function changeBarCodeType(val:any) {
  // record()
  // console.log('change', val)
  return barcodeTypes.find(v => v.value == val)!.eg
}

</script>
