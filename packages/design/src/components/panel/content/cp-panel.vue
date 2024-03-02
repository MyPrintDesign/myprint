<template>
  <div class="design-panel drag user-select-none">
    <div class="display-flex">
      <div style="min-width: 20px; height: 20px"/>
      <rule :direction="highlightRule.horizontal.direction"
            :length="panel.width"
            :highlight="highlightRule.horizontal.highlight"
            :scroll="highlightRule.horizontal.scroll"/>
    </div>
    <div class="display-flex" style="height: calc(100% - 20px)">
      <rule :direction="highlightRule.vertical.direction"
            :length="panel.height"
            :highlight="highlightRule.vertical.highlight"
            :scroll="highlightRule.vertical.scroll"/>
      <!--    <el-watermark :content="panel.w :style="{
            minWidth: valueUnit(scaleUtil.scale(panel.width)),
            width: valueUnit(scaleUtil.scale(panel.width)),
            height: valueUnit(scaleUtil.scale(panel.height)),
          }"watermark?panel.watermarkContent:''">-->
      
      <div class="affix-container design-panel-container-width " @scroll="scroll" @wheel="wheel"
           ref="designScrollRef">
        <div class="design-content design-content-bg"
             :style="{transformOrigin: 'left top',
                          transform: 'scale('+scaleUtil.miniMap.scale+')',
                            minWidth: valueUnit(panel.width),
                            width: valueUnit(panel.width),
                            height: valueUnit(panel.height),
                           }">
          <!--         @mousedown="mousedown($event)"-->
          <design v-if="panel.pageHeader != null" :element="panel.pageHeader"/>
          <design v-if="panel.pageFooter != null" :element="panel.pageFooter"/>
          
          <element-list :elementList="panel.elementList"/>
          <!--      <span-->
          <!--          class="ref-line v-line"-->
          <!--          v-for="(item, index) in vLine"-->
          <!--          :key="'v_' + index"-->
          <!--          v-show="item.display"-->
          <!--          :style="{-->
          <!--          left: item.position,-->
          <!--          top: item.origin,-->
          <!--          height: item.lineLength-->
          <!--        }"-->
          <!--      />-->
          <!--      <span-->
          <!--          class="ref-line h-line"-->
          <!--          v-for="(item, index) in hLine"-->
          <!--          :key="'h_' + index"-->
          <!--          :style="{-->
          <!--          top: item.position,-->
          <!--          left: item.origin,-->
          <!--          width: item.lineLength-->
          <!--        }"-->
          <!--      />-->
          <!--    选择框    -->
          <!--        <SelectRect v-if="visible.selectRect" :element="selectRectElement"/>-->
          <!--    拖拽矩形    -->
          <!--        <vue-drag v-if="defaultDragRectElement.x != null" :element="defaultDragRectElement">-->
          <!--          <DragRect :element="defaultDragRectElement"/>-->
          <!--        </vue-drag>-->
          <!--    对齐辅助线    -->
          <!--        <align-line v-for="(element, index) in alignLineDataList" :data="element" :key="index"/>-->
          
          
        </div>
      </div>
      
<!--      <cp-drop-->
<!--          ref="designContentRef"-->
<!--          class="design-content-drop"-->
<!--          :class="{'design-content_over': data.dropOver}"-->
<!--          @drop="drop"-->
<!--          @dragover="dragover"-->
<!--          @dragleave="dragleave"-->
<!--          @preventDefault="dropPreventDefault"-->
<!--      >-->
<!--        -->
<!--      </cp-drop>-->
      
      <!--    </el-watermark>-->
    
    </div>
  </div>

</template>

