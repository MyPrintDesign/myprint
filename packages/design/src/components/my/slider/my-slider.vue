<template>
    <div :class="['m-slider', { disabled: disabled }]" ref="slider" :style="`width: ${totalWidth};`">
        <div class="u-slider-rail" @click.self="disabled ? () => false : onClickPoint($event)"></div>
        <div
            class="u-slider-track"
            :class="{ trackTransition: transition }"
            :style="`left: 0; right: auto; width: ${right}px;`" />
        <div
            tabindex="0"
            ref="rightHandle"
            class="m-slider-handle"
            :class="{ handleTransition: transition }"
            :style="`left: ${right}px; right: auto; transform: translate(-50%, -50%);`"
            @mousedown="disabled ? () => false : onRightMouseDown()"
            @blur="tooltip && !disabled ? handlerBlur(rightTooltip) : () => false">
            <div v-if="tooltip" ref="rightTooltip" class="m-handle-tooltip">
                {{ rightValue }}
                <div class="m-arrow"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { cancelRaf, rafTimeout } from '@myprint/design/utils/utils';

const props = withDefaults(defineProps<{
    width?: string | number; // 宽度
    min?: number; // 最小值
    max?: number; // 最大值
    disabled?: boolean; // 是否禁用
    step?: number; // 步长，取值必须大于0，并且可被 (max - min) 整除
    formatTooltip?: (value: number) => string | number; // Slider 会把当前值传给 formatTooltip，并在 Tooltip 中显示 formatTooltip 的返回值
    tooltip?: boolean; // 是否展示 Tooltip
    modelValue?: number | number[]; // (v-model)设置当前取值，当 range 为 false 时，使用 number，否则用 [number, number]
}>(), {
    width: '100%',
    min: 0,
    max: 100,
    disabled: false,
    step: 1,
    formatTooltip: (value: number) => value,
    tooltip: true,
    modelValue: 0
});
const transition = ref(false);
const timer = ref();
const right = ref(0); // 右滑动距离滑动条左端的距离
const slider = ref();
const sliderWidth = ref();
const rightHandle = ref(); // right handler 模板引用
const rightTooltip = ref(); // right tooltip 模板引用
const pixelStep = computed(() => {
    // 滑块移动时的像素步长
    return fixedDigit((sliderWidth.value / (props.max - props.min)) * props.step, 2);
});
const precision = computed(() => {
    // 获取 step 数值精度
    const strNumArr = props.step.toString().split('.');
    return strNumArr[1]?.length ?? 0;
});
const totalWidth = computed(() => {
    if (typeof props.width === 'number') {
        return props.width + 'px';
    } else {
        return props.width;
    }
});
const sliderValue = computed(() => {
    let high: number;
    if (right.value === sliderWidth.value) {
        high = props.max;
    } else {
        high = fixedDigit((right.value / pixelStep.value) * props.step + props.min, precision.value);
        if (props.step > 1) {
            high = Math.round(high / props.step) * props.step;
        }
        high = high > props.max ? props.max : high;
        
    }
    return high;
});
const rightValue = computed(() => {
    return props.formatTooltip(sliderValue.value as number);
});
const emits = defineEmits(['update:modelValue', 'change']);
watch(
    () => props.width,
    () => {
        getSliderWidth();
    },
    {
        flush: 'post'
    }
);
watch(
    () => props.modelValue,
    () => {
        getPosition();
    }
);
watch(sliderValue, (to) => {
    emits('update:modelValue', to);
    emits('change', to);
});
onMounted(() => {
    getSliderWidth();
    getPosition();
});

function checkValue(value: number): number {
    if (value < props.min) {
        return props.min;
    }
    if (value > props.max) {
        return props.max;
    }
    return value;
}

function getSliderWidth() {
    sliderWidth.value = slider.value.offsetWidth;
}

function getPosition() {
    right.value = fixedDigit(((checkValue(props.modelValue as number) - props.min) / props.step) * pixelStep.value, 2);
}

function fixedDigit(num: number, precision: number) {
    return parseFloat(num.toFixed(precision));
}

function handlerBlur(tooltip: HTMLElement) {
    tooltip && tooltip.classList.remove('show-handle-tooltip');
}

function handlerFocus(handler: HTMLElement, tooltip: HTMLElement) {
    handler.focus();
    if (props.tooltip) {
        tooltip.classList.add('show-handle-tooltip');
    }
}

function onClickPoint(e: any) {
    // 点击滑动条，移动滑块
    if (transition.value) {
        cancelRaf(timer.value);
        timer.value = null;
    } else {
        transition.value = true;
    }
    timer.value = rafTimeout(() => {
        transition.value = false;
    }, 300);
    // 元素是absolute时，e.layerX是相对于自身元素左上角的水平位置
    right.value = fixedDigit(Math.round(e.layerX / pixelStep.value) * pixelStep.value, 2); // 鼠标点击位置距离滑动输入条左端的水平距离
    // 单滑块模式
    handlerFocus(rightHandle.value, rightTooltip.value);
}

function onRightMouseDown() {
    // 在滚动条上拖动右滑块
    const leftX = slider.value.getBoundingClientRect().left; // 滑动条左端距离屏幕可视区域左边界的距离
    document.onmousemove = (e: MouseEvent) => {
        if (props.tooltip) {
            rightTooltip.value.classList.add('show-handle-tooltip');
        }
        // e.clientX返回事件被触发时鼠标指针相对于浏览器可视窗口的水平坐标
        const targetX = fixedDigit(Math.round((e.clientX - leftX) / pixelStep.value) * pixelStep.value, 2);
        if (targetX > sliderWidth.value) {
            right.value = sliderWidth.value;
        } else {
            // targetX < left
            right.value = targetX < props.min ? props.min : targetX;
        }
    };
    document.onmouseup = () => {
        if (props.tooltip) {
            rightTooltip.value && rightTooltip.value.classList.remove('show-handle-tooltip');
        }
        document.onmousemove = null;
    };
}
</script>
