<template>
    <my-scrollbar class="my-style-design" disabledScrollBar :hover-blod="false">
        <font-family :disabled="fontDisabledComputed" />
        
        <font-size :disabled="fontDisabledComputed" />
        
        <div class="my-style-divider" />
        
        <my-style-icon :tips="i18n('toolbar.style.blob')"
                       props="option.bold"
                       enableProps="bold"
                       class="icon-zitijiacu iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.italic')" props="option.italic" enableProps="italic"
                       class="icon-zitixieti iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.underline')" props="option.underline" enableProps="underline"
                       class="icon-zitixiahuaxian iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.lineThrough')" props="option.lineThrough" enableProps="lineThrough"
                       class="icon-wenben-shanchuxian iconfont cursor-pointer my-style-item" />
        
        <my-color-picker
            :modelValue="multipleElementGetValue('option.color')"
            @update:model-value="(val:any)=>multipleElementSetValue('option.color', val)"
            :disabled="!hasStyle(multipleElementGetValue('type'), 'color')">
            <my-icon class="icon-zitiyanse iconfont"
                     :size="14"
                     style="height: 100%"
                     :disabled="!hasStyle(multipleElementGetValue('type'), 'color')" />
        </my-color-picker>
        <my-color-picker
            :modelValue="multipleElementGetValue('option.background')"
            @update:model-value="(val:any)=>multipleElementSetValue('option.background', val)"
            :disabled="!hasStyle(multipleElementGetValue('type'), 'background')">
            <my-icon class="icon-bucket iconfont"
                     :size="14"
                     style="height: 100%"
                     :disabled="!hasStyle(multipleElementGetValue('type'), 'background')" />
        </my-color-picker>
        <div class="my-style-divider" />
        
        <my-style-icon :tips="i18n('toolbar.style.textAlignLeft')"
                       props="option.textAlign"
                       propsValue="start"
                       class="icon-zuoduiqi iconfont cursor-pointer my-style-item"
                       enableProps="textAlign" />
        <my-style-icon :tips="i18n('toolbar.style.textAlignCenter')"
                       props="option.textAlign"
                       propsValue="center"
                       class="icon-chuizhijuzhong iconfont cursor-pointer my-style-item"
                       enableProps="textAlign" />
        <my-style-icon :tips="i18n('toolbar.style.textAlignRight')"
                       props="option.textAlign"
                       propsValue="end"
                       enableProps="textAlign"
                       class="icon-youduiqi iconfont cursor-pointer my-style-item" />
        
        
        <!--        <style-icon tips="两端对齐" :modelValue="appStore.currentElement.option.textAlign == 'justify'"-->
        <!--                    @update:model-value="flag => {if(flag) appStore.currentElement.option.textAlign = 'justify'}"-->
        <!--                    :enable="['Text', 'Table'].includes(appStore.currentElement.type)">-->
        <!--          <i class="icon-caidan iconfont"/>-->
        <!--        </style-icon>-->
        
        <my-style-icon :tips="i18n('toolbar.style.verticalAlignTop')"
                       props="option.verticalAlign"
                       propsValue="start"
                       enableProps="verticalAlign"
                       class="icon-shangduiqi iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.verticalAlignCenter')"
                       props="option.verticalAlign"
                       propsValue="center"
                       enableProps="verticalAlign"
                       class="icon-shuipingjuzhong iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.verticalAlignBottom')"
                       props="option.verticalAlign"
                       propsValue="end"
                       enableProps="verticalAlign"
                       class="icon-xiaduiqi iconfont cursor-pointer my-style-item" />
        <my-style-icon :tips="i18n('toolbar.style.lineBreak')" marginTop="-3px"
                       props="option.lineBreak"
                       enableProps="lineBreak"
                       class="icon-wenbenhuanhang iconfont cursor-pointer my-style-item" />
        
        <my-style-icon :tips="i18n('toolbar.style.borderAll')"
                       props="option.borderAll"
                       enableProps="borderAll"
                       class="icon-jurassic_border-all iconfont cursor-pointer my-style-item" />
        
        <my-style-icon :tips="i18n('toolbar.style.group')"
                       @click="group()"
                       :disabled="groupDisabledIs"
                       class="icon-color-zh iconfont-color cursor-pointer my-style-item" />
        
        <my-style-icon :tips="i18n('toolbar.style.unGroup')"
                       @click="ungroup()"
                       :disabled="ungroupDisabledIs"
                       class="icon-color-qxzh iconfont-color cursor-pointer my-style-item" />
        
        <tool-icon-popover
            :disabled="!hasStyleByTypeList(multipleElementGetValueList('type') as  elementType[], 'common')">
            <template #reference>
                <my-icon>
                    <i class="icon-color-zydic iconfont-color" />
                </my-icon>
            
            </template>
            <template #panel>
                <element-align :elementAlignList="elementLayerList" />
            </template>
        
        </tool-icon-popover>
        
        <tool-icon-popover
            :disabled="!hasStyleByTypeList(multipleElementGetValueList('type') as  elementType[], 'common')">
            <template #reference>
                <my-icon>
                    <i class="icon-color-spz iconfont-color" />
                </my-icon>
            </template>
            <template #panel>
                <element-align :elementAlignList="elementAlignList" />
            </template>
        
        </tool-icon-popover>
    </my-scrollbar>