<script setup lang="ts">
// import { ElWatermark } from 'element-plus'
// import {ElScrollbar} from 'element-plus'
import Rule from "../rule.vue";
// import {computedAlign} from "@/utils/alignUtil";
import {scaleUtil} from "@cp-print/design/utils/scaleUtil";
import {inject, nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {ContentScaleVo, DragWrapper, CpElement, Container} from "@cp-print/design/types/entity";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
// import {clearEventBubble} from "@cp-print/design/utils/event";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {canMoveStatusList, defaultDragRectElement} from "@cp-print/design/constants/common";
import {record, Snapshot} from "@cp-print/design/utils/historyUtil";
import {
  computeTranslate,
  handle,
  // initElement,
  initPanelDiv,
  none,
  removeElement,
  // rotatedPoint,
  // select,
  // setCurrentElement,
  valueUnit
} from "@cp-print/design/utils/elementUtil";
import {useAppStoreHook as useAppStore} from "@cp-print/design/stores/app";

// import CpDrop from "@cp-print/design/components/cp/drop";
import ElementList from "../../design/elementList.vue";
import {mountedKeyboardEvent, unMountedKeyboardEvent} from "@cp-print/design/utils/keyboardUtil";
import {
  updatePanel,
  initMoveable
} from "@cp-print/design/components/moveable/moveable";
import Design from "@cp-print/design/components/design/design.vue";
// import {onUpdated} from "vue-demi";
import {initSelecto, selecto} from "@cp-print/design/components/moveable/selecto";

const panel = inject(panelKey)!
const mitt = inject(mittKey)!
// const vLine = ref([])
// const hLine = ref([])


const designScrollRef = ref<HTMLElement>()!

// function getRefLineParams(params:any) {
//   const {vLine: vLine1, hLine: hLine1} = params;
//   // console.log(vLine1, hLine1)
//   vLine.value = vLine1;
//   hLine.value = hLine1;
// }

// 事件绑定
mitt.on('elementClick', elementClick)
// mitt.on('elementMove', elementMove)
mitt.on('elementUp', elementUp)
mitt.on('elementRemove', elementRemove)
mitt.on("scaleEvent", scaleEvent)
mitt.on("panelSnapshot", panelSnapshot)
mitt.on('updatePanel', updatePanel)
mitt.on('triggerScroll', updatePanel)

/**
 * 滑动事件
 */
function scroll(_scrollData: any) {
  // console.log(scrollData)
  // console.log(scrollData)
  highlightRule.horizontal.scroll = designScrollRef.value!.scrollLeft
  highlightRule.vertical.scroll = designScrollRef.value!.scrollTop
  mitt.emit('minimapViewportScroll', {
    x: designScrollRef.value!.scrollLeft,
    y: designScrollRef.value!.scrollTop
  } as Container)
  // data.scroll.left = scrollData.scrollLeft
  // data.scroll.top = scrollData.scrollTop
}

function wheel(event: any) {
  // console.log(event)
  event.preventDefault(); // 阻止默认滚动行为
  
  // 更新滚动位置
  designScrollRef.value!.scrollTop += event.deltaY;
  designScrollRef.value!.scrollLeft += event.deltaX;
  
  mitt.emit('minimapViewportScroll', {
    x: designScrollRef.value!.scrollLeft,
    y: designScrollRef.value!.scrollTop
  } as Container)
  
  // console.log(scrollData)
  // highlightRule.horizontal.scroll = scrollData.scrollLeft
  // highlightRule.vertical.scroll = scrollData.scrollTop
  // data.scroll.left = scrollData.scrollLeft
  // data.scroll.top = scrollData.scrollTop
}

const highlightRule = reactive({
  horizontal: {
    length: 'horizontal',
    direction: 'horizontal',
    highlight: {x: undefined, width: 0} as Container,
    scroll: 0,
  },
  vertical: {
    direction: 'vertical',
    highlight: {x: undefined, width: 0} as Container,
    scroll: 0,
  },
})
// 辅助线
const alignLineDataList = reactive<CpElement[]>([])
const designContentRef = ref<InstanceType<any>>()
// const elScrollbar = ref<InstanceType<typeof ElScrollbar>>()
const appStore = useAppStore()
// console.log($t('menus.home'))
// const selectRectElement = reactive(<Element>{
//   width: 0,
//   height: 0
// })
// const configStoreData = configStore()
// console.log(configStoreData.data.unit)
// const selectPoint = {
//   x: 0,
//   y: 0,
//   clientX: null,
//   clientY: null
// } as any
const data = reactive({
  dropOver: false,
  scroll: {
    left: 0,
    top: 0
  }
})
// const visible = reactive({
//   selectRect: false,
//   dragRect: false,
// })
const contentScale = reactive({
  openIs: false
} as ContentScaleVo)

onMounted(() => {
  // 挂载键盘事件
  // mountedKeyboardEvent()
  initSelecto()
  // updatePanel()
  initMoveable(selecto.value, highlightRule
      //     , {
      //   onTriggerScroll: onTriggerScroll
      // }
  )
  mitt.emit('minimapViewportSize', {
    width: designScrollRef.value!.clientWidth - 290,
    height: designScrollRef.value!.clientHeight - 80
  } as Container)
  
  const rect = designScrollRef.value!.getBoundingClientRect()
  appStore.panelPosition = {x: rect.x, y: rect.y}
  
})

// onBeforeUpdate(() => {
//   console.log('onBeforeUpdate')
// })
// onUpdated(() => {
//   console.log('onUpdated')
// })

onUnmounted(() => {
  unMountedKeyboardEvent()
})

// function computedSelection() {
//   // console.log('computedSelection')
//   let isShowDragRect = false
//   none(panel.pageHeader)
//   none(panel.pageFooter)
//   const startPoint = {x: 999999, y: 999999} as Point
//   const endPoint = {x: 0, y: 0} as Point
//
//   for (let valueElement of panel.elementList!) {
//     const left = valueElement.runtimeOption.bounds.left
//     const top = valueElement.runtimeOption.bounds.top
//     const right = valueElement.runtimeOption.bounds.right
//     const bottom = valueElement.runtimeOption.bounds.bottom
//     if (left >= selectRectElement.x! && top >= selectRectElement.y!
//         && right < selectRectElement.x! + selectRectElement.width
//         && bottom < selectRectElement.y! + selectRectElement.height) {
//       select(valueElement)
//
//       // 计算 拖拽矩形
//       isShowDragRect = true
//       startPoint.x = Math.min(startPoint.x!, left)
//       startPoint.y = Math.min(startPoint.y!, top)
//       endPoint.x = Math.max(endPoint.x!, right)
//       endPoint.y = Math.max(endPoint.y!, bottom)
//     } else {
//       none(valueElement)
//     }
//   }
//
//   selectRectElement.width = 0
//   selectRectElement.height = 0
//   if (isShowDragRect) {
//     defaultDragRectElement.x = startPoint.x
//     defaultDragRectElement.y = startPoint.y
//     defaultDragRectElement.width = endPoint.x! - startPoint.x!
//     defaultDragRectElement.height = endPoint.y! - startPoint.y!
//     selectRemove(defaultDragRectElement)
//   } else {
//     defaultDragRectElement.x = undefined
//     defaultDragRectElement.width = 0
//     defaultDragRectElement.height = 0
//   }
//
//   visible.dragRect = isShowDragRect
// }

function drop(dragData: any) {
  // let elementStr = ev.dataTransfer.getData('element');
  // console.log(dragData)
  console.log('drop')
  data.dropOver = false
  if (dragData.type == 'column') {
    return
  }
  let element = dragData.element as CpElement
  
  element.x = px2unit(dragData.end.x - dragData.start.x)
  element.y = px2unit(dragData.end.y - dragData.start.y)
  // initElement(element)
  
  
  // elementListNone()
  handle(element)
  updatePanel()
  
  // record(<Snapshot>{elementList: element, action: ActionEnum.ADD})
}

function panelSnapshot(snapshot: Snapshot) {
  // console.log(123)
  // console.log(action)
  if (!snapshot.type) {
    snapshot.type = 'PANEL'
  }
  record(snapshot)
}

function dragover(ev: DragEvent) {
  console.log(ev)
  data.dropOver = true
  // todo 高亮拖放位置
  // const dragDataValueStore = dragDataStore()
  // let dragData = dragDataValueStore.data as DragWrapper;
  // if (dragData.type != 'element') {
  //   return
  // }
  
  // ev.target.toggleAttribute('over', true);
  // ev.preventDefault()
  // console.log('allowDrop', event)
}

function dragleave(_ev: DragEvent) {
  data.dropOver = false
  
  // ev.target.toggleAttribute('over', false);
  // console.log('dragleave', ev)
}

// function mousedown(ev: MouseEvent) {
//   if (ev.defaultPrevented) {
//     // 执行父组件的 mousedown 事件逻辑
//     return
//   }
//   // console.log(ev)
//   selectPoint.x = ev.offsetX
//   selectPoint.y = ev.offsetY
//   selectPoint.clientX = ev.clientX
//   selectPoint.clientY = ev.clientY
//
//   selectRectElement.x = selectPoint.x
//   selectRectElement.y = selectPoint.y
//
//   function mousemove(ev: MouseEvent) {
//     // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
//     visible.selectRect = true
//     // console.log(ev.clientX, ev.offsetX, ev.clientY, ev.offsetY, ev)
//     //计算需要移动的距离
//     let offsetX = scaleUtil.scaleDiv(px2unit(ev.clientX - selectPoint.clientX))
//     let offsetY = scaleUtil.scaleDiv(px2unit(ev.clientY - selectPoint.clientY))
//     let x = px2unit(selectPoint.x)
//     let y = px2unit(selectPoint.y)
//     selectRectElement.x = Math.min(x, x + offsetX)
//     selectRectElement.y = Math.min(y, y + offsetY)
//
//     selectRectElement.width = Math.abs(offsetX)
//     selectRectElement.height = Math.abs(offsetY)
//
//     clearEventBubble(ev)
//     // 阻止事件的默认行为，可以解决选中文本的时候拖不动
//     return false;
//   }
//
//   function mouseup(ev: MouseEvent) {
//
//     // console.log('鼠标抬起')
//     setCurrentElement(defaultElement)
//
//     visible.selectRect = false
//     defaultDragRectElement.runtimeOption.parent = panel
//     contentScale.openIs = false
//     computedSelection()
//     document.removeEventListener('mousemove', mousemove);
//     document.removeEventListener('mouseup', mouseup);
//     ev.stopPropagation()
//   }
//
//   document.addEventListener('mousemove', mousemove)
//   document.addEventListener('mouseup', mouseup);
//   clearEventBubble(ev)
// }

function elementClick(element: CpElement) {
  // console.log('elementClick')
  // console.log('鼠标点击', element)
  if (element.type == 'PrivateDragRectElement') {
    return
  }
  contentScale.openIs = true
  // setCurrentElement(element)
  none(panel.pageHeader)
  none(panel.pageFooter)
  elementListNone()
  handle(element)
  // contentScaleRef.fresh()
}

// function elementMove(element: CpElement) {
//   // let element = point.element as Element;
//   if (element.runtimeOption.status == 'NONE') {
//     elementListNone()
//     select(element)
//   }
//
//   // 寻找对齐的位置
//   // computedAlign(point, alignLineDataList, props.panel.elementList)
//
//   // 高亮尺子刻度
//   // highlightRule.horizontalLeft = mm2px(element.x + point.offsetX)
//   // highlightRule.horizontalRight = mm2px(element.x + point.offsetX + element.width)
//   // highlightRule.verticalLeft = mm2px(element.y + point.offsetY)
//   // highlightRule.verticalRight = mm2px(element.y + point.offsetY + element.height)
//
//   // console.log(point)
//   for (let valueElement of panel.elementList!) {
//     if (canMoveStatusList.includes(valueElement.runtimeOption.status)) {
//       // console.log(valueElement)
//       valueElement.translateX = element.translateX
//       valueElement.translateY = element.translateY
//     }
//   }
//
//   // defaultDragRectElement.translateX = point.offsetX
//   // defaultDragRectElement.translateY = point.offsetY
// }

function elementUp() {
  // console.log(point)
  const elementList: Array<CpElement> = []
  for (let valueElement of panel.elementList!) {
    if (canMoveStatusList.includes(valueElement.runtimeOption.status)) {
      elementList.push(valueElement)
    }
  }
  
  for (let valueElement of elementList) {
    computeTranslate(valueElement)
    
    // rotatedPoint(valueElement)
  }
  
  computeTranslate(defaultDragRectElement as CpElement)
  
  // let action = ActionEnum.MOVE
  // if (elementList.length > 1) {
  //   action = ActionEnum.BATCH_MOVE
  // }
  // record(<Snapshot>{
  //   type: 'PANEL',
  //   action: action,
  //   panel: panel
  // })
  // console.log(history)
  
  alignLineDataList.length = 0
}

function dropPreventDefault(dragData: DragWrapper) {
  const element = dragData.element
  if (element.type == 'PageHeader') {
    if (panel.pageHeader != null) {
      return false
    }
  } else if (element.type == 'PageFooter') {
    if (panel.pageFooter != null) {
      return false
    }
  }
  return true
}

function scaleEvent() {
  let mmDiv = document.createElement("div");
  designContentRef.value.appendChild(mmDiv)
  nextTick(() => {
    designContentRef.value.removeChild(mmDiv)
    // scrollbarRef.value.update()
  })
}

function elementRemove(element: CpElement) {
  // console.log(element)
  removeElement(element)
  
  // record(<Snapshot>{elementList: element, action: ActionEnum.REMOVE})
}

function elementListNone() {
  for (let valueElement of panel.elementList!) {
    none(valueElement)
  }
}

watch([() => panel.width, () => panel.height], (_w, _h) => {
  // console.log(stringify(panel, 'parent', 'runtimeOption'))
  nextTick(() => {
    initPanelDiv(panel, designScrollRef.value)
  })
  
})

// const moveableRef = ref();
// const selectoRef = ref();

</script>
