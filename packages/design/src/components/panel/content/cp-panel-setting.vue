<template>
  <el-form label-width="80px" size="small"
           label-position="right">
    
    <el-divider>
      面板
    </el-divider>
    <el-form-item label="模版名称">
      <cp-history-input v-model="panel.name"
                        type="textarea"
                        :placeholder="i18n('common.width')"
                        size="small"
                        historyLabel="模版名称"
                        style="margin-right: 20px"/>
    </el-form-item>
    
    <el-form-item label="单位" prop="region">
      <cp-history-select v-model="panel.pageUnit"
                         @change="selectPageUnit"
                         class="width-60"
                         placeholder="Select"
                         size="small"
                         historyLabel="单位">
        <el-option
            v-for="item in pageUnitList"
            :key="item"
            :label="item"
            :value="item"
        />
      </cp-history-select>
    </el-form-item>
    
    <el-form-item label="纸张" prop="region">
      <cp-history-select v-model="panel.pageSize" class="width-80" placeholder="Select" size="small"
                         @change="selectPageSize"
                         historyLabel="纸张">
        <el-option
            v-for="item in pageSizeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </cp-history-select>
    </el-form-item>
    
    <el-form-item label="尺寸(宽/高)">
      <group-input>
        <cp-history-input-number class="width-60" v-model="panel.width"
                                 @change="changePanelWidth"
                                 historyLabel="纸张宽"/>
        <cp-history-input-number class="width-60" v-model="panel.height"
                                 historyLabel="纸张高"/>
        <cp-unit/>
      </group-input>
    </el-form-item>
    
    <!--    <style-icon tips="水印" v-model="panel.watermark" enable>-->
    <!--      <i class="iconfont-color icon-color-watermark cp-watermark"/>-->
    <!--    </style-icon>-->
    <el-form-item label="水印">
      <el-switch
          v-model="panel.watermark"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
          active-text="开启"
          inactive-text="关闭"/>
    </el-form-item>
    
    <el-form-item label="水印内容" v-if="panel.watermark">
      <cp-history-input v-model="panel.watermarkContent"
                        :placeholder="i18n('common.width')"
                        size="small"
                        historyLabel="水印内容"
                        style="margin-right: 20px"/>
    </el-form-item>
  
  </el-form>

</template>
<script setup lang="ts">
// import { ElForm, ElFormItem, ElDivider, ElSwitch} from 'element-plus'
import {inject} from "vue";
import {i18n} from "@cp-print/design/locales";

import {pageSizeList, pageUnitList} from "@cp-print/design/constants/common";
import {panelKey} from "@cp-print/design/constants/keys";
import {CpUnit, CpHistoryInput, CpHistorySelect, CpHistoryInputNumber} from "@cp-print/design/components/cp/input";
import GroupInput from "../../cp/cp-group/groupInput.vue";
import {changePageSize, changePageUnit} from "@cp-print/design/utils/elementUtil";

const panel = inject(panelKey)!

function selectPageSize(val: any) {
  // console.log(123)
  for (let valueElement of pageSizeList) {
    if (valueElement.value == val) {
      changePageSize(valueElement)
      break
    }
  }
}

function changePanelWidth(_val: number) {
  changePageSize()
  // console.log(val)
}

function selectPageUnit() {
  // console.log(123)
  changePageUnit()
  
  // for (let valueElement of pageSizeList) {
  //   if (valueElement.value == val) {
  //     panel.width = valueElement.width
  //     panel.height = valueElement.height
  //     panel.pageSize = valueElement.value
  //     break
  //   }
  // }
}
</script>
