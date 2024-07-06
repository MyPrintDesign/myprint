<template>
    <component :is="tag" ref="scrollbar" :style="{maxHeight : height, height: height}" class="ps">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { Ref } from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';

export type PerfectScrollbarEmitsKeys =
    | 'scroll'
    | 'ps-scroll-y'
    | 'ps-scroll-x'
    | 'ps-scroll-up'
    | 'ps-scroll-down'
    | 'ps-scroll-left'
    | 'ps-scroll-right'
    | 'ps-y-reach-start'
    | 'ps-y-reach-end'
    | 'ps-x-reach-start'
    | 'ps-x-reach-end'

export type PerfectScrollbarEmits = {
    [EventName in PerfectScrollbarEmitsKeys]: [value: Event]
}

const props = withDefaults(defineProps<{
        tag?: string
        height?: string
        options?: any
    }>(),
    {
        tag: 'div',
        height: '100%',
        options: () => ({})
    }
);

const emit = defineEmits<PerfectScrollbarEmits>();
const scrollbar = ref<HTMLElement>()!;
const ps: Ref = ref()!;

watch(
    () => props.options,
    () => {
        destroyInstance();
        createInstance();
    },
    { deep: true }
);

onMounted(() => {
    if (scrollbar.value) {
        createInstance();
    }
});

onBeforeUnmount(() => {
    destroyInstance();
});

function createInstance() {
    nextTick(() => {
        if (scrollbar.value) {
            // @ts-ignore
            ps.value = new PerfectScrollbar(scrollbar.value, props.options);
            toggleListeners();
            setTimeout(() => {
                ps.value.update();
            }, 200);
        }
    });
}

function destroyInstance() {
    if (ps.value) {
        toggleListeners(false);
        ps.value.destroy();
        ps.value = null!;
    }
}

const eventListeners: Record<
    PerfectScrollbarEmitsKeys,
    (event: Event) => void
> = {
    scroll: createEventListener('scroll'),
    'ps-scroll-y': createEventListener('ps-scroll-y'),
    'ps-scroll-x': createEventListener('ps-scroll-x'),
    'ps-scroll-up': createEventListener('ps-scroll-up'),
    'ps-scroll-down': createEventListener('ps-scroll-down'),
    'ps-scroll-left': createEventListener('ps-scroll-left'),
    'ps-scroll-right': createEventListener('ps-scroll-right'),
    'ps-y-reach-start': createEventListener('ps-y-reach-start'),
    'ps-y-reach-end': createEventListener('ps-y-reach-end'),
    'ps-x-reach-start': createEventListener('ps-x-reach-start'),
    'ps-x-reach-end': createEventListener('ps-x-reach-end')
};

function createEventListener(eventName: PerfectScrollbarEmitsKeys) {
    return function(event: Event) {
        emit(eventName as any, event);
    };
}

function toggleListeners(addListeners: boolean = true) {
    if (!ps.value?.element) {
        return;
    }
    
    Object.entries(eventListeners).forEach(([eventName, listener]) => {
        if (addListeners) {
            ps.value?.element.addEventListener(eventName, listener);
        } else {
            ps.value?.element.removeEventListener(eventName, listener);
        }
    });
}

defineExpose({
    ps
});
</script>
<style>
@import 'perfect-scrollbar/css/perfect-scrollbar.css';

.ps {
    position: relative;
}
</style>
