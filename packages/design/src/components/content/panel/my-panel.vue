<template>
    <div class="design-panel user-select-none">
        <div class="display-flex">
            <my-icon style="min-width: 20px; height: 20px" @click="clickAuxiliaryLineVisible"
                 class="cursor-pointer iconfont "
                 :class="[auxiliaryLineVisible? 'icon-yanjing_xianshi_o' :'icon-yanjing_yincang_o']" />
            <rule :direction="highlightRule.horizontal.direction"
                  :length="panel.width"
                  :auxiliaryLineVisible="auxiliaryLineVisible"
                  :highlight="highlightRule.horizontal.highlight"
                  :scroll="highlightRule.horizontal.scroll" />
        </div>
        <div class="display-flex design-content_inner"
             tabindex="0">
            <rule :direction="highlightRule.vertical.direction"
                  :length="panel.height"
                  :auxiliaryLineVisible="auxiliaryLineVisible"
                  :highlight="highlightRule.vertical.highlight"
                  :scroll="highlightRule.vertical.scroll" />
            <div class="affix-container design-content-scroll " @scroll="scroll" @wheel="wheel"
                 ref="designScrollRef">
                <div class="design-content design-content-bg"
                     ref="designContentRef"
                     :style="{transformOrigin: 'left top',
                          transform: 'scale('+scaleUtil.miniMap.scale+')',
                            minWidth: valueUnit(panel.width),
                            width: valueUnit(panel.width),
                            height: valueUnit(panel.height),
                           }"
                     :class="{'dropInIs': panel.runtimeOption.dragInIs}">
                    <design v-if="panel.pageHeader != undefined" :element="panel.pageHeader" />
                    <design v-if="panel.pageFooter != undefined" :element="panel.pageFooter" />
                    <element-list :elementList="panel.elementList" />
                </div>
            </div>
            
            <auxiliary-line :element="item" :key="item.id"
                            :scroll-x="highlightRule.horizontal.scroll"
                            :scroll-y="highlightRule.vertical.scroll"
                            v-for="(item) in panel.auxiliaryLineList" />
            
            <template v-if="auxiliaryLineVisible">
                <auxiliary-line tmp :element="appStore.auxiliaryLineTmp" v-if="appStore.auxiliaryLineTmp.x != null" />
            </template>
        </div>
    </div>

</template>

<script setup lang="ts">
import Rule from '../../../components/my/rule/rule.vue';
import { scaleUtil } from '../../../utils/scaleUtil';
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue-demi';
import { Container, ContentScaleVo, MyElement } from '../../../types/entity';
import { record, Snapshot } from '../../../utils/historyUtil';
import { getCurrentPanel, handle, none, valueUnit } from '../../../utils/elementUtil';
import { useAppStoreHook as useAppStore } from '../../../stores/app';
import ElementList from '../../../components/design/element-list.vue';
import { mountedKeyboardEvent, unMountedKeyboardEvent } from '../../../utils/keyboardUtil';
import { changeDragSnapIs, initMoveable, updatePanel } from '../../../plugins/moveable/moveable';
import Design from '../../../components/design/design.vue';
import { initSelecto, selecto } from '../../../plugins/moveable/selecto';
import AuxiliaryLine from '../../../components/design/auxiliary/auxiliary-line.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';
import { mitt } from '../../../utils/utils';

const panel = getCurrentPanel();
const designContentRef = ref<InstanceType<any>>();
const appStore = useAppStore();
const contentScale = reactive({
    openIs: false
} as ContentScaleVo);
const auxiliaryLineVisible = ref(true);
let resizeObserver: ResizeObserver;
const highlightRule = reactive({
    horizontal: {
        direction: 'horizontal',
        highlight: { x: undefined! as number, width: 0 } as Container,
        scroll: 0
    },
    vertical: {
        direction: 'vertical',
        highlight: { x: undefined! as number, width: 0 } as Container,
        scroll: 0
    }
});

