<template>
  <div class="cp-group">
    
    <font-family :enable="fontEnableComputed"/>
    <font-size :enable="fontEnableComputed"/>
    
    <div class="cp-style-divider"/>
    
    <!--        <div>
              <style-icon tips="清除">
                <i class="icon-zitibiankuang iconfont"/>
              </style-icon>
            </div>-->
    
    <style-icon tips="加粗"
                props="option.bold"
                enableProps="bold"
                class="icon-zitijiacu iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="倾斜" props="option.italic" enableProps="italic"
                class="icon-zitixieti iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="下划线" props="option.underline" enableProps="underline"
                class="icon-zitixiahuaxian iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="删除线" props="option.lineThrough" enableProps="lineThrough"
                class="icon-wenben-shanchuxian iconfont cursor-pointer cp-style-item"/>
    
    <cp-color-picker
        :modelValue="multipleElementGetValue('option.color')"
        @update:model-value="(val:any)=>multipleElementSetValue('option.color', val)"
        :enable="hasStyle(multipleElementGetValue('type'), 'color')">
      <i class="icon-zitiyanse iconfont"/>
    </cp-color-picker>
    <cp-color-picker
        :modelValue="multipleElementGetValue('option.background')"
        @update:model-value="(val:any)=>multipleElementSetValue('option.background', val)"
        :enable="hasStyle(multipleElementGetValue('type'), 'background')">
      <i class="icon-bucket iconfont"/>
    </cp-color-picker>
    <div class="cp-style-divider"/>
    
    <style-icon tips="左对齐"
                props="option.textAlign"
                propsValue="start"
                class="icon-zuoduiqi iconfont cursor-pointer cp-style-item"
                enableProps="textAlign"/>
    <style-icon tips="水平居中"
                props="option.textAlign"
                propsValue="center"
                class="icon-chuizhijuzhong iconfont cursor-pointer cp-style-item"
                enableProps="textAlign"/>
    <style-icon tips="右对齐"
                props="option.textAlign"
                propsValue="end"
                enableProps="textAlign"
                class="icon-youduiqi iconfont cursor-pointer cp-style-item"/>
    
    
    <!--        <style-icon tips="两端对齐" :modelValue="appStore.currentElement.option.textAlign == 'justify'"-->
    <!--                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'justify'}"-->
    <!--                    :enable="['Text', 'Table'].includes(appStore.currentElement.type)">-->
    <!--          <i class="icon-caidan iconfont"/>-->
    <!--        </style-icon>-->
    
    <style-icon tips="顶对齐"
                props="option.verticalAlign"
                propsValue="start"
                enableProps="verticalAlign"
                class="icon-shangduiqi iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="垂直居中"
                props="option.verticalAlign"
                propsValue="center"
                enableProps="verticalAlign"
                class="icon-shuipingjuzhong iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="底对齐"
                props="option.verticalAlign"
                propsValue="end"
                enableProps="verticalAlign"
                class="icon-xiaduiqi iconfont cursor-pointer cp-style-item"/>
    <style-icon tips="换行" marginTop="-3px"
                props="option.lineBreak"
                enableProps="lineBreak"
                class="icon-wenbenhuanhang iconfont cursor-pointer cp-style-item"/>
    
    <style-icon tips="边框"
                props="option.borderAll"
                enableProps="borderAll"
                class="icon-jurassic_border-all iconfont cursor-pointer cp-style-item"/>
    
    <style-icon tips="组合"
                @click="group()"
                :enable="groupEnableIs"
                class="icon-color-zh iconfont-color cursor-pointer cp-style-item"/>
    
    <style-icon tips="取消组合"
                @click="ungroup()"
                :enable="ungroupEnableIs"
                class="icon-color-qxzh iconfont-color cursor-pointer cp-style-item"/>
    
    <tool-icon-popover
        :enable="hasStyle(multipleElementGetValue('type'), 'background')">
      <template #reference>
        <i class="icon-color-zydic iconfont-color"/>
      </template>
      <template #panel>
        <element-align :elementAlignList="elementLayerList"/>
      </template>
    
    </tool-icon-popover>
    
    <tool-icon-popover
        :enable="hasStyle(multipleElementGetValue('type'), 'background')">
      <template #reference>
        <i class="icon-color-spz iconfont-color"/>
      </template>
      <template #panel>
        <element-align :elementAlignList="elementAlignList"/>
      </template>
    
    </tool-icon-popover>
  </div>

</template>

