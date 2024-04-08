<template>
    <my-barcode v-if="element.contentType === 'Barcode'" :element="element" />
    <my-qrcode v-else-if="element.contentType === 'QrCode'" :element="element" />
    <div
        v-else
        class="my-print-text_container"
        ref="contentRef"
        :contentEditable="elementHandleEditStatusList.includes(element.runtimeOption.status)"
        v-html="data.content"
        :style="style"
        @input="handleInput"
        @keydown="handleKeydown($event)" />
</template>
<script setup lang="ts">

import { computed, onMounted, watch, ref, reactive } from 'vue';
import { MyElement } from '@myprint/design/types/entity';
import MyBarcode from '@myprint/design/components/design/barcode';
import MyQrcode from '@myprint/design/components/design/qrcode';

import {
    elementCommonStyle,
    formatter
} from '@myprint/design/utils/elementUtil';
import { checkInput, freshMoveableOption } from '@myprint/design/plugins/moveable/moveable';
import { elementHandleEditStatusList } from '@myprint/design/constants/common';

const props = withDefaults(defineProps<{
    element: MyElement
}>(), {
    element: () => ({} as MyElement)
});
const contentRef = ref();
const data = reactive({
    content: '',
    innerContent: ''
});
onMounted(() => {
    data.content = props.element.data;
    data.innerContent = props.element.data;
    if (props.element.data == null) {
        const elementData = formatter(props.element);
        if (elementData != null) {
            props.element.data = elementData;
            data.content = elementData;
            data.innerContent = elementData;
        }
    }
});

function handleKeydown(event: KeyboardEvent) {
    event.stopPropagation();
}

function click(event: MouseEvent) {
    // console.log('focus')
    props.element.runtimeOption.status = 'HANDLE_EDIT_ING';
    
    checkInput();
    
    const x = event.clientX;
    const y = event.clientY;
    // @ts-ignore
    const range = document.caretRangeFromPoint(x, y) || document.caretPositionFromPoint(x, y);
    
    if (range) {
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    contentRef.value.focus();
}

function handleInput(event) {
    // 处理输入事件，更新 content
    props.element.data = event.target.innerHTML;
    data.innerContent = event.target.innerHTML;
}

const style = computed(() => {
    return elementCommonStyle(props.element);
});

watch(() => props.element.runtimeOption.status, (n, _o) => {
    if (contentRef.value == undefined) {
        return;
    }
    if (n == 'HANDLE_ED') {
        // console.log('han')
        contentRef.value.addEventListener('click', click);
    } else {
        contentRef.value.removeEventListener('click', click);
    }
});

watch(() => props.element.data, (_n, _o) => {
    if (data.innerContent !== props.element.data) {
        data.content = props.element.data;
        data.innerContent = props.element.data;
    }
});

watch(() => props.element.contentType, (n, _o) => {
    if (n != 'QrCode') {
        props.element.option.keepRatio = undefined!;
    } else {
        props.element.option.keepRatio = true;
    }
    freshMoveableOption(props.element);
});
// watch(() => props.element.option.formatter, (_n, _o) => {
//   const data = formatter(props.element)
//   console.log(props.element)
//   console.log(_n, _o)
//   console.log(props.element.option.formatter, props.element.data)
//   if (data != null) {
//     props.element.data = data
//   }
// })
</script>