const designScrollRef = ref<HTMLElement>()!;
// 事件绑定
mitt.on('elementClick', elementClick);
mitt.on('scaleEvent', scaleEvent);
mitt.on('panelSnapshot', panelSnapshot);
mitt.on('updatePanel', updatePanel);
mitt.on('triggerScroll', updatePanel);
mitt.on('scaleMove', scaleMove);

onMounted(() => {
    // 挂载键盘事件
    mountedKeyboardEvent();
    nextTick(() => {
        initSelecto();
        initMoveable(selecto.value, highlightRule);
    });
    mitt.emit('minimapViewportSize', {
        width: designScrollRef.value!.clientWidth,
        height: designScrollRef.value!.clientHeight
    } as Container);
    // console.log(designScrollRef.value!.clientWidth)
    // 创建 ResizeObserver 实例
    resizeObserver = new ResizeObserver((_entries) => {
        // entries 是 ResizeObserverEntry 对象的数组
        mitt.emit('minimapViewportSize', {
            width: designScrollRef.value!.clientWidth,
            height: designScrollRef.value!.clientHeight
        } as Container);
    });
    resizeObserver.observe(designScrollRef.value!);
    
    const rect = designScrollRef.value!.getBoundingClientRect();
    panel.runtimeOption.target = designContentRef.value
    appStore.panelPosition = { x: rect.x, y: rect.y, scrollX: 0, scrollY: 0 };
});
onUnmounted(() => {
    resizeObserver.disconnect();
    unMountedKeyboardEvent();
});

function clickAuxiliaryLineVisible() {
    auxiliaryLineVisible.value = !auxiliaryLineVisible.value;
    for (let myAuxiliaryLine of panel.auxiliaryLineList) {
        myAuxiliaryLine.runtimeOption.auxiliaryLineStatus = auxiliaryLineVisible.value ? 'SHOW' : 'HIDDEN';
    }
    changeDragSnapIs();
}

/**
 * 滑动事件
 */
function scroll(_scrollData: any) {
    highlightRule.horizontal.scroll = designScrollRef.value!.scrollLeft;
    highlightRule.vertical.scroll = designScrollRef.value!.scrollTop;
    mitt.emit('minimapViewportScroll', {
        x: designScrollRef.value!.scrollLeft,
        y: designScrollRef.value!.scrollTop
    } as Container);
    
    appStore.panelPosition.scrollX = designScrollRef.value!.scrollLeft;
    appStore.panelPosition.scrollY = designScrollRef.value!.scrollTop;
}

function wheel(event: any) {
    event.preventDefault(); // 阻止默认滚动行为
    
    // 更新滚动位置
    designScrollRef.value!.scrollTop += event.deltaY;
    designScrollRef.value!.scrollLeft += event.deltaX;
    
    mitt.emit('minimapViewportScroll', {
        x: designScrollRef.value!.scrollLeft,
        y: designScrollRef.value!.scrollTop
    } as Container);
    
    appStore.panelPosition.scrollX = designScrollRef.value!.scrollLeft;
    appStore.panelPosition.scrollY = designScrollRef.value!.scrollTop;
}

/**
 * minimap 的 移动事件
 */
function scaleMove(data: any) {
    // console.log('move', data.x, data.y)
    designScrollRef.value!.scrollTo(data.x, data.y);
}

function panelSnapshot(snapshot: Snapshot) {
    // console.log(123)
    // console.log(action)
    if (!snapshot.type) {
        snapshot.type = 'PANEL';
    }
    record(snapshot);
}

function elementClick(element: MyElement) {
    // console.log('elementClick')
    // console.log('鼠标点击', element)
    contentScale.openIs = true;
    none(panel.pageHeader);
    none(panel.pageFooter);
    elementListNone();
    handle(element);
}


function scaleEvent() {
    let mmDiv = document.createElement('div');
    designContentRef.value.appendChild(mmDiv);
    nextTick(() => {
        designContentRef.value.removeChild(mmDiv);
        // scrollbarRef.value.update()
    });
}

function elementListNone() {
    for (let valueElement of panel.elementList!) {
        none(valueElement);
    }
}
</script>
