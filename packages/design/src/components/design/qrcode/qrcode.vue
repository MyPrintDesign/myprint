<template>
    <div class="display-flex"
         :style="style">
        <img ref="qrCode" id="qrCode" alt="" :src="src" />
    </div>
</template>

<script setup lang="ts">
import { MyElement } from '../../../types/entity';
import { computed, nextTick, ref, watch } from 'vue-demi';
import { unit2px } from '../../../utils/devicePixelRatio';
import QRCode from 'qrcode';
import { displayDesign, elementCommonStyle, getRecursionParentPanel } from '../../../utils/elementUtil';
import { updateMoveableRect } from '../../../plugins/moveable/moveable';
import {throttle} from 'lodash';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

const qrCode = ref();
const src = ref();

const style = computed(() => {
    return elementCommonStyle(props.element);
});

function freshQrCode(resetHeight: boolean) {
    if (qrCode.value == null) {
        return;
    }
    if (props.element.data == null) {
        return;
    }
    if (props.element.data == '') {
        return;
    }
    QRCode.toDataURL(props.element.data, {
        // version: 1,
        errorCorrectionLevel: 'Q', // low, medium, quartile, high or L, M, Q, H
        maskPattern: 7, // 0, 1, 2, 3, 4, 5, 6, 7
        margin: 0, // Define how much wide the quiet zone should be
        scale: 4,
        width: unit2px(Math.min(props.element.width, props.element.height), getRecursionParentPanel(props.element)), // 宽度
        color: {
            light: props.element.option.background, // 背景色
            dark: props.element.option.color // 二维码颜色
        }
    }, (error, url) => {
        if (error) {
            console.error(error);
            return;
        }
        
        src.value = url;
    });
    
    if (resetHeight && props.element.runtimeOption.workEnvironment !== 'DataTable') {
        props.element.height = props.element.width;
        props.element.runtimeOption.height = props.element.runtimeOption.width;
        props.element.runtimeOption.init.height = props.element.runtimeOption.width;
        if (displayDesign(props.element)) {
            nextTick(() => {
                updateMoveableRect();
            });
        }
    }
}

const freshQrCodeThrottle = throttle((resetHeight: boolean) => {
    freshQrCode(resetHeight);
}, 100);

watch([() => qrCode.value, () => props.element.data, () => props.element.option.color, () => props.element.option.background], (_n, _o) => {
    if (displayDesign(props.element)) {
        freshQrCodeThrottle(true);
    } else {
        freshQrCode(true);
    }
}, { immediate: true });

watch([() => props.element.width, () => props.element.height], (_n, _o) => {
    if (displayDesign(props.element)) {
        freshQrCodeThrottle(false);
    } else {
        freshQrCode(false);
    }
}, { immediate: true });
</script>
