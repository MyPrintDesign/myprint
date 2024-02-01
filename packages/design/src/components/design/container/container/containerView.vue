<template>
  <cp-drop
      @drop="drop"
      class="design-container"
      :class="{
          'cp-print-container_over': data.dropOver
        }"
      @dragover="dragover"
      @dragleave="dragleave">
    <div class="container-edit-icon" @click="test">
      <i class="icon-design-edit iconfont"/>
    </div>
    <div class="container-move-icon"
         ref="containerMoveIconRef"
         v-if="element.type == 'Container'"
         @mousedown="mousedown($event)">
      <i class="icon-design-move iconfont "/>
    </div>
    <slot/>
  </cp-drop>
</template>

<script setup lang="ts">
import {DragWrapper, CpElement} from "@cp-print/design/types/entity";
import {onMounted, reactive} from "vue";
import CpDrop from "@cp-print/design/components/cp/drop";
import {px2unit, unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {addElement} from "@cp-print/design/utils/elementUtil";
import {
  moveableClearDragTarget,
  moveableDragTarget,
  moveableMove,
  setSelectedTargets
} from "@cp-print/design/components/moveable/moveable";
import {clearEventBubble} from "@cp-print/design/utils/event";
import {ref} from "vue-demi";

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
const containerMoveIconRef = ref()
// const mitt = inject(mittKey)
const data = reactive({
  dropOver: false
})

onMounted(() => {

})

function test() {
  setSelectedTargets([props.element.runtimeOption.target])
}

function mousedown(event: MouseEvent) {
  console.log(event)
  // let initX = unit2px(props.element.x!), initY = unit2px(props.element.y!);
  // let lastX, lastY;
  let isHandle = true
  
  if (props.element.status != 'HANDLE') {
    isHandle = false
    setSelectedTargets([props.element.runtimeOption.target])
  }
  moveableDragTarget(containerMoveIconRef.value, event)
  
  // lastX = event.clientX;
  // lastY = event.clientY;
  setTimeout(()=>{
  
  }, 1)
  
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
      props.element.status = 'NONE'
      setSelectedTargets([])
    }
    moveableClearDragTarget()
    // document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    // ev.stopPropagation()
  }
  
  // document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup);
  // clearEventBubble(event)
}

function drop(dragData: DragWrapper) {
  console.log("页脚拖放")
  // 计算位置
  console.log(dragData.element)
  const dragElement = dragData.element
  
  dragElement.x = px2unit(dragData.end.x! - dragData.start.x!)
  dragElement.y = px2unit(dragData.end.y! - dragData.start.y!)
  addElement(props.element, dragElement)
  
  data.dropOver = false
}

function dragover(msg: string) {
  console.log(msg)
  
  data.dropOver = true
}

function dragleave(msg: string) {
  console.log(msg)
  data.dropOver = false
}


// function dropPreventDefault(dragData: DragWrapper) {
//   const element = dragData.element
//   if (['PageHeader', 'PageFooter'].includes(element.type)) {
//     return false
//   }
//   return true
// }

// watch(() => element.height, (n, o) => {
//   console.log(element.height)
// })
</script>

<style scoped>
.design-container {
  z-index: 0;
  width: 100%;
  height: 100%;
}

.container-edit-icon {
  position: absolute;
  text-align: center;
  display: inline-block;
  line-height: 1;
  
  right: 0;
  color: white;
  width: 16px;
  height: 16px;
  transform: translate(calc(100% + 5px), 0px);
}

.container-move-icon {
  position: absolute;
  text-align: center;
  
  display: inline-block;
  line-height: 1;
  
  right: 0;
  color: white;
  width: 16px;
  height: 16px;
  transform: translate(calc(100% + 5px), 18px);
}

.container_over {
  z-index: 1;
  outline: 4px solid var(--drag-h-color);
}
</style>