</template>

<script setup lang="ts">
import myColorPicker from '../../../components/my/color-picker/my-color-picker.vue';
import MyStyleIcon from '../../../components/my/icon';
import { hasStyle, hasStyleByTypeList } from '../../../constants/common';
import { useAppStoreHook } from '../../../stores/app';
import {
    alignBottom,
    alignHorizontalCenter,
    alignLeft,
    alignRight,
    alignTop,
    alignVerticalCenter,
    arrangeHorizontalSpacing,
    arrangeVerticalSpacing,
    group,
    ungroup
} from '../../../plugins/moveable/moveable';
import {
    elementDown,
    elementUp,
    multipleElementGetValue,
    multipleElementGetValueList,
    multipleElementSetValue
} from '../../../utils/elementUtil';
import { computed, reactive } from 'vue-demi';
import ToolIconPopover from '../../../components/my/icon/tool-icon-popover.vue';
import ElementAlign from '../../../components/content/toolbar/toolbar-style/element-align.vue';
//@ts-ignore
import { DownList, elementType } from '../../../types/entity';
import FontSize from '../../../components/content/toolbar/toolbar-style/font-size.vue';
import FontFamily from '../../../components/content/toolbar/toolbar-style/font-family.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';
import MyScrollbar from '../../../components/my/scrollbar/my-scrollbar.vue';
import { i18n } from '../../../locales';

const elementAlignList = reactive([
    [
        {
            label: i18n('toolbar.style.textAlignLeft'),
            click: alignLeft,
            icon: 'icon-color-spz iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.style.alignHorizontalCenter'),
            click: alignHorizontalCenter,
            icon: 'icon-color-spjz iconfont-color',
            enable: true
        }, {
        label: i18n('toolbar.style.textAlignRight'),
        click: alignRight,
        icon: 'icon-color-spy iconfont-color',
        enable: true
    }
    ],
    [
        {
            label: i18n('toolbar.style.alignTop'),
            click: alignTop,
            icon: 'icon-color-czding iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.style.alignVerticalCenter'),
            click: alignVerticalCenter,
            icon: 'icon-color-czjz iconfont-color',
            enable: true
        }, {
        label: i18n('toolbar.style.alignBottom'),
        click: alignBottom,
        icon: 'icon-color-czd iconfont-color',
        enable: true
    }
    ], [
        {
            label: i18n('toolbar.style.arrangeHorizontalSpacing'),
            click: arrangeHorizontalSpacing,
            icon: 'icon-color-spdjfb iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.style.arrangeVerticalSpacing'),
            click: arrangeVerticalSpacing,
            icon: 'icon-color-czdjfb iconfont-color',
            enable: true
        }
    ]
    // , [
    // {
    //   label: "父元水平直平均分布",
    //   click: alignLeft,
    //   icon: "icon-color-fyzsp iconfont-color",
    //   enable: true
    // },
    // {
    //   label: "父元素垂直平均分布",
    //   click: alignHorizontalCenter,
    //   icon: "icon-color-fyscz iconfont-color",
    //   enable: true
    // }
    // ]
] as DownList[][]);

const elementLayerList = reactive([
    [
        {
            label: i18n('toolbar.layer.top'),
            click: () => {
                elementUp(appStore.currentElement, 999999);
            },
            icon: 'icon-color-zydc iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.layer.up.one'),
            click: () => {
                elementUp(appStore.currentElement, 1);
            },
            icon: 'icon-color-syyc iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.layer.down.one'),
            click: () => {
                elementDown(appStore.currentElement, 1);
            },
            icon: 'icon-color-xyyc iconfont-color',
            enable: true
        },
        {
            label: i18n('toolbar.layer.bottom'),
            click: () => {
                elementDown(appStore.currentElement, 999999);
            },
            icon: 'icon-color-zydic iconfont-color',
            enable: true
        }
    ]
] as DownList[][]);

const appStore = useAppStoreHook();

const groupDisabledIs = computed(() => {
    if (appStore.currentElement.length > 1) {
        const groupIs = multipleElementGetValue('groupIs');
        return groupIs || groupIs == false;
    } else {
        return true;
    }
});

const ungroupDisabledIs = computed(() => {
    if (appStore.currentElement.length > 1) {
        for (let currentElementElement of appStore.currentElement) {
            if (currentElementElement.groupIs) {
                return false;
            }
        }
        return true;
    } else {
        return true;
    }
});

const fontDisabledComputed = computed(() => {
    if (appStore.currentElement.length == 0) {
        return true;
    }
    for (let currentElementElement of appStore.currentElement) {
        if (!hasStyle(currentElementElement.type, 'fontFamily' as any)) {
            return true;
        }
    }
    return false;
});

</script>
