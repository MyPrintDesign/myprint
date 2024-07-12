<template>
    <div class="display-flex"
         :style="style">
        <div v-if="data.errorMsg">{{ data.errorMsg }}</div>
        <svg v-show="!data.errorMsg" ref="barCode"></svg>
    </div>

</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode';
import { MyElement } from '@myprint/design/types/entity';
import { computed, reactive, ref, watch } from 'vue';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { _defaultNum } from '@myprint/design/utils/numberUtil';
import { elementCommonStyle, getParentPanel } from '@myprint/design/utils/elementUtil';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

const barCode = ref();
const data = reactive({
    errorMsg: undefined as string | undefined
});

const style = computed(() => {
    return elementCommonStyle(props.element);
});

watch([() => barCode.value, () => props.element.data, () => props.element.option.barCodeType, () => props.element.height, () => props.element.option.fontSize,
    () => props.element.option.color, () => props.element.option.background, () => props.element.option.barCodeDisplayValIs], (_n, _o) => {
    data.errorMsg = undefined;
    if (barCode.value == null) {
        return;
    }
    if (!props.element.option.barCodeType) {
        props.element.option.barCodeType = 'CODE128';
    }
    
    // console.log(123)
    try {
        JsBarcode(barCode.value, props.element.data, {
            format: props.element.option.barCodeType,//选择要使用的条形码类型
            width: 1,//设置条之间的宽度
            height: unit2px(props.element.height, getParentPanel(props.element)) - (props.element.option.barCodeDisplayValIs ? _defaultNum(props.element.option.fontSize, 10) + 5 : 0),//高度
            displayValue: props.element.option.barCodeDisplayValIs,//是否在条形码下方显示文字
            //   text:"456",//覆盖显示的文本
            //   fontOptions:"bold italic",//使文字加粗体或变斜体
            //   font:"fantasy",//设置文本的字体
            //   textAlign:"left",//设置文本的水平对齐方式
            //   textPosition:"top",//设置文本的垂直位置
            textMargin: 0,//设置条形码和文本之间的间距
            fontSize: _defaultNum(props.element.option.fontSize, 10),//设置文本的大小
            background: props.element.option.background,//设置条形码的背景
            lineColor: props.element.option.color,//设置条和文本的颜色。
            margin: 0//设置条形码周围的空白边距
        });
        
    } catch (e) {
        console.log('错误');
        data.errorMsg = '不支持的内容';
    }
    
}, { immediate: true });
</script>
