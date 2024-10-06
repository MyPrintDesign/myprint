<template>
    <div class="my-popover_reference"
         :class="[props.class]"
         ref="referenceRef"
         @mouseenter="mouseenter"
         @mouseleave="mouseleave"
         @click.stop.prevent="togglePopperShow">
        <slot name="reference"></slot>
    </div>
    <teleport to=".my-popover_container">
        <div class="my-popover_content"
             ref="contentRef"
             :style="styles"
             v-show="data.visible">
            <slot></slot>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue-demi';
import { createPopper, detectOverflow, Modifier, State } from '@popperjs/core';
import { onClickOutside } from '@vueuse/core';
//@ts-ignore
import { Placement } from '@popperjs/core/lib/enums';
import { fromPairs } from 'lodash';

defineExpose({ close });
const emit = defineEmits(['show']);

const props = withDefaults(defineProps<{
    disabled?: boolean
    placement?: Placement
    trigger?: 'hover' | 'click'
    class?: string
}>(), {
    placement: 'top',
    trigger: 'hover'
});

const data = reactive({
    visible: false
});

const referenceRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
let popperInstance: any = null;
const styles = ref({});

function deriveState(state: State) {
    const elements = Object.keys(state.elements) as unknown as Array<
        keyof State['elements']
    >;
    
    const styles = fromPairs(
        elements.map(
            (element) =>
                [element, state.styles[element] || {}] as [
                    string,
                    State['styles'][keyof State['styles']]
                ]
        )
    );
    
    const attributes = fromPairs(
        elements.map(
            (element) =>
                [element, state.attributes[element]] as [
                    string,
                    State['attributes'][keyof State['attributes']]
                ]
        )
    );
    
    return {
        styles,
        attributes
    };
}

const stateUpdater = {
    name: 'updateState',
    enabled: true,
    phase: 'write',
    fn: ({ state }) => {
        if (!data.visible) {
            return;
        }
        
        const sss = detectOverflow(state, {
            // elementContext: 'reference', // 'popper' by default
        });
        console.log(sss);
        const derivedState = deriveState(state);
        // console.log(derivedState);
        Object.assign(styles.value, derivedState.styles.popper);
        // console.log(state.elements.popper);
        // const rect = state.elements.popper.getBoundingClientRect();
        // console.log(styles.value);
        // console.log(state.elements.popper.offsetLeft);
        // const scroll = state.scrollParents.reference[0];
        // console.log(scroll);
        // const scrollElementRect = (scroll as Element).getBoundingClientRect();
        // console.log(scrollElementRect);
        // console.log(document.body.clientWidth, rect.x + rect.width, styles.value.transform, rect);
        // console.log(scrollElementRect.right, rect.right);
        // if (scrollElementRect.right < rect.right) {
        //     //
        //     console.log(scrollElementRect.right);
        //
        //     // styles.value['transform'] = `translate3d(0px, 309px, 0)`;
        // }
        //
        
        // console.log(derivedState);
        // Object.assign(states.value, derivedState)
    },
    requires: ['computeStyles']
} as Modifier<'updateState', any>;

// 创建 popper 实例
const createPopperInstance = () => {
    popperInstance = createPopper(referenceRef.value!, contentRef.value!, {
        modifiers: [
            {
                name: 'preventOverflow',
                options: {
                    altAxis: true,
                    mainAxis: true,
                    tether: false
                    // boundary: document, // true by default
                    // rootBoundary: document // true by default
                }
            },
            {
                name: 'flip',
                enabled: false,
                options: {
                    fallbackPlacements: ['top', 'right']
                }
            },
            {
                name: 'offset',
                options: {
                    // 偏移值 左右，上下
                    offset: [0, 10]
                }
            },
            // stateUpdater,
            {
                name: 'arrow',
                options: {
                    element: '.popper-arrow'
                }
            }
            // { name: 'applyStyles', enabled: false }
        
        ],
        placement: props.placement
    });
    nextTick(() => {
        // 异步更新
        if (popperInstance != null) {
            popperInstance.update();
        }
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
    // contentRef.value!.style.minWidth = referenceRef.value!.offsetWidth + 'px';
});

onUnmounted(() => {
    destroyPopperInstance();
});
let stopHandle: ReturnType<typeof onClickOutside>;

function mouseenter() {
    if (props.trigger != 'hover') {
        return;
    }
    show();
}

function mouseleave() {
    if (props.trigger != 'hover') {
        return;
    }
    close();
}

const togglePopperShow = () => {
    if (props.trigger != 'click') {
        return;
    }
    if (props.disabled) {
        return;
    }
    
    if (data.visible) {
        // close
        onClose();
    } else {
        if (stopHandle == null) {
            stopHandle = onClickOutside(contentRef, () => {
                close();
            }, {
                ignore: [referenceRef]
            });
        }
        show();
    }
};

function onClose() {
    stopHandle?.();
    stopHandle = null! as any;
    data.visible = false;
}

function close() {
    onClose();
}

function show() {
    emit('show');
    data.visible = true;
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
