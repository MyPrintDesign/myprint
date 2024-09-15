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
import { computed, reactive, ref, watch } from 'vue-demi';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { _defaultNum } from '@myprint/design/utils/numberUtil';
import { elementCommonStyle, getRecursionParentPanel } from '@myprint/design/utils/elementUtil';

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
    
    try {
        // 计算条形码每个条的宽度
        // const numBars = props.element.data.length * 7; // 条形码的条数，根据条码类型会有所不同
        // const barWidth = unit2px(props.element.width, getRecursionParentPanel(props.element)) / numBars;
        const codeLength = props.element.data.length;
        let numBars: number;
        
        // 根据不同的条形码类型设置条数
        switch (props.element.option.barCodeType) {
            case 'EAN2':
                numBars = 20;
                break;
            case 'EAN5':
                numBars = 47;
                break;
            case 'EAN8':
                numBars = 67;
                break;
            case 'EAN13':
            case 'UPC':
                numBars = 95;
                break;
            case 'UPC_E':
                numBars = 57;
                break;
            case 'ITF':
                numBars = codeLength * 3;
                break;
            case 'ITF14':
                numBars = 94;
                break;
            case 'CODE39':
            case 'codabar':
                numBars = codeLength * 12;
                break;
            case 'CODE128':
            case 'CODE128A':
            case 'CODE128B':
            case 'CODE128C':
                numBars = codeLength * 11;
                break;
            case 'pharmacode':
                numBars = codeLength * 10;
                break;
            case 'MSI':
            case 'MSI10':
            case 'MSI11':
            case 'MSI1010':
            case 'MSI1110':
                numBars = codeLength * 2.5;
                break;
            default:
                numBars = codeLength * 7;  // 默认设置
        }
        
        const barWidth = unit2px(props.element.width, getRecursionParentPanel(props.element)) / numBars;
        
        JsBarcode(barCode.value, props.element.data, {
            format: props.element.option.barCodeType,//选择要使用的条形码类型
            width: barWidth, //设置条之间的宽度
            height: unit2px(props.element.height, getRecursionParentPanel(props.element)) - (props.element.option.barCodeDisplayValIs ? _defaultNum(props.element.option.fontSize, 10) : 0),//高度
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
        data.errorMsg = '不支持的内容';
    }
    
}, { immediate: true });
</script>
