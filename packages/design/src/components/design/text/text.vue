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
import { MyElement } from '../../../types/entity';
import MyBarcode from '../../../components/design/barcode';
import MyQrcode from '../../../components/design/qrcode';

import {
    elementCommonStyle,
    formatter
} from '../../../utils/elementUtil';
import { checkInput, freshMoveableOption, moveableEditing } from '../../../plugins/moveable/moveable';
import { elementHandleEditStatusList } from '../../../constants/common';
import { br2n, n2br } from '../../../utils/utils';

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
// console.log(props.element);

onMounted(() => {
    // console.log(props.element);
    data.content = n2br(props.element.data);
    data.innerContent = data.content;
    if (props.element.data == null) {
        const elementData = formatter(props.element);
        if (elementData != null) {
            props.element.data = elementData;
            // console.log(props.element.data);
            data.content = n2br(elementData);
            data.innerContent = elementData;
        }
    }
});

function handleKeydown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
        // &zwnj;
        document.execCommand('insertHTML', false, '<br>&zwnj;');
        
        event.preventDefault();
        
    }
    event.stopPropagation();
}

function click(event: MouseEvent) {
    props.element.runtimeOption.status = 'HANDLE_EDIT_ING';
    
    checkInput();
    
    moveableEditing();
    
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

function handleInput(event: any) {
    // 处理输入事件，更新 content
    props.element.data = br2n(event.target.innerHTML);
    data.innerContent = props.element.data;
    // console.log(props.element.data);
    
}

const style = computed(() => {
    return elementCommonStyle(props.element);
});


watch(() => props.element.runtimeOption.status, (n, _o) => {
    if (contentRef.value == undefined) {
        return;
    }
    if (n == 'HANDLE_ED') {
        contentRef.value.addEventListener('dblclick', click);
    } else {
        contentRef.value.removeEventListener('dblclick', click);
    }
});

watch(() => props.element.data, (_n, _o) => {
    if (data.innerContent !== props.element.data) {
        data.content = n2br(props.element.data);
        data.innerContent = data.content;
        // console.log(data.content);
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

<style lang="scss" scoped>

//.read-write-plaintext-only { //纯文本
//    -webkit-user-modify: read-write-plaintext-only;
//
//}
</style>
