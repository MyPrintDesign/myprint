<template>
  <td
      ref="columnRef"
      class="cp-print-columnHead"
      @drop="drop($event)"
      @dragover="dragover($event)"
      :draggable="!element.option.disableSort"
      @dragstart.native="dragStart"
      @mousedown="mousedown($event)"
      :class="{cursorMove: element.option.disableSort}"
      :style="headStyle"
      @dragleave="dragleave($event)">
    <div
        class="cp-print-columnHead__content"
        :style="headContentStyle"
    >{{ element.label }}
    </div>
    <div v-show="data.sortTipLine" class="sort-tips-line" :style="sortTipLineStyle"/>
  </td>
  <!--  删除按钮-->
</template>
<script setup lang="ts">

import {computed, inject, PropType, reactive, ref, CSSProperties} from "vue";
import {DragWrapper, Element} from "../../../types/entity";
import {clearEventBubble} from "../../../utils/event";
import {dragDataStore} from "../../../stores/dragStore";
import {mittKey} from "../../../constants/keys";
import {elementCommonStyle, valueUnit} from "../../../utils/elementUtil";

const mitt = inject(mittKey)

const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

const data = reactive({
  sortTipLine: null
})

const columnRef = ref()
const dragDataValueStore = dragDataStore()
const sortTipLineStyle = computed(() => {
  const tmp = {} as CSSProperties
  if (data.sortTipLine == 'left') {
    tmp.left = '-1px'
  } else {
    tmp.right = '-1px'
  }
  return tmp
})

const headStyle = computed(() => {
  return {
    maxWidth: valueUnit(props.element.width),
    width: valueUnit(props.element.width),
    height: valueUnit(props.element.height)
  }
})

const headContentStyle = computed(() => {
  return elementCommonStyle(props.element)
})

function drop(ev) {
  // 判断排序
  clearTip(ev)
  let dragData = dragDataValueStore.data as DragWrapper;
  // console.log(dragData.element)
  let column = dragData.element
  if (props.element?.option?.disableSort) return
  if (props.element === column) return
  mitt.emit('sortColumn', {
    dragData: dragData.element,
    b: props.element,
    flag: column?.option!.sort > props.element?.option?.sort
  })
}

function dragover(ev) {
  let dragData = dragDataValueStore.data as DragWrapper;
  let column = dragData.element
  ev.preventDefault()
  ev.stopPropagation()
  
  if (props.element.option.disableSort) return
  if (props.element === column) return
  if (column.option.sort < props.element.option.sort) {
    data.sortTipLine = 'right'
  } else {
    data.sortTipLine = 'left'
  }
}

function dragleave(ev) {
  clearTip(ev)
}

function clearTip(ev) {
  data.sortTipLine = null
  clearEventBubble(ev)
}

function mousedown(ev) {
  // console.log('down', ev)
  if (props.element.option.disableSort) {
    return
  }
  ev.stopPropagation()
}

function dragStart() {
  dragDataValueStore.set('column', props.element)
}
</script>
//outline: 1px solid black; border: 1px solid #000;

//outline: 1px solid black; border: 1px solid #000;

<style scoped>

.cursorMove {
  cursor: move;
}

</style>
