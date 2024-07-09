<template>
    <Teleport to="body">
        <div ref="headRef"
             v-show="modelValue"
             class="collapse-panel user-select-none"
             :class="{'disable-collapse-panel-height-duration': data.resizeIs, 'collapse-panel-height-duration': data.loaded}"
             :style="style">
            <div class="collapse-panel-head display-flex">
                <div class="collapse-panel-head-title display-flex" @mousedown="headMouseDown">
                    {{ element.label }}
                    <slot name="head" />
                </div>
                
                <my-icon class="my-handle-panel-icon" @click="clickHead">
                    <ArrowRight class="collapse-panel-head-right-icon" :class="{'is-active': data.show }" />
                </my-icon>
                
                <my-icon class="collapse-panel-head-right-close cursor-pointer" @click="clickHeadClose">
                    <Close class="collapse-panel-head-right-icon" />
                </my-icon>
            
            </div>
            <my-scrollbar height="calc(100% - 24px)" @mousedown="bodyMouseDown">
                <slot />
            </my-scrollbar>
            <div @mousedown="resize" v-if="data.show" class="collapse-panel-resize"></div>
        
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { computed, CSSProperties, nextTick, onMounted, reactive, ref } from 'vue';
import { getCollapsePanelZIndex } from '../../../utils/utils';
import { HandlePanel, HandlePanelPosition } from '../../../types/entity';
import { useAppStoreHook } from '../../../stores/app';
import MyScrollbar from '../../../components/my/scrollbar/my-scrollbar.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';
import ArrowRight from '../../../components/my/icon/icons/ArrowRight.vue';
import Close from '../../../components/my/icon/icons/Close.vue';

export interface Props {
    element?: HandlePanel;
    position: HandlePanelPosition;
    modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    element: () => ({} as HandlePanel),
    position: () => ({} as HandlePanelPosition),
    modelValue: false
});
const appStore = useAppStoreHook();

const emit = defineEmits(['update:modelValue']);

const headRef = ref<HTMLDivElement>()!;
const data = reactive({
    x: 0,
    y: 0,
    right: 0,
    bodyResizeHeight: 0,
    translateX: 0,
    translateY: 0,
    show: true,
    resizeIs: false,
    zIndex: 0,
    loaded: false
});

onMounted(() => {
    data.zIndex = getCollapsePanelZIndex(data.zIndex);
    const boundingClientRect = headRef.value!.getBoundingClientRect();
    const left = boundingClientRect.left;
    const right = boundingClientRect.right;
    data.x = left;
    data.y = right;
    // data.right = document.body.clientHeight - props.element.x
    data.bodyResizeHeight = document.body.clientHeight;
    
    nextTick(() => {
        data.loaded = true;
    });
});

function clickHead() {
    data.show = !data.show;
}

function clickHeadClose() {
    // modelValue.visible = false
    emit('update:modelValue', false);
    // data.show = !data.show
}

const style = computed(() => {
    return {
        right: props.position.x + 'px',
        top: props.position.y + 'px',
        width: props.position.width + 'px',
        zIndex: data.zIndex,
        transform: `translate(${data.translateX}px, ${data.translateY}px)`,
        height: data.show ? `max(100% - ${(data.bodyResizeHeight - props.position.height)}px, 24px)` : '21px'
    } as CSSProperties;
});

function headMouseDown(e: MouseEvent) {
    // useConfigStore1.changeCursor('cursor-move')
    appStore.dataRotation = 'move';
    // data.zIndex = getCollapsePanelZIndex(data.zIndex)
    e.preventDefault();
    const disX = e.clientX;
    const disY = e.clientY;
    
    const clientWidth = document.body.clientWidth - 20;
    const clientHeight = document.body.clientHeight;
    
    let translateXTmp = data.translateX;
    let translateYTmp = data.translateY;
    
    let height = headRef.value!.offsetHeight;
    
    const boundingClientRect = headRef.value!.getBoundingClientRect();
    
    document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        
        // 移动当前元素
        // if (props.element.x + translateXTmp + l < 0) {
        //   data.translateX = -props.element.x
        // } else if (data.right + translateXTmp + l > clientWidth) {
        //   data.translateX = clientWidth - data.right
        // } else {
        //   data.translateX = translateXTmp + l
        // }
        if (boundingClientRect.left + l < 0) {
            data.translateX = translateXTmp - boundingClientRect.left;
        } else if (boundingClientRect.right + l > clientWidth) {
            data.translateX = translateXTmp + clientWidth - boundingClientRect.right;
        } else {
            data.translateX = translateXTmp + l;
        }
        
        if (props.position.y + translateYTmp + t < 0) {
            data.translateY = -props.position.y;
        } else if (props.position.y + height + translateYTmp + t > clientHeight) {
            data.translateY = clientHeight - props.position.y - height;
        } else {
            data.translateY = translateYTmp + t;
        }
        e.preventDefault();
        e.stopPropagation();
    };
    
    document.onmouseup = function(_e) {
        appStore.dataRotation = 'none';
        
        // 记录位置
        props.position.y = props.position.y + data.translateY;
        data.translateY = 0;
        props.position.x = props.position.x - data.translateX;
        data.translateX = 0;
        document.onmousemove = null;
        document.onmouseup = null;
    };
    return false;
}

function bodyMouseDown() {
    data.zIndex = getCollapsePanelZIndex(data.zIndex);
}

function resize(e: MouseEvent) {
    e.preventDefault();
    data.zIndex = getCollapsePanelZIndex(data.zIndex);
    appStore.dataRotation = 'ns-resize';
    data.resizeIs = true;
    const disY = e.clientY;
    let tmpHeight = props.position.height;
    
    document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const t = e.clientY - disY;
        
        props.position.height = tmpHeight + t;
        
        e.preventDefault();
        e.stopPropagation();
    };
    
    
    document.onmouseup = function(_e) {
        appStore.dataRotation = 'none';
        data.resizeIs = false;
        document.onmousemove = null;
        document.onmouseup = null;
    };
    return false;
}

</script>
