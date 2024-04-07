<template>
    <div class="my-element-wrapper"
         :style="style"
         :class="{
         'dropInIs': element.runtimeOption.dragInIs,
         'design-inactive': !elementHandleStatusList.includes(element.runtimeOption.status) && !elementTypeLineList.includes(element.type),
         'design-activate': elementHandleHandleStatusList.includes(element.runtimeOption.status),
         'design-activate-edit': element.runtimeOption.status == 'HANDLE_EDIT_ING',
       }"
         ref="designRef">
        <element-view :element="element" />
        <table-design v-if="element.type === 'DataTable'" :element="element as any" />
        
        <my-container v-if="element.type === 'PageHeader'" :element="element">
            <element-list :element-list="element.elementList" />
        </my-container>
        <my-container v-else-if="element.type === 'PageFooter'" :element="element">
            <element-list :element-list="element.elementList" />
        </my-container>
        <my-container v-else-if="element.type === 'Container'" :element="element">
            <element-list :element-list="element.elementList" />
        </my-container>
        
        <div class="container-edit-icon" @click="elementEditClick"
             v-if="elementTypeContainerList.includes(element.type)">
            <i class="icon-design-edit iconfont" />
        </div>
        
        <div class="container-move-icon"
             ref="containerMoveIconRef"
             v-if="element.type == 'Container'"
             @mousedown="elementMoveMouseDown($event)">
            <i class="icon-design-move iconfont " />
        </div>
    </div>

</template>

<script setup lang="ts">
import ElementView from '@myprint/design/components/design/element.vue';
import { MyElement } from '@myprint/design/types/entity';
import { computed, CSSProperties, onMounted, ref } from 'vue';
import { MyContainer } from './container';
import ElementList from './elementList.vue';
import {
    elementHandleHandleStatusList,
    elementHandleStatusList,
    elementTypeContainerList, elementTypeLineList
} from '@myprint/design/constants/common';
import TableDesign from '@myprint/design/components/design/data-table/table-design.vue';
import {
    moveableClearDragTarget,
    moveableDragTarget,
    setSelectedTargets
} from '@myprint/design/plugins/moveable/moveable';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';

const designRef = ref();
const containerMoveIconRef = ref();

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});

onMounted(() => {
    props.element.runtimeOption.target = designRef.value;
    designRef.value.element = props.element;
});

const style = computed(() => {
    // console.log(123)
    props.element.runtimeOption.target = designRef.value;
    
    let width = props.element.runtimeOption.init.width;
    let height = props.element.runtimeOption.init.height;
    if (props.element.type == 'DottedVerticalLine' || props.element.type == 'VerticalLine') {
        const lineWidth = unit2px(props.element.option.lineWidth);
        if (width < lineWidth) {
            width = lineWidth;
        }
    }
    if (props.element.type == 'DottedHorizontalLine' || props.element.type == 'HorizontalLine') {
        const lineWidth = unit2px(props.element.option.lineWidth);
        if (height < lineWidth) {
            height = lineWidth;
        }
    }
    
    return {
        left: props.element.runtimeOption.init.x + 'px',
        top: props.element.runtimeOption.init.y + 'px',
        transform: `translate(0px, 0px) rotate(${props.element.runtimeOption.init.runtimeOption.rotate}deg)`,
        width: width + 'px',
        height: height + 'px'
        // maxWidth: widthValueUnit(element),
        // maxHeight: heightValueUnit(element),
    } as CSSProperties;
});

function elementEditClick() {
    setSelectedTargets([props.element.runtimeOption.target]);
}

function elementMoveMouseDown(event: MouseEvent) {
    // console.log(event)
    // let initX = unit2px(props.element.x!), initY = unit2px(props.element.y!);
    // let lastX, lastY;
    let isHandle = true;
    
    if (props.element.runtimeOption.status != 'HANDLE') {
        isHandle = false;
        setSelectedTargets([props.element.runtimeOption.target]);
    }
    moveableDragTarget(containerMoveIconRef.value, event);
    
    // let offsetX = 0, offsetY = 0;
    // function mousemove(ev: MouseEvent) {
    //   // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
    //   // console.log(ev)
    //   const currentX = ev.clientX;
    //   const currentY = ev.clientY;
    //   let offsetX = currentX - lastX;
    //   let offsetY = currentY - lastY;
    //   // lastX = currentX;
    //   // lastY = currentY;
    //
    //   moveableMove(offsetX + initX, offsetY + initY)
    //   clearEventBubble(ev)
    //   // 阻止事件的默认行为，可以解决选中文本的时候拖不动
    //   return false;
    // }
    
    function mouseup(_ev: MouseEvent) {
        if (!isHandle) {
            props.element.runtimeOption.status = 'NONE';
            setSelectedTargets([]);
        }
        moveableClearDragTarget();
        document.removeEventListener('mouseup', mouseup);
    }
    
    document.addEventListener('mouseup', mouseup);
}
</script>
