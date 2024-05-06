<template>
    <div class="content-scale"
         :class="{run: appStore.currentElement.id == null}">
        
        <div class="scale-preview" ref="scalePreviewRef"
             v-if="configStore.settingPanel.miniMap.visible"
             @mousedown="mousedown($event)">
            <div class="scale-design-content"
                 ref="designContentRef"
                 :style="{
        left : data.miniMap.x+'px',
        top :data.miniMap.y+'px',
        transformOrigin: '0% 0%',
                            width: scaleUtil.scale(data.width)+ 'px',
                            height: scaleUtil.scale(data.height)+'px',
                            scale: data.scale
                           }">
                
                <div style="position: absolute;"
                     v-for="(element, index) in panel.elementList"
                     :key="index"
                     class="pointer-events"
                     :style="{left : valueUnit(element.x), top: valueUnit(element.y), width: valueUnit(element.width), height: valueUnit(element.height)}">
                    <MyText v-if="element.type == 'Text'" :element="element" />
                    <MyImage v-if="element.type === 'Image'" :element="element" />
                    <data-table v-if="element.type === 'DataTable'" :element="element" />
                    <MyRect v-if="element.type === 'Rect'" :element="element" />
                    <my-horizontal-line v-if="element.type === 'HorizontalLine'" :element="element" />
                    <my-vertical-line v-if="element.type === 'VerticalLine'" :element="element" />
                    <my-dotted-horizontal-line v-if="element.type === 'DottedHorizontalLine'" :element="element" />
                    <my-dotted-vertical-line v-if="element.type === 'DottedVerticalLine'" :element="element" />
                </div>
            
            </div>
            
            <div class="viewport" :style="viewportStyle" />
        </div>
        
        <div class="mini-map-toolbar display-flex">
            <div class="mini-map-toolbar_redo-undo display-flex">
                <div @mousedown="($event)=>$event.stopPropagation()" @click="undoPanel"
                     :class="[{'my-icon-disabled': !canUndo}]"
                     class="my-icon iconfont icon-undo mini-map-toolbar-icon" />
                <div @mousedown="($event)=>$event.stopPropagation()" @click="redoPanel"
                     :class="[{'my-icon-disabled': !canRedo}]"
                     class="my-icon iconfont icon-redo mini-map-toolbar-icon" />
            </div>
            
            <div class="mini-map-toolbar_control display-flex">
                <!--        <div>手势</div>-->
                <div class="display-flex space-between width-100-p mini-map-toolbar_control_scale">
                    <tip-icon tips="缩小" @click="startScale(-0.1)"
                              class="icon-suoxiao iconfont mini-map-toolbar-icon" />
                    <div class="mini-map-toolbar_control_ratio">
                        {{ MathCalc.mul(scaleUtil.miniMap.scale, 100) }}%
                    </div>
                    <tip-icon tips="放大" @click="startScale(0.1)"
                              class="icon-fangda iconfont mini-map-toolbar-icon" />
                    <tip-icon tips="导航" :modelValue="configStore.settingPanel.miniMap.visible"
                              @update:model-value="flag => configStore.settingPanel.miniMap.visible = flag"
                              class="icon-map iconfont mini-map-toolbar-icon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mittKey, panelKey } from '@myprint/design/constants/keys';
import { computed, inject, reactive, ref } from 'vue';
import MyHorizontalLine from '@myprint/design/components/design/shape/line/horizontalLine';
import MyRect from '@myprint/design/components/design/shape/rect/rect';
import MyDottedHorizontalLine from '@myprint/design/components/design/shape/line/dottedHorizontalLine';
import MyVerticalLine from '@myprint/design/components/design/shape/line/verticalLine';
import MyDottedVerticalLine from '@myprint/design/components/design/shape/line/dottedVerticalLine';
import MyImage from '@myprint/design/components/design/image';
import MyText from '@myprint/design/components/design/text';
import DataTable from '@myprint/design/components/design/data-table/data-table.vue';
import { Container, ContentScaleVo } from '@myprint/design/types/entity';
import { clearEventBubble } from '@myprint/design/utils/event';
import MathCalc from '@myprint/design/utils/numberUtil';
import { scaleUtil } from '@myprint/design/utils/scaleUtil';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { valueUnit } from '@myprint/design/utils/elementUtil';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { useConfigStore } from '@myprint/design/stores/config';
import { canRedo, canUndo, redoPanel, undoPanel } from '@myprint/design/utils/historyUtil';
import TipIcon from '@myprint/design/components/my/icon/tip-icon.vue';

