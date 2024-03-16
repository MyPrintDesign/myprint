<template>
  <div class="cp-element-wrapper"
       :style="style"
       :class="{
         'dropInIs': element.runtimeOption.dragInIs,
         'design-inactive': !elementHandleStatusList.includes(element.runtimeOption.status),
         'design-activate': elementHandleHandleStatusList.includes(element.runtimeOption.status),
         'design-activate-edit': element.runtimeOption.status == 'HANDLE_EDIT_ING',
       }"
       ref="designRef">
    <element-view :element="element"/>
    <table-design v-if="element.type === 'DataTable'" :element="element as any"/>
    
    <cp-container v-if="element.type === 'PageHeader'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    <cp-container v-else-if="element.type === 'PageFooter'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    <cp-container v-else-if="element.type === 'Container'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    
    <div class="container-edit-icon" @click="elementEditClick"
         v-if="elementTypeContainerList.includes(element.type)">
      <i class="icon-design-edit iconfont"/>
    </div>
    
    <div class="container-move-icon"
         ref="containerMoveIconRef"
         v-if="element.type == 'Container'"
         @mousedown="elementMoveMouseDown($event)">
      <i class="icon-design-move iconfont "/>
    </div>
  </div>

</template>

<script setup lang="ts">
import ElementView from "@cp-print/design/components/design/element.vue";
import {CpElement} from "@cp-print/design/types/entity";
import {computed, CSSProperties, onMounted, ref} from "vue";
import {CpContainer} from "./container";
import ElementList from "./elementList.vue";
import {
  elementHandleHandleStatusList,
  elementHandleStatusList,
  elementTypeContainerList
} from "@cp-print/design/constants/common";
import TableDesign from "@cp-print/design/components/design/table/tableDesign.vue";
import {
  moveableClearDragTarget,
  moveableDragTarget,
  setSelectedTargets
} from "@cp-print/design/components/moveable/moveable";

const designRef = ref()
const containerMoveIconRef = ref()

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})

onMounted(() => {
  props.element.runtimeOption.target = designRef.value
  designRef.value.element = props.element
})

const style = computed(() => {
  return {
    left: props.element.runtimeOption.init.x + 'px',
    top: props.element.runtimeOption.init.y + 'px',
    transform: `translate(0px, 0px) rotate(${props.element.runtimeOption.init.runtimeOption.rotate}deg)`,
    width: props.element.runtimeOption.init.width + 'px',
    height: props.element.runtimeOption.init.height + 'px',
    // maxWidth: widthValueUnit(element),
    // maxHeight: heightValueUnit(element),
  } as CSSProperties
})

function elementEditClick() {
  setSelectedTargets([props.element.runtimeOption.target])
}

function elementMoveMouseDown(event: MouseEvent) {
  // console.log(event)
  // let initX = unit2px(props.element.x!), initY = unit2px(props.element.y!);
  // let lastX, lastY;
  let isHandle = true
  
  if (props.element.runtimeOption.status != 'HANDLE') {
    isHandle = false
    setSelectedTargets([props.element.runtimeOption.target])
  }
  moveableDragTarget(containerMoveIconRef.value, event)
  
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
      props.element.runtimeOption.status = 'NONE'
      setSelectedTargets([])
    }
    moveableClearDragTarget()
    document.removeEventListener('mouseup', mouseup);
  }
  
  document.addEventListener('mouseup', mouseup);
}
</script>
