<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { cancelRaf, rafTimeout } from '@myprint/design/utils/utils';

// @ts-ignore
interface Props {
    duration?: number; // 自动关闭的延时，单位ms
    top?: number | string; // 消息距离顶部的位置，单位px
}

const props = withDefaults(defineProps<Props>(), {
    duration: 3000,
    top: 30
});

enum ColorStyle { // 颜色主题对象
    info = '#1677FF',
    success = '#52c41a',
    error = '#ff4d4f',
    warning = '#faad14',
    loading = '#1677FF'
}

interface Message {
    content: string;
    mode: string;
}

const resetTimer = ref();
const showMessage = ref<boolean[]>([]);
const hideTimers = ref<any[]>([]);
const messageContent = ref<Message[]>([]);
const messTop = computed(() => {
    if (typeof props.top === 'number') {
        return props.top + 'px';
    }
    return props.top;
});
const clear = computed(() => {
    // 所有提示是否已经全部变为false
    return showMessage.value.every((show) => !show);
});
watch(clear, (to, from) => {
    // 所有提示都消失后重置
    if (!from && to) {
        resetTimer.value = rafTimeout(() => {
            messageContent.value.splice(0);
            showMessage.value.splice(0);
        }, 300);
    }
});

function onEnter(index: number) {
    cancelRaf(hideTimers.value[index]);
}

function onLeave(index: number) {
    onHideMessage(index);
}

function show() {
    cancelRaf(resetTimer.value);
    const index = messageContent.value.length - 1;
    showMessage.value[index] = true;
    onHideMessage(index);
}

function info(content: string) {
    messageContent.value.push({
        content,
        mode: 'info'
    });
    show();
}

function success(content: string) {
    messageContent.value.push({
        content,
        mode: 'success'
    });
    show();
}

function error(content: string) {
    messageContent.value.push({
        content,
        mode: 'error'
    });
    show();
}

function warning(content: string) {
    messageContent.value.push({
        content,
        mode: 'warning'
    });
    show();
}

function loading(content: string) {
    messageContent.value.push({
        content,
        mode: 'loading'
    });
    show();
}

defineExpose({
    info,
    success,
    error,
    warning,
    loading
});
const emit = defineEmits(['close']);

function onHideMessage(index: number) {
    hideTimers.value[index] = rafTimeout(() => {
        showMessage.value[index] = false;
        emit('close');
    }, props.duration);
}
</script>
<template>
    <div class="m-message-wrap" :style="`top: ${messTop};`">
        <TransitionGroup name="slide-fade">
            <div class="m-message" v-show="showMessage[index]" v-for="(message, index) in messageContent" :key="index">
                <div class="m-message-content" @mouseenter="onEnter(index)" @mouseleave="onLeave(index)">
                    <svg
                        class="u-svg"
                        v-if="message.mode === 'info'"
                        :style="{ fill: ColorStyle[message.mode] }"
                        viewBox="64 64 896 896"
                        data-icon="info-circle"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
                        ></path>
                    </svg>
                    <svg
                        class="u-svg"
                        v-if="message.mode === 'success'"
                        :style="{ fill: ColorStyle[message.mode] }"
                        viewBox="64 64 896 896"
                        data-icon="check-circle"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                        ></path>
                    </svg>
                    <svg
                        class="u-svg"
                        v-if="message.mode === 'error'"
                        :style="{ fill: ColorStyle[message.mode] }"
                        viewBox="64 64 896 896"
                        data-icon="close-circle"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
                        ></path>
                    </svg>
                    <svg
                        class="u-svg"
                        v-if="message.mode === 'warning'"
                        :style="{ fill: ColorStyle[message.mode] }"
                        viewBox="64 64 896 896"
                        data-icon="exclamation-circle"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
                        ></path>
                    </svg>
                    <svg
                        class="u-svg circular"
                        v-if="message.mode === 'loading'"
                        :style="{ stroke: ColorStyle[message.mode] }"
                        viewBox="0 0 50 50"
                        focusable="false"
                    >
                        <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
                    </svg>
                    <span class="u-content">{{ message.content }}</span>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
