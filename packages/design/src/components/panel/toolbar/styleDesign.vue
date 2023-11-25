<template>
  <div class="cp-group">
    <div class="display-block group-font">
      <div class="display-flex space-between">
        <group-input>
          <el-select v-model="selectElement.option.font"
                     :placeholder="i18n('font')"
                     size="small"
                     :disabled="!hasStyle(selectElement.type, 'font')"
                     class="width-100">
            <el-option
                v-for="item in fontList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              <span :style="{fontFamily: item.value}">
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
          <el-select v-model="selectElement.option.fontSize"
                     :placeholder="i18n('font.size')" size="small" class="width-60"
                     :disabled="!hasStyle(selectElement.type, 'fontSize')">
            <div class="width-100-p">
              <div class="display-flex width-100-p" style="justify-content: center">
                <cp-history-input-number class="width-60" v-model="selectElement.option.fontSize"
                                         size="small"
                                         placeholder="输入字号"
                                         historyLabel="位置"/>
              </div>
              
              <div class="width-100-p" style="height: 1px; background: grey; margin-top: 2px; margin-bottom: 2px"></div>
            </div>
            <el-option
                v-for="item in fontSizeList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
            />
          </el-select>
        </group-input>
        
        <!--        <div>
                  <style-icon tips="清除">
                    <i class="icon-zitibiankuang iconfont"/>
                  </style-icon>
                </div>-->
      </div>
      
      <div class="display-flex space-between" style="margin-top: 1px">
        <div class="display-flex" style="gap: 2px">
          <style-icon tips="加粗" v-model="selectElement.option.bold"
                      :enable="hasStyle(selectElement.type, 'bold')">
            <i class="icon-zitijiacu iconfont"/>
          </style-icon>
          <style-icon tips="倾斜" v-model="selectElement.option.italic"
                      :enable="hasStyle(selectElement.type, 'italic')">
            <i class="icon-zitixieti iconfont"/>
          </style-icon>
          <style-icon tips="下划线" v-model="selectElement.option.underline"
                      :enable="hasStyle(selectElement.type, 'underline')">
            <i class="icon-zitixiahuaxian iconfont"/>
          </style-icon>
          <style-icon tips="删除线" v-model="selectElement.option.lineThrough"
                      :enable="hasStyle(selectElement.type, 'lineThrough')">
            <i class="icon-wenben-shanchuxian iconfont"/>
          </style-icon>
        </div>
        
        <div class="display-flex" style="gap: 2px;">
          <cp-color-picker v-model="selectElement.option.color"
                           :enable="hasStyle(selectElement.type, 'color')">
            <i class="icon-zitiyanse iconfont" style="height: 20px"/>
          </cp-color-picker>
          <cp-color-picker v-model="selectElement.option.background"
                           :enable="hasStyle(selectElement.type, 'background')">
            <i class="icon-bucket iconfont" style="height: 20px"/>
          </cp-color-picker>
        </div>
      </div>
    
    </div>
    <div class="cp-line"/>
    <div class="display-block group-font">
      
      <div class="display-flex " style="gap: 2px">
        <style-icon tips="左对齐" :modelValue="selectElement.option.textAlign == 'start'"
                    @update:model-value="flag => {if(flag) selectElement.option.textAlign = 'start'}"
                    :enable="hasStyle(selectElement.type, 'textAlign')">
          <i class="icon-zuoduiqi iconfont"/>
        </style-icon>
        <style-icon tips="水平居中" :modelValue="selectElement.option.textAlign == 'center'"
                    @update:model-value="flag => {if(flag) selectElement.option.textAlign = 'center'}"
                    :enable="hasStyle(selectElement.type, 'textAlign')">
          <i class="icon-chuizhijuzhong iconfont"/>
        </style-icon>
        <style-icon tips="右对齐" :modelValue="selectElement.option.textAlign == 'end'"
                    @update:model-value="flag => {if(flag) selectElement.option.textAlign = 'end'}"
                    :enable="hasStyle(selectElement.type, 'textAlign')">
          <i class="icon-youduiqi iconfont"/>
        </style-icon>
        <!--        <style-icon tips="两端对齐" :modelValue="selectElement.option.textAlign == 'justify'"-->
        <!--                    @update:model-value="flag => {if(flag) selectElement.option.textAlign = 'justify'}"-->
        <!--                    :enable="['Text', 'Table'].includes(selectElement.type)">-->
        <!--          <i class="icon-caidan iconfont"/>-->
        <!--        </style-icon>-->
      </div>
      
      <div class="display-flex" style="gap: 2px; margin-top: 2px">
        <style-icon tips="顶对齐" :modelValue="selectElement.option.verticalAlign == 'start'"
                    @update:model-value="flag => {if(flag) selectElement.option.verticalAlign = 'start'}"
                    :enable="hasStyle(selectElement.type, 'verticalAlign')">
          <i class="icon-shangduiqi iconfont"/>
        </style-icon>
        <style-icon tips="垂直居中" :modelValue="selectElement.option.verticalAlign == 'center'"
                    @update:model-value="flag => {if(flag) selectElement.option.verticalAlign = 'center'}"
                    :enable="hasStyle(selectElement.type, 'verticalAlign')">
          <i class="icon-shuipingjuzhong iconfont"/>
        </style-icon>
        <style-icon tips="底对齐" :modelValue="selectElement.option.verticalAlign == 'end'"
                    @update:model-value="flag => {if(flag) selectElement.option.verticalAlign = 'end'}"
                    :enable="hasStyle(selectElement.type, 'verticalAlign')">
          <i class="icon-xiaduiqi iconfont"/>
        </style-icon>
        <!--        <style-icon tips="换行" marginTop="-3px" :modelValue="selectElement.option.verticalAlign == 'bottom'" @update:model-value="flag => {if(flag) selectElement.option.verticalAlign = 'bottom'}" :enable="['Text', 'Table'].includes(selectElement.type)">-->
        <!--          <i class="icon-wenbenhuanhang iconfont" style="font-size: 20px"/>-->
        <!--        </style-icon>-->
        <style-icon tips="边框" v-model="selectElement.option.borderAll"
                    :enable="hasStyle(selectElement.type, 'borderAll')">
          <i class="icon-jurassic_border-all iconfont" style="font-size: 18px"/>
        </style-icon>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import GroupInput from "../../cp/cp-group/groupInput.vue";
import cpColorPicker from "../../cp/cp-colorPicker/cp-colorPicker.vue";
import StyleIcon from "@cp-print/design/components/cp/icon";
import {i18n} from "@cp-print/design/locales";
import {elementSetting, fontList, fontSizeList, hasStyle} from "@cp-print/design/constants/common";
import {getCurrentElement} from "@cp-print/design/utils/elementUtil";
import {CpHistoryInputNumber} from "@cp-print/design/components/cp/input";

// import {ElementOption} from "@/types/entity";

const selectElement = getCurrentElement()

// watch(() => selectElement, (n, o) => {
//   if (n.value != null) {
//     if (n.value.option == null) {
//       n.value.option = {} as ElementOption
//     }
//   }
// })

// const style = ref({
//   font: 'default',
//   fontSize: 18
// })

</script>


<style scoped>

.cp-group {
  padding: 2px;
  display: flex;
}

.group-font {
  width: 200px;
}


</style>

