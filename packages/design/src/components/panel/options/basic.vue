<template>
    <div class="options">
        <div :class="(data as any).iconClass" class="icon"
             draggable="true"
             @mousedown="dragStart($event)" />
        
        <div class="icon-tip">{{ elementTypeFormat[data.type] }}</div>
        <Teleport v-if="isDrop" to=".design-content">
            <design :element="tmpElement" ref="designRef" />
        </Teleport>
        <Teleport v-if="dragWrapper.visible" to="body">
            <drag-wrapper :data="dragWrapper" />
        </Teleport>
    </div>
</template>
<script setup lang="ts">

import { inject, nextTick, reactive, ref } from 'vue';
import { Container, MyElement, elementTypeFormat, Point, SvgData } from '@myprint/design/types/entity';
import { px2unit, unit2px, unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { panelKey } from '@myprint/design/constants/keys';
import Design from '@myprint/design/components/design/design.vue';
import {
    addElement,
    handleElementType,
    initElement,
    innerElementIs,
    installParentElement
} from '@myprint/design/utils/elementUtil';
import { clearEventBubble } from '@myprint/design/utils/event';
import { dragNewElement, dragNewElementCancel, updatePanel } from '@myprint/design/plugins/moveable/moveable';
import { useAppStoreHook as useAppStore } from '@myprint/design/stores/app';
import DragWrapper from '@myprint/design/components/panel/options/dragWrapper.vue';
import { mouseTips } from '@myprint/design/utils/mouseTips';
import { ActionEnum, record, Snapshot } from '@myprint/design/utils/historyUtil';

const panel = inject(panelKey)!;
const appStore = useAppStore();

const designRef = ref();
const isDrop = ref(false);
const tmpElement = ref({} as MyElement);
const dragWrapper = reactive({
    visible: false,
    transitionAnime: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0
} as Container & { visible: boolean, opacity: number, transitionAnime: boolean });

const props = withDefaults(defineProps<{
    data?: MyElement
}>(), {
    data: () => ({} as MyElement)
});

const padding = 30;

function dragStart(ev: MouseEvent) {
    mouseTips.visible();
    tmpElement.value = JSON.parse(JSON.stringify(props.data));
    const element = tmpElement.value;
    let parentElement: MyElement;
    
    let startX = 0, startY = 0;
    
    if (element.type == 'PageHeader' || element.type == 'PageFooter') {
        element.width = panel.width;
    }
    mouseTips.move(ev.clientX, ev.clientY, '松开取消');
    
    element.width = unit2unit('mm', panel.pageUnit, tmpElement.value.width);
    element.height = unit2unit('mm', panel.pageUnit, tmpElement.value.height);
    if (element.type.startsWith('Svg') && element.data) {
        const data = JSON.parse(element.data) as SvgData;
        const points = data.points as Point[];
        const controlPoints = data.controlPoints as Point[];
        const dataJson = {} as SvgData;
        if (points) {
            for (let point of points) {
                point.x = unit2unit('mm', panel.pageUnit, point.x);
                point.y = unit2unit('mm', panel.pageUnit, point.y);
            }
            dataJson.points = points;
        }
        
        if (controlPoints) {
            for (let point of controlPoints) {
                point.x = unit2unit('mm', panel.pageUnit, point.x);
                point.y = unit2unit('mm', panel.pageUnit, point.y);
            }
            dataJson.controlPoints = controlPoints;
        }
        element.data = JSON.stringify(dataJson);
    }
    
    initElement(element, 0);
    
    let halfWidth = unit2unit('mm', 'px', tmpElement.value.width) / 2;
    let halfHeight = unit2unit('mm', 'px', tmpElement.value.height) / 2;
    
    startX = ev.clientX - halfWidth;
    startY = ev.clientY - halfHeight;
    
    element.x = px2unit(startX - appStore.panelPosition.x + appStore.panelPosition.scrollX - padding);
    element.y = px2unit(startY - appStore.panelPosition.y + appStore.panelPosition.scrollY - padding);
    
    element.runtimeOption.x = unit2px(element.x);
    element.runtimeOption.y = unit2px(element.y);
    
    element.runtimeOption.init.x = element.runtimeOption.x;
    element.runtimeOption.init.y = element.runtimeOption.y;
    
    element.runtimeOption.parent = {} as Container;
    
    dragWrapper.visible = true;
    dragWrapper.opacity = 1;
    
    dragWrapper.x = startX;
    dragWrapper.y = startY;
    
    dragWrapper.width = element.runtimeOption.width;
    dragWrapper.height = element.runtimeOption.height;
    
    isDrop.value = true;
    
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseup);
    clearEventBubble(ev);
    
    nextTick(() => {
        // console.log(designRef.value.$el)
        const myHtmlElement = designRef.value.$el;
        element.runtimeOption.target = myHtmlElement;
        myHtmlElement.element = element;
        dragNewElement(element.runtimeOption.target, ev);
    });
    
    function mouseMove(evMove: MouseEvent) {
        let diffXNum = -evMove.clientX + appStore.panelPosition.x;
        let diffYNum = -evMove.clientY + appStore.panelPosition.y;
        if (diffXNum < 0) {
            diffXNum = 0;
        }
        if (diffYNum < 0) {
            diffYNum = 0;
        }
        
        if (diffXNum <= halfWidth && diffYNum <= halfHeight) {
            if (diffYNum == 0) {
                dragWrapper.opacity = (diffXNum / halfWidth);
            } else if (diffXNum == 0) {
                dragWrapper.opacity = (diffYNum / halfHeight);
            } else {
                dragWrapper.opacity = ((diffXNum / halfWidth) + (diffYNum / halfHeight)) / 2;
            }
        }
        
        dragWrapper.x = element.runtimeOption.x + appStore.panelPosition.x + padding - appStore.panelPosition.scrollX;
        dragWrapper.y = element.runtimeOption.y + appStore.panelPosition.y + padding - appStore.panelPosition.scrollY;
        
        mouseTips.move(dragWrapper.x + halfWidth, dragWrapper.y + halfHeight);
        
        if (diffXNum == 0 && diffYNum == 0) {
            // dragWrapper.visible = false
            // console.log('进入')
            mouseTips.setData('松开放置');
            
            // 判断有没有进入容器/页眉/页脚
            
            const point = { x: element.runtimeOption.x + halfWidth, y: element.runtimeOption.y + halfHeight };
            
            if (!parentElement || !innerElementIs(point, parentElement)) {
                if (parentElement) {
                    parentElement.runtimeOption.dragInIs = false;
                    parentElement = undefined!;
                }
                // console.log('ff')
                if (panel.pageHeader && innerElementIs(point, panel.pageHeader)) {
                    panel.pageHeader.runtimeOption.dragInIs = true;
                    parentElement = panel.pageHeader;
                } else if (panel.pageFooter && innerElementIs(point, panel.pageFooter)) {
                    panel.pageFooter.runtimeOption.dragInIs = true;
                    parentElement = panel.pageFooter;
                } else {
                    for (let elementOf of panel.elementList!) {
                        if (elementOf.type == 'Container' && innerElementIs(point, elementOf)) {
                            elementOf.runtimeOption.dragInIs = true;
                            parentElement = elementOf;
                            break;
                        }
                    }
                }
                if (parentElement) {
                    // console.log('find', parentElement)
                    panel.runtimeOption.dragInIs = false;
                } else {
                    // console.log('dd')
                    panel.runtimeOption.dragInIs = true;
                }
            }
        } else {
            mouseTips.setData('松开取消');
            
            panel.runtimeOption.dragInIs = false;
            // dragWrapper.visible = true
            // console.log('离开')
        }
        
        // dragWrapper.x = evMove.clientX - halfWidth
        // dragWrapper.y = evMove.clientY - halfHeight
        // console.log(element.runtimeOption.x)
        
    }
    
    function mouseup(_ev: MouseEvent) {
        mouseTips.hidden();
        _ev['tmpElement'] = true;
        if (dragWrapper.opacity > 0) {
            // 放回原处
            dragWrapper.opacity = 1;
            if (dragWrapper.x == startX && dragWrapper.y == startY) {
                console.log('==');
                dragWrapper.visible = false;
            } else {
                dragWrapper.transitionAnime = true;
                dragWrapper.x = startX;
                dragWrapper.y = startY;
            }
            dragNewElementCancel(element.runtimeOption.target);
            isDrop.value = false;
        } else {
            dragWrapper.visible = false;
            panel.runtimeOption.dragInIs = false;
            
            if (parentElement) {
                element.x = element.x - parentElement.x;
                element.y = element.y - parentElement.y;
                addElement(parentElement, element);
                parentElement.runtimeOption.dragInIs = false;
                parentElement = undefined!;
            } else {
                handleElementType(element)
                    .handle('PageHeader', () => {
                            if (panel.pageHeader != undefined) {
                                return;
                            }
                            panel.pageHeader = element;
                            element.width = panel.width;
                            element.runtimeOption.width = unit2px(panel.width);
                            element.runtimeOption.x = 0;
                            element.runtimeOption.y = 0;
                            element.x = 0;
                            element.y = 0;
                            // element.y = panel.height - element.height
                            // element.runtimeOption.y = unit2px(panel.height - element.height)
                            installParentElement(panel, element);
                        }
                    )
                    .handle('PageFooter', () => {
                            if (panel.pageFooter != undefined) {
                                return;
                            }
                            panel.pageFooter = element;
                            element.width = panel.width;
                            element.runtimeOption.width = unit2px(panel.width);
                            element.runtimeOption.x = 0;
                            element.x = 0;
                            element.y = panel.height - element.height;
                            element.runtimeOption.y = unit2px(panel.height - element.height);
                            installParentElement(panel, element);
                        }
                    ).end(() => {
                    // if (element.type == 'Table') {
                    //   for (let i = 0; i < element.headList!.length; i++) {
                    //     initElement(element.headList![i], i)
                    //   }
                    // }
                    addElement(panel, element);
                });
                // console.log(panel)
            }
            
            // 记录历史
            record(<Snapshot>{
                type: 'Element',
                action: ActionEnum.ADD,
                elementList: [element]
            });
            
            nextTick(() => {
                // setSelectedTargets()
                updatePanel([element]);
                setTimeout(() => {
                    isDrop.value = false;
                }, 1);
            });
        }
        
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseup);
        
        
        // console.log(false)
        // dragDataValueStore.data.dragIng = false
    }
    
    // isDrop.value = true
    // dragDataValueStore.data.dragIng = true
    // const tmpElement = JSON.parse(JSON.stringify(props.data))
    //
    // tmpElement.width = unit2unit('mm', panel.pageUnit, tmpElement.width)
    // tmpElement.height = unit2unit('mm', panel.pageUnit, tmpElement.height)
    // dragDataValueStore.set('element', tmpElement)
    // mitt.emit('optionsDragStart', ev)
    // dragImg(panel, tmpElement, ev)
}

</script>
