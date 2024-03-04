<template>
  <div class="group">
    <div class="display-block group-font">
      <group-input>
        <el-select v-model="style.font" placeholder="字体" size="small" style="width: 100px">
          <el-option
              v-for="item in fontList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select v-model="style.fontSize" placeholder="字体大小" size="small" style="width: 60px">
          <el-option
              v-for="item in fontSizeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </group-input>
      
      <div class="display-flex space-between">
        <div class="display-flex font-style">
          <i class="icon-zitijiacu iconfont"/>
          <i class="icon-zitixieti iconfont"/>
          <i class="icon-zitixiahuaxian iconfont"/>
          <i class="icon-zitishanchuxian iconfont"/>
        </div>
        
        <div class="display-flex font-style font-color">
          <div class="display-flex">
            <div class="display-flex-column">
              <i class="icon-zitiyanse iconfont" style="height: 20px"/>
              <!--              <el-color-picker popper-class="cc-color"-->
              <!--                               ref="fontColorRef"-->
              <!--                               v-model="color" size="small"-->
              <!--                               :predefine="predefineColors"/>-->
              <color-picker v-model:pureColor="color"/>
            </div>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""
                 width="10" height="10">
              <path fill="currentColor"
                    d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
            </svg>
          </div>
        
        </div>
      </div>
    
    </div>
    <div class="line"></div>
    <div class="display-block group-font">
      
      <div class="display-flex">
        <i class="icon-zuoduiqi iconfont"/>
        <i class="icon-chuizhijuzhong iconfont"/>
        <i class="icon-youduiqi iconfont"/>
        <i class="icon-caidan iconfont"/>
      </div>
      
      <div class="display-flex">
        <i class="icon-shangduiqi iconfont"/>
        <i class="icon-shuipingjuzhong iconfont"/>
        <i class="icon-xiaduiqi iconfont"/>
        <i class="icon-wenbenhuanhang iconfont"/>
        <i class="icon-jurassic_border-all iconfont"/>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ElSelect, ElOption} from 'element-plus'

import GroupInput from "../../design/src/components/cp/cp-group/groupInput.vue";
import {ref} from "vue";
import {ArrowDown} from "@element-plus/icons-vue";
import {ColorPicker} from "vue3-colorpicker";

const fontList = [
  {
    label: '默认',
    value: 'default',
  },
  {
    label: '黑体',
    value: 'heiti',
  }
]

const fontSizeList = [
  {value: 8},
  {
    value: 9
  }
  ,
  {
    value: 10
  }
  ,
  {
    value: 18
  }
]

const style = ref({
  font: 'default',
  fontSize: 18
})
const fontColorRef = ref({})

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
])

function clickColor() {
  console.log('show')
  fontColorRef.value.show()
  fontColorRef.value.show()
}

</script>


<style scoped>

</style>