const appStore = useAppStoreHook();
const configStore = useConfigStore();
const designContentRef = ref<HTMLDivElement>();
const panel = inject(panelKey)!;
const mitt = inject(mittKey)!;
const data = reactive({
    viewport: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0,
    miniMap: {
        x: 0,
        y: 0
    },
    scale: 0,
    openIs: true
} as ContentScaleVo);
mitt.on('minimapViewportSize', minimapViewportSize);
mitt.on('minimapViewportScroll', minimapViewportScroll);

function minimapViewportSize(size: Container) {
    data.viewport.width = size.width;
    data.viewport.height = size.height;
}

function minimapViewportScroll(size: Container) {
    data.viewport.x = size.x;
    data.viewport.y = size.y;
}

mitt.on('changePageSize', changePageSize);

function changePageSize() {
    data.width = unit2px(panel.width);
    data.height = unit2px(panel.height);
    let widthCalc = (scaleContainerWidth) / (data.width);
    let heightCalc = (scaleContainerHeight) / data.height;
    let min = Math.min(widthCalc, heightCalc);
    min = min / scaleUtil.miniMap.scale;
    data.scale = min;
    
    data.miniMap.width = data.width * min;
    data.miniMap.height = data.height * min;
    data.miniMap.x = (scaleContainerWidth - data.miniMap.width) / 2;
    data.miniMap.y = (scaleContainerHeight - data.miniMap.height) / 2;
}

const scaleContainerWidth = 260;
const scaleContainerHeight = 160;

const viewportStyle = computed(() => {
    
    const style = {} as any;
    const viewport = data.viewport;
    
    let w = viewport.width - 10;
    let h = viewport.height;
    let x = viewport.x;
    let y = viewport.y;
    
    let viewportWidth = Math.min((w * data.scale), data.miniMap.width);
    let t = x * data.scale + data.miniMap.x + viewportWidth;
    // console.log(x * data.scale, data.miniMap.x, viewportWidth)
    if (t > 260) {
        t = 260 - viewportWidth;
    } else {
        t = t - viewportWidth;
    }
    // console.log(t)
    style['left'] = t + 'px';
    style['top'] = data.miniMap.y + y * data.scale + 'px';
    style['width'] = viewportWidth + 'px';
    style['height'] = Math.min((h - 1) * data.scale, data.miniMap.height) + 'px';
    return style;
});

function mousedown(ev: MouseEvent) {
    const tmpX = ev.clientX;
    const tmpY = ev.clientY;
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    appStore.dataRotation = 'move';
    
    let offsetScrollX = ev.offsetX - data.viewport.width / 2;
    let offsetScrollY = ev.offsetY - data.viewport.height / 2;
    
    mitt.emit('scaleMove', { x: offsetScrollX, y: offsetScrollY });
    
    function mousemove(ev: MouseEvent) {
        let offsetX = (ev.clientX - tmpX) / data.scale + offsetScrollX;
        let offsetY = (ev.clientY - tmpY) / data.scale + offsetScrollY;
        
        mitt.emit('scaleMove', { x: offsetX, y: offsetY });
        clearEventBubble(ev);
        return true;
    }
    
    function mouseup(ev: MouseEvent) {
        clearEventBubble(ev);
        
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        // // 鼠标按下，计算当前元素距离可视区的距离
        // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
        appStore.dataRotation = 'none';
        return false;
    }
    
    clearEventBubble(ev);
    return true;
}

function startScale(scale: number) {
    scaleUtil.miniMap.scale = MathCalc.sum(scaleUtil.miniMap.scale, scale);
    changePageSize();
}
</script>
