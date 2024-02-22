<template>
  <div class="cp-group">
    <div class="display-block group-font">
      <div class="display-flex space-between">
        <group-input>
          <el-select v-model="appStore.currentElement.option.font"
                     :placeholder="i18n('font')"
                     size="small"
                     :disabled="!hasStyle(appStore.currentElement.type, 'font')"
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
          <el-select :modelValue="multipleElementGetValue('option.fontSize')"
                     @update:model-value="changeFontSize"
                     :placeholder="i18n('font.size')" size="small" class="width-60"
                     :disabled="!hasStyle(appStore.currentElement.type, 'fontSize')">
            <div class="width-100-p">
              <div class="display-flex width-100-p" style="justify-content: center">
                <cp-history-input-number class="width-60" v-model="appStore.currentElement.option.fontSize"
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
          <style-icon tips="加粗"
                      props="option.bold"
                      enableProps="bold">
            <i class="icon-zitijiacu iconfont"/>
          </style-icon>
          <style-icon tips="倾斜" props="option.italic" enableProps="italic">
            <i class="icon-zitixieti iconfont"/>
          </style-icon>
          <style-icon tips="下划线" props="option.underline" enableProps="underline">
            <i class="icon-zitixiahuaxian iconfont"/>
          </style-icon>
          <style-icon tips="删除线" props="option.lineThrough" enableProps="lineThrough">
            <i class="icon-wenben-shanchuxian iconfont"/>
          </style-icon>
        </div>
        
        <div class="display-flex" style="gap: 2px;">
          <cp-color-picker v-model="appStore.currentElement.option.color"
                           :enable="hasStyle(appStore.currentElement.type, 'color')">
            <i class="icon-zitiyanse iconfont" style="height: 20px"/>
          </cp-color-picker>
          <cp-color-picker v-model="appStore.currentElement.option.background"
                           :enable="hasStyle(appStore.currentElement.type, 'background')">
            <i class="icon-bucket iconfont" style="height: 20px"/>
          </cp-color-picker>
        </div>
      </div>
    
    </div>
    <div class="cp-line"/>
    <div class="display-block group-font">
      
      <div class="display-flex " style="gap: 2px">
        <style-icon tips="左对齐"
                    props="option.textAlign"
                    propsValue="start"
                    enableProps="textAlign">
          <i class="icon-zuoduiqi iconfont"/>
        </style-icon>
        <style-icon tips="水平居中"
                    props="option.textAlign"
                    propsValue="center"
                    enableProps="textAlign">
          <i class="icon-chuizhijuzhong iconfont"/>
        </style-icon>
        <style-icon tips="右对齐"
                    props="option.textAlign"
                    propsValue="end"
                    enableProps="textAlign">
          <i class="icon-youduiqi iconfont"/>
        </style-icon>
        
        <style-icon tips="组合"
                    @click="group()"
                    :enable="!appStore.currentElement.groupIs">
          <i class="icon-color-zh iconfont-color"/>
        </style-icon>
        
        <style-icon tips="取消组合"
                    @click="ungroup()"
                    :enable="appStore.currentElement.groupIs">
          <i class="icon-color-qxzh iconfont-color"/>
        </style-icon>
        
        <style-icon tips="置于顶层">
          <i class="icon-color-zydc iconfont-color"/>
        </style-icon>
        
        <style-icon tips="上移一层">
          <i class="icon-color-syyc iconfont-color"/>
        </style-icon>
        
        <style-icon tips="下移一层">
          <i class="icon-color-xyyc iconfont-color"/>
        </style-icon>
        
        <style-icon tips="置于底层">
          <i class="icon-color-zydic iconfont-color"/>
        </style-icon>
        
        <!--        <style-icon tips="两端对齐" :modelValue="appStore.currentElement.option.textAlign == 'justify'"-->
        <!--                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'justify'}"-->
        <!--                    :enable="['Text', 'Table'].includes(appStore.currentElement.type)">-->
        <!--          <i class="icon-caidan iconfont"/>-->
        <!--        </style-icon>-->
      </div>
      
      <div class="display-flex" style="gap: 2px; margin-top: 2px">
        <style-icon tips="顶对齐"
                    props="option.verticalAlign"
                    propsValue="start"
                    enableProps="verticalAlign">
          <i class="icon-shangduiqi iconfont"/>
        </style-icon>
        <style-icon tips="垂直居中"
                    props="option.verticalAlign"
                    propsValue="center"
                    enableProps="verticalAlign">
          <i class="icon-shuipingjuzhong iconfont"/>
        </style-icon>
        <style-icon tips="底对齐"
                    props="option.verticalAlign"
                    propsValue="end"
                    enableProps="verticalAlign">
          <i class="icon-xiaduiqi iconfont"/>
        </style-icon>
        <style-icon tips="换行" marginTop="-3px"
                    props="option.lineBreak"
                    enableProps="lineBreak">
          <i class="icon-wenbenhuanhang iconfont" style="font-size: 20px"/>
        </style-icon>
        <style-icon tips="边框"
                    props="option.borderAll"
                    enableProps="borderAll">
          <i class="icon-jurassic_border-all iconfont" style="font-size: 18px"/>
        </style-icon>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
// import { ElSelect, ElOption } from 'element-plus'
import GroupInput from "../../cp/cp-group/groupInput.vue";
import cpColorPicker from "../../cp/cp-colorPicker/cp-colorPicker.vue";
import StyleIcon from "@cp-print/design/components/cp/icon";
import {i18n} from "@cp-print/design/locales";
import {fontList, fontSizeList, hasStyle} from "@cp-print/design/constants/common";
import {CpHistoryInputNumber} from "@cp-print/design/components/cp/input";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {group, ungroup} from "@cp-print/design/components/moveable/moveable";
import {multipleElementGetValue, multipleElementSetValue} from "@cp-print/design/utils/elementUtil";

// import {ElementOption} from "@/types/entity";

const appStore = useAppStoreHook()

function changeFontSize(val: string) {
  console.log(val)
  multipleElementSetValue('option.fontSize', val)
}

// watch(() => appStore.currentElement, (n, o) => {
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