<script setup lang="ts">
// import { ElSelect, ElOption } from 'element-plus'
// import GroupInput from "../../cp/cp-group/groupInput.vue";
import cpColorPicker from "../../cp/cp-colorPicker/cp-colorPicker.vue";
import StyleIcon from "@cp-print/design/components/cp/icon";
// import {i18n} from "@cp-print/design/locales";
import {hasStyle} from "@cp-print/design/constants/common";
// import {CpHistoryInputNumber} from "@cp-print/design/components/cp/input";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {
  alignHorizontalCenter,
  alignLeft,
  group,
  ungroup
} from "@cp-print/design/components/moveable/moveable";
import {
  elementDown,
  elementUp,
  multipleElementGetValue,
  multipleElementSetValue
} from "@cp-print/design/utils/elementUtil";
import {computed, reactive} from "vue";
import ToolIconPopover from "@cp-print/design/components/cp/icon/tool-icon-popover.vue";
import ElementAlign from "@cp-print/design/components/panel/toolbar/toolbarStyle/element-align.vue";
import {DownList} from "@cp-print/design/types/entity";
import FontSize from "@cp-print/design/components/panel/toolbar/toolbarStyle/font-size.vue";
import FontFamily from "@cp-print/design/components/panel/toolbar/toolbarStyle/font-family.vue";

const elementAlignList = reactive([
  [
    {
      label: "左对齐",
      click: alignLeft,
      icon: "icon-color-spz iconfont-color",
      enable: true
    },
    {
      label: "居中对齐",
      click: alignHorizontalCenter,
      icon: "icon-color-spjz iconfont-color",
      enable: true
    }, {
    label: "右对齐",
    click: alignHorizontalCenter,
    icon: "icon-color-spy iconfont-color",
    enable: true
  }
  ],
  [
    {
      label: "顶端对齐",
      click: alignLeft,
      icon: "icon-color-czding iconfont-color",
      enable: true
    },
    {
      label: "垂直居中对齐",
      click: alignHorizontalCenter,
      icon: "icon-color-czjz iconfont-color",
      enable: true
    }, {
    label: "底端对齐",
    click: alignHorizontalCenter,
    icon: "icon-color-czd iconfont-color",
    enable: true
  }
  ], [
    {
      label: "水平平均分布",
      click: alignLeft,
      icon: "icon-color-spdjfb iconfont-color",
      enable: true
    },
    {
      label: "垂直平均分布",
      click: alignHorizontalCenter,
      icon: "icon-color-czdjfb iconfont-color",
      enable: true
    }
  ], [
    {
      label: "父元水平直平均分布",
      click: alignLeft,
      icon: "icon-color-fyzsp iconfont-color",
      enable: true
    },
    {
      label: "父元素垂直平均分布",
      click: alignHorizontalCenter,
      icon: "icon-color-fyscz iconfont-color",
      enable: true
    }
  ]
] as DownList[][])

const elementLayerList = reactive([
  [
    {
      label: "置于顶层",
      click: () => {
        elementUp(appStore.currentElement, 999999)
      },
      icon: "icon-color-zydc iconfont-color",
      enable: true
    },
    {
      label: "上移一层",
      click: () => {
        elementUp(appStore.currentElement, 1)
      },
      icon: "icon-color-syyc iconfont-color",
      enable: true
    },
    {
      label: "下移一层",
      click: () => {
        elementDown(appStore.currentElement, 1)
      },
      icon: "icon-color-xyyc iconfont-color",
      enable: true
    },
    {
      label: "置于底层",
      click: () => {
        elementDown(appStore.currentElement, 1)
      },
      icon: "icon-color-zydic iconfont-color",
      enable: true
    },
  ]
] as DownList[][])

const appStore = useAppStoreHook()

const groupEnableIs = computed(() => {
  if (appStore.currentElement.length > 1) {
    return !multipleElementGetValue('groupIs')
  } else {
    return false
  }
})

const ungroupEnableIs = computed(() => {
  if (appStore.currentElement.length > 1) {
    for (let currentElementElement of appStore.currentElement) {
      if (currentElementElement.groupIs) {
        return true
      }
    }
    return false
  } else {
    return false
  }
})

const fontEnableComputed = computed(() => {
  if (appStore.currentElement.length == 0) {
    return false
  }
  for (let currentElementElement of appStore.currentElement) {
    if (!hasStyle(currentElementElement.type, 'fontFamily' as any)) {
      // console.log(props.enableProps, 'false')
      return false
    }
  }
  // console.log(props.enableProps, 'true')
  return true
})

</script>
