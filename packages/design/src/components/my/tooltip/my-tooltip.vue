<template>
    <div class="reference"
         ref="referenceRef"
         @click.stop.prevent="togglePopperShow">
        <slot name="reference"></slot>
    </div>
    <teleport to="body">
        <div class="my-tooltip_content"
             ref="contentRef"
             v-show="data.visible">
            <slot></slot>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { createPopper } from '@popperjs/core';
import { onClickOutside } from '@vueuse/core';
//@ts-ignore
import { Placement } from '@popperjs/core/lib/enums';

const props = withDefaults(defineProps<{
    disabled?: boolean
    placement?: Placement
}>(), {
    placement: 'top'
});

const data = reactive({
    visible: false
});


// const emit = defineEmits(['update:visible', 'hide', 'show']);

const referenceRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
let popperInstance: any = null;
// 创建 popper 实例
const createPopperInstance = () => {
    popperInstance = createPopper(referenceRef.value!, contentRef.value!, {
        modifiers: [
            {
                name: 'offset',
                options: {
                    // 偏移值 左右，上下
                    offset: [0, 10]
                }
            },
            {
                name: 'arrow',
                options: {
                    element: '.popper-arrow'
                }
            }
        ],
        // placement: props.placement
    });
    nextTick(() => {
        // 异步更新
        popperInstance.update();
    });
};


// 销毁 popper 实例
const destroyPopperInstance = () => {
    popperInstance?.destroy?.();
    popperInstance = null;
};

watch(() => data.visible, (visible, _o) => {
    if (visible) {
        createPopperInstance();
        // emit('show');
    } else {
        // emit('hide');
    }
});

onMounted(() => {
    createPopperInstance();
    contentRef.value!.style.minWidth = referenceRef.value!.offsetWidth + 'px';
});

onUnmounted(() => {
    destroyPopperInstance();
});
let stopHandle: ReturnType<typeof onClickOutside>;

const togglePopperShow = () => {
    
    if (props.disabled) {
        return;
    }
    
    if (data.visible) {
        // close
        onClose();
    } else {
        if (stopHandle == null) {
            stopHandle = onClickOutside(contentRef, () => {
                data.visible = false;
            }, {
                ignore: [referenceRef]
            });
        }
        data.visible = true;
    }
};

function onClose() {
    stopHandle?.();
    stopHandle = null! as any;
    data.visible = false;
}

watch(
    () => data.visible,
    (val) => {
        if (!val) {
            onClose();
        }
    },
    {
        flush: 'post'
    }
);
</script>
