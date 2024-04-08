<template>
  <div class="design-panel user-select-none">
    <div class="display-flex">
      <div style="min-width: 20px; height: 20px"/>
      <rule :direction="highlightRule.horizontal.direction"
            :length="panel.width"
            :highlight="highlightRule.horizontal.highlight"
            :scroll="highlightRule.horizontal.scroll"/>
    </div>
    <div class="display-flex design-content_inner">
      <rule :direction="highlightRule.vertical.direction"
            :length="panel.height"
            :highlight="highlightRule.vertical.highlight"
            :scroll="highlightRule.vertical.scroll"/>
      <div class="affix-container design-content-scroll " @scroll="scroll" @wheel="wheel"
           ref="designScrollRef">
        <div class="design-content design-content-bg"
             :style="{transformOrigin: 'left top',
                          transform: 'scale('+scaleUtil.miniMap.scale+')',
                            minWidth: valueUnit(panel.width),
                            width: valueUnit(panel.width),
                            height: valueUnit(panel.height),
                           }"
             :class="{'dropInIs': panel.runtimeOption.dragInIs}">
          <design v-if="panel.pageHeader != undefined" :element="panel.pageHeader"/>
          <design v-if="panel.pageFooter != undefined" :element="panel.pageFooter"/>
          <element-list :elementList="panel.elementList"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import Rule from '@myprint/design/components/my/rule/rule.vue';
import { scaleUtil } from '@myprint/design/utils/scaleUtil';
import { inject, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Container, ContentScaleVo, MyElement } from '@myprint/design/types/entity';
import { mittKey, panelKey } from '@myprint/design/constants/keys';
import { canMoveStatusList } from '@myprint/design/constants/common';
import { record, Snapshot } from '@myprint/design/utils/historyUtil';
import { handle, none, removeElement, valueUnit } from '@myprint/design/utils/elementUtil';
import { useAppStoreHook as useAppStore } from '@myprint/design/stores/app';
import ElementList from '@myprint/design/components/design/elementList.vue';
import { mountedKeyboardEvent, unMountedKeyboardEvent } from '@myprint/design/utils/keyboardUtil';
import { initMoveable, updatePanel } from '@myprint/design/plugins/moveable/moveable';
import Design from '@myprint/design/components/design/design.vue';
import { initSelecto, selecto } from '@myprint/design/plugins/moveable/selecto';

const panel = inject(panelKey)!
const mitt = inject(mittKey)!
// 辅助线
const alignLineDataList = reactive<MyElement[]>([])
const designContentRef = ref<InstanceType<any>>()
const appStore = useAppStore()
const contentScale = reactive({
  openIs: false
} as ContentScaleVo)
let resizeObserver: ResizeObserver
const highlightRule = reactive({
  horizontal: {
    length: 'horizontal',
    direction: 'horizontal',
    highlight: {x: undefined! as number, width: 0} as Container,
    scroll: 0,
  },
  vertical: {
    direction: 'vertical',
    highlight: {x: undefined! as number, width: 0} as Container,
    scroll: 0,
  },
})

const designScrollRef = ref<HTMLElement>()!

// 事件绑定
mitt.on('elementClick', elementClick)
// mitt.on('elementMove', elementMove)
mitt.on('elementUp', elementUp)
// mitt.on('elementRemove', elementRemove)
mitt.on("scaleEvent", scaleEvent)
mitt.on("panelSnapshot", panelSnapshot)
mitt.on('updatePanel', updatePanel)
mitt.on('triggerScroll', updatePanel)
mitt.on('scaleMove', scaleMove)

onMounted(() => {
  // 挂载键盘事件
  mountedKeyboardEvent()
  initSelecto()
  // updatePanel()
  initMoveable(selecto.value, highlightRule
      //     , {
      //   onTriggerScroll: onTriggerScroll
      // }
  )
  mitt.emit('minimapViewportSize', {
    width: designScrollRef.value!.clientWidth,
    height: designScrollRef.value!.clientHeight
  } as Container)
  // console.log(designScrollRef.value!.clientWidth)
  // 创建 ResizeObserver 实例
  resizeObserver = new ResizeObserver((_entries) => {
    // entries 是 ResizeObserverEntry 对象的数组
    mitt.emit('minimapViewportSize', {
      width: designScrollRef.value!.clientWidth,
      height: designScrollRef.value!.clientHeight
    } as Container)
  });
  resizeObserver.observe(designScrollRef.value!);
  
  
  const rect = designScrollRef.value!.getBoundingClientRect()
  appStore.panelPosition = {x: rect.x, y: rect.y, scrollX: 0, scrollY: 0}
})
onUnmounted(() => {
  resizeObserver.disconnect()
  unMountedKeyboardEvent()
})

/**
 * 滑动事件
 */
function scroll(_scrollData: any) {
  highlightRule.horizontal.scroll = designScrollRef.value!.scrollLeft
  highlightRule.vertical.scroll = designScrollRef.value!.scrollTop
  mitt.emit('minimapViewportScroll', {
    x: designScrollRef.value!.scrollLeft,
    y: designScrollRef.value!.scrollTop
  } as Container)
  
  appStore.panelPosition.scrollX = designScrollRef.value!.scrollLeft
  appStore.panelPosition.scrollY = designScrollRef.value!.scrollTop
}

function wheel(event: any) {
  event.preventDefault(); // 阻止默认滚动行为
  
  // 更新滚动位置
  designScrollRef.value!.scrollTop += event.deltaY;
  designScrollRef.value!.scrollLeft += event.deltaX;
  
  mitt.emit('minimapViewportScroll', {
    x: designScrollRef.value!.scrollLeft,
    y: designScrollRef.value!.scrollTop
  } as Container)
  
  appStore.panelPosition.scrollX = designScrollRef.value!.scrollLeft
  appStore.panelPosition.scrollY = designScrollRef.value!.scrollTop
}

/**
 * minimap 的 移动事件
 */
function scaleMove(data: any) {
  // console.log('move', data.x, data.y)
  designScrollRef.value!.scrollTo(data.x, data.y)
}

function panelSnapshot(snapshot: Snapshot) {
  // console.log(123)
  // console.log(action)
  if (!snapshot.type) {
    snapshot.type = 'PANEL'
  }
  record(snapshot)
}

function elementClick(element: MyElement) {
  // console.log('elementClick')
  // console.log('鼠标点击', element)
  if (element.type == 'PrivateDragRectElement') {
    return
  }
  contentScale.openIs = true
  none(panel.pageHeader)
  none(panel.pageFooter)
  elementListNone()
  handle(element)
}

function elementUp() {
  // console.log(point)
  const elementList: Array<MyElement> = []
  for (let valueElement of panel.elementList!) {
    if (canMoveStatusList.includes(valueElement.runtimeOption.status)) {
      elementList.push(valueElement)
    }
  }
  //
  // for (let valueElement of elementList) {
  //   computeTranslate(valueElement)
  //
  //   // rotatedPoint(valueElement)
  // }
  
  // computeTranslate(defaultDragRectElement as MyElement)
  
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

function scaleEvent() {
  let mmDiv = document.createElement("div");
  designContentRef.value.appendChild(mmDiv)
  nextTick(() => {
    designContentRef.value.removeChild(mmDiv)
    // scrollbarRef.value.update()
  })
}

function elementRemove(element: MyElement) {
  // console.log(element)
  removeElement(element)
  
  // record(<Snapshot>{elementList: element, action: ActionEnum.REMOVE})
}

function elementListNone() {
  for (let valueElement of panel.elementList!) {
    none(valueElement)
  }
}
</script>
