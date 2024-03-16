<template>
  <div class="option-container display-flex-column">
    <div class="header display-flex">
      <el-icon size="25" class="header-back-icon">
        <ArrowLeft/>
      </el-icon>
      <div style="flex: 1;"> {{ moduleName }}</div>
    </div>
    <div class="option-container display-flex-column">
      <el-scrollbar>
        <el-collapse v-model="openPanel" class="option-collapse">
          <el-collapse-item title="业务字段" name="1"
                            v-if="provider.elementList != null && provider.elementList.length > 0">
            <div class="display-flex display-flex-wrap" style="gap: 5px">
              <OptionView v-for="(element, index) in provider.elementList" :key="index" :data="element"/>
            </div>
          
          </el-collapse-item>
          <el-collapse-item title="公共组件" name="2">
            <div class="display-flex" style="flex-wrap: wrap;">
              <basic v-for="(element, index) in customProvider" :key="index" :data="element"/>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="设计辅助" name="3" v-if="auxiliaryProvider.length> 0">
            <div class="display-flex" style="flex-wrap: wrap;">
              <basic v-for="(element, index) in auxiliaryProvider" :key="index" :data="element"/>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>

    </div>
    <div class="option-bottom">
<!--      <img class="cp-logo" src="../../../assets/cprint-logo.png" alt="cp-logo"/>-->
      <div class="cp-version">v1.0.0</div>
    </div>
  
  </div>

</template>

<script setup lang="ts">
// import { ElIcon, ElScrollbar, ElCollapse, ElCollapseItem } from 'element-plus'
import OptionView from './index.vue'
import basic from './basic.vue'
import {inject, ref} from "vue";
import {providerKey} from "@cp-print/design/constants/keys";
import {customProvider} from "@cp-print/design/constants/provider/custom";
import {auxiliaryProvider} from "@cp-print/design/constants/provider/auxiliary";
import {ArrowLeft} from "@element-plus/icons-vue";

const provider = inject(providerKey)!
withDefaults(defineProps<{
  moduleName?: string
}>(), {
  moduleName: '默认名称'
})
const openPanel = ref(['1', '2', '3'])

</script>
