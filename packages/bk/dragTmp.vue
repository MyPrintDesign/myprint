<template>
  <div class="drag"
       ref="dragRef"
       :style="{left : valueUnit(data.x), top : valueUnit(data.y), width: valueUnit(data.width) , height: valueUnit(data.height),
       transform: translate,}">
    
    <div class="bg" :style="{width: valueUnit(data.width) , height: valueUnit(data.height)}"
         @mousedown="mousedown($event)">
      <slot/>
      
      <div class="center"></div>
    
    </div>
    
    <div class="select" :class="{realSelect: (['SELECT', 'HANDLE'].includes(data.status))}"
         :style="{width: valueUnit(data.width) , height: valueUnit(data.height)}"/>
    
    <template v-if="!data.lock && data.status == 'HANDLE'">
      <div class="rotate" @mousedown="onRotateMousedown"></div>
      
      <div class="handle"
           :key="item.id" v-for="(item) in handleList"
           :class="item.class"
           :style="{left : valueUnit(item.x), top : valueUnit(item.y), cursor: item.cursor,
         width: item.width + 'px',
         height: item.height + 'px'
         }"
           @mousedown="handleMousedown($event, item)"
      />
    </template>
    
    <svg v-if="!data.lock && ['SELECT_REMOVE', 'HANDLE'].includes(data.status)"
         :style="{left : valueUnit(data.width), top : valueUnit(-5), cursor: ''}"
         class="remove"
         viewBox="0 0 1024 1024"
         @mousedown="click($event, remove)">
      <path
          d="M512 464.266L337.054 289.28a33.753 33.753 0 1 0-47.735 47.734L464.226 512 289.241 686.946a33.753 33.753 0 1 0 47.734 47.735L512 559.774l174.946 174.985a33.753 33.753 0 1 0 47.735-47.734L559.774 512l174.985-174.946a33.753 33.753 0 1 0-47.734-47.735L512 464.226z"
          fill="#ffffff"/>
    </svg>
    
    <div v-if="data.lock">锁定</div>
  
  </div>
</template>

<script setup lang="ts">
import {computed, inject, PropType, ref} from "vue";
import {Element} from "packages/design/src/types/entity";
import {clearEventBubble} from "packages/design/src/utils/event";
import {click, unit2px, px2unit} from "packages/design/src/utils/utils";
import {mittKey} from "packages/design/src/constants/keys";
import {scaleUtil} from "packages/design/src/utils/scaleUtil";
import {disableHandleList, getTranslate, valueUnit} from "packages/design/src/utils/elementUtil";
import {ActionEnum, Snapshot} from "packages/design/src/utils/historyUtil";

const mitt = inject(mittKey)

const props = defineProps({
  data: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

const mouseStatus = ref(false)
const dragRef = ref({} as HTMLDivElement)
const point = {} as Element
const tmp = {} as Element
const disableHandleConstList = disableHandleList(props.data);

const handleList = computed(() => {
  let list = []
  const horizontal = {width: 20, height: 3}
  const vertical = {width: 3, height: 20}
  const block = {width: 20, height: 20}
  const tmpHeight = unit2px(props.data.height)
  const tmpWidth = unit2px(props.data.width)
  
  if (tmpHeight < 70) {
    block.height = tmpHeight - 51
    block.width = tmpHeight - 51
    if (tmpHeight < 40) {
      vertical.height = tmpHeight - 21
    }
  }
  if (tmpWidth < 70) {
    block.height = tmpWidth - 51
    block.width = tmpWidth - 51
    if (tmpWidth < 40) {
      horizontal.width = tmpWidth - 21
    }
  }
  
  // 左上
  if (!disableHandleConstList?.includes('tl') && !props.data.option.aspectRatio) {
    list.push({
      id: "tl", cursor: 'nwse-resize', ...block, class: 'bg-none l t'
    })
  }
  // 中上
  if (!disableHandleConstList?.includes('tm')) {
    list.push({
      id: "tm", cursor: 'ns-resize', x: props.data?.width / 2 - px2unit(horizontal.width) / 2,
      ...horizontal, class: 't'
    })
  }
  // 右上
  if (!disableHandleConstList?.includes('tr') && !props.data.option.aspectRatio) {
    list.push({
      id: "tr", cursor: 'nesw-resize',
      ...block, class: 'bg-none r t'
    })
  }
  // 左中
  if (!disableHandleConstList?.includes('lm')) {
    list.push({
      id: "lm", cursor: 'ew-resize', y: props.data?.height / 2 - px2unit(vertical.height) / 2,
      ...vertical, class: 'l'
    })
  }
  // 右中
  if (!disableHandleConstList?.includes('rm')) {
    list.push({
      id: "rm", cursor: 'ew-resize', y: props.data?.height / 2 - px2unit(vertical.height) / 2,
      ...vertical, class: 'r'
    })
  }
  // 左下
  if (!disableHandleConstList?.includes('bl') && !props.data.option.aspectRatio) {
    list.push({
      id: "bl", cursor: 'nesw-resize',
      ...block, class: 'bg-none l b'
    })
  }
  // 下中
  if (!disableHandleConstList?.includes('bm')) {
    list.push({
      id: "bm", cursor: 'ns-resize', x: props.data?.width / 2 - px2unit(horizontal.width) / 2,
      ...horizontal, class: 'b'
    })
  }
  // 右下
  if (!disableHandleConstList?.includes('br') && !props.data.option.aspectRatio) {
    list.push({
      id: "br", cursor: 'nwse-resize',
      ...block, class: 'bg-none r b'
    })
  }
  return list
})

function mousedown(ev) {
  if (props.data.lock) {
    return
  }
  // console.log(ev)
  mouseStatus.value = true
  point.x = props.data!.x;
  point.y = props.data!.y;
  const tmpX = ev.clientX;
  const tmpY = ev.clientY;
  // // 鼠标按下，计算当前元素距离可视区的距离
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
  
  function mousemove(ev) {
    // console.log(ev)
    // 移动当前元素
    if (mouseStatus.value) {
      //计算需要移动的距离
      let offsetX = scaleUtil.scaleDiv(px2unit(ev.clientX - tmpX))
      let offsetY = scaleUtil.scaleDiv(px2unit(ev.clientY - tmpY))
      offsetX = (offsetX + point.x) < 0 ? -point.x : offsetX
      offsetY = (offsetY + point.y) < 0 ? -point.y : offsetY
      mitt.emit('elementMove', {element: props.data, offsetX, offsetY})
    }
    clearEventBubble(ev)
    return true
  }
  
  function mouseup(ev) {
    // console.log(ev)
    
    mouseStatus.value = false
    clearEventBubble(ev)
    
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
    if (tmpX == ev.clientX && tmpY == ev.clientY) {
      mitt.emit('elementClick', props.data)
      return
    }
    
    mitt.emit('elementUp', props.data)
    
    // // 鼠标按下，计算当前元素距离可视区的距离
    // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
    return false
  }
  
  clearEventBubble(ev)
  return true;
}

function onRotateMousedown(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  const el = dragRef.value!
  const elRect = el.getBoundingClientRect()
  // 旋转中心位置
  const centerX = elRect.left + elRect.width / 2
  const centerY = elRect.top + elRect.height / 2
  
  function onMousemove(e: MouseEvent) {
    const diffX = centerX - e.clientX
    const diffY = centerY - e.clientY
    // Math.atan2(y,x) 返回从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)
    const radians = Math.atan2(diffY, diffX)
    
    // 计算角度
    // 角度
    props.data.option.rotate = radians * 180 / Math.PI - 90
    console.log(props.data.option.rotate)
    // emit('rotate', angle.value)
  }
  
  const onMouseup = (_e: MouseEvent) => {
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
  }
  document.addEventListener('mousemove', onMousemove)
  document.addEventListener('mouseup', onMouseup)
}

function handleMousedown(ev, item) {
  // console.log(ev, "--", item)
  // // 鼠标按下，计算当前元素距离可视区的距离
  document.addEventListener('mousemove', handleMousemove);
  document.addEventListener('mouseup', handleMouseup);
  
  tmp.width = props.data!.width
  tmp.height = props.data!.height
  tmp.x = props.data!.x
  tmp.y = props.data!.y
  
  let startX = ev.clientX
  let startY = ev.clientY
  
  
  function handleMousemove(ev) {
    clearEventBubble(ev)
    // 计算鼠标移动后的位置
    var mouseX = ev.clientX;
    var mouseY = ev.clientY;
    
    var offsetX = mouseX - startX;
    var offsetY = mouseY - startY;
    
    // 根据旋转角度计算移动距离
    var rotatedOffsetX = offsetX * Math.cos(props.data.option.rotate) + offsetY * Math.sin(props.data.option.rotate);
    var rotatedOffsetY = -offsetX * Math.sin(props.data.option.rotate) + offsetY * Math.cos(props.data.option.rotate);
    console.log(rotatedOffsetX, rotatedOffsetY)
    // console.log(rotatedOffsetX , offsetX, rotatedOffsetY , offsetY)
    offsetX = px2unit(rotatedOffsetX) / scaleUtil.miniMap.scale
    offsetY = px2unit(rotatedOffsetY) / scaleUtil.miniMap.scale
    
    const aspectRatio = props.data.option.aspectRatio;
    let moveTmp = {width: null, x: null, height: null, y: null}
    
    switch (item.id) {
      case 'tl':// 左上
        if (offsetX < tmp.width) {
          moveTmp.x = Math.max(tmp.x + offsetX, 0)
          moveTmp.width = Math.max(tmp.width - offsetX, 0)
        }
        if (offsetY < tmp.height) {
          moveTmp.y = Math.max(tmp.y + offsetY, 0)
          moveTmp.height = Math.max(tmp.height - offsetY, 0)
        }
        break
      case 'tm':// 上中
        if (offsetY < tmp.height) {
          moveTmp.y = Math.max(tmp.y + offsetY, 0)
          moveTmp.height = Math.max(tmp.height - offsetY, 0)
        }
        break
      case 'tr':// 上右
        if (offsetY < tmp.height) {
          moveTmp.y = Math.max(tmp.y + offsetY, 0)
          moveTmp.height = Math.max(tmp.height - offsetY, 0)
        }
        moveTmp.width = Math.max(tmp.width + offsetX, 0)
        break
      case 'lm':// 左中
        if (offsetX < tmp.width) {
          moveTmp.x = Math.max(tmp.x + offsetX, 0)
          moveTmp.width = Math.max(tmp.width - offsetX, 0)
        }
        break
      case 'bl':// 左下
        if (offsetX < tmp.width) {
          moveTmp.x = Math.max(tmp.x + offsetX, 0)
          moveTmp.width = Math.max(tmp.width - offsetX, 0)
        }
        moveTmp.height = Math.max(tmp.height + offsetY, 0)
        break
      case 'rm':// 右中
        moveTmp.width = Math.max(tmp.width + offsetX, 0)
        break
      case 'bm':// 下中
        moveTmp.height = Math.max(tmp.height + offsetY, 0)
        break
      case 'br':// 右下
        moveTmp.width = Math.max(tmp.width + offsetX, 0)
        moveTmp.height = Math.max(tmp.height + offsetY, 0)
        break
    }
    
    if (aspectRatio) {
      // 锁定了宽高比例
      // if (props.data!.x != moveTmp.x) {
      //   const diff = props.data!.width - moveTmp.width
      //   props.data!.width = moveTmp.width
      //
      //   props.data!.height = props.data.height + (diff / aspectRatio)
      //
      // } else if (props.data!.y != moveTmp.y) {
      //   const diff = props.data!.width - moveTmp.width
      //   props.data!.width = moveTmp.width
      //
      //   props.data!.height = props.data.height + (diff / aspectRatio)
      //
      // } else
      if (moveTmp.width != null && props.data!.width != moveTmp.width) {
        const diff = moveTmp.width - tmp.width
        props.data!.width = moveTmp.width
        
        props.data!.height = tmp.height + (diff / aspectRatio)
        console.log('widht', tmp.height, diff, diff / aspectRatio, props.data!.height)
        
      } else if (moveTmp.height != null && props.data!.height != moveTmp.height) {
        const diff = moveTmp.height - tmp.height
        props.data!.height = moveTmp.height
        
        props.data!.width = tmp.width + (diff * aspectRatio)
        console.log('height', tmp.height, diff, diff * aspectRatio, props.data!.height)
      }
    } else {
      // console.log(123)
      moveTmp.width != null && (props.data.width = moveTmp.width)
      moveTmp.height != null && (props.data.height = moveTmp.height)
      
      // console.log(props.data.height , tmp.height)
      // var newLeft = tmp.x - (props.data.width - tmp.width) / 2;
      // var newTop = tmp.y - (props.data.height - tmp.height) / 2;
      props.data.x = tmp.x - offsetX
      props.data.y = tmp.y - offsetX
      // props.data.y = newTop
      // moveTmp.x != null && ()
      // moveTmp.y != null && ()
      
    }
    
  }
  
  function handleMouseup(ev) {
    document.removeEventListener('mousemove', handleMousemove);
    document.removeEventListener('mouseup', handleMouseup);
    // record(<Snapshot>{
    //   type: 'ELEMENT',
    //   action: ActionEnum.RESIZE,
    //   target: [{
    //     ...props.data,
    //     x: tmp.x,
    //     y: tmp.y,
    //     width: tmp.width,
    //     height: tmp.height,
    //   }]
    // })
    mitt.emit('panelSnapshot', {action: ActionEnum.RESIZE, element: props.data} as Snapshot)
    clearEventBubble(ev)
  }
  
  clearEventBubble(ev)
}

function remove() {
  mitt.emit('elementRemove', props.data)
}

const translate = computed(() => {
  return getTranslate(props.data)
})


</script>
<style scoped>
.drag {
  position: absolute;
}

.bg {
  cursor: move;
  top: 0;
  position: absolute;
}

.select {
  top: 0;
  position: absolute;
  border: dashed 1px var(--drag-h-color);
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.2;
}

.realSelect {
  opacity: 1;
}

.handle {
  background: var(--drag-h-color);
  position: absolute;
}

.remove {
  height: 4mm;
  background: red;
  width: 4mm;
  position: absolute;
  border-radius: 50%;
}

.bg-none {
  background: none;
}

.t {
  box-sizing: border-box;
  top: -1px;
  border-top: solid 3px var(--drag-h-color);
}

.l {
  box-sizing: border-box;
  left: -1px;
  border-left: solid 3px var(--drag-h-color);
}

.r {
  box-sizing: border-box;
  right: -1px;
  border-right: solid 3px var(--drag-h-color);
}

.b {
  box-sizing: border-box;
  bottom: -1px;
  border-bottom: solid 3px var(--drag-h-color);
}

.center {
  left: 50%;
  top: 50%;
  position: absolute;
}

.center:before {
  content: ' ';
  width: 1px;
  height: 6px;
  position: absolute;
  background: var(--drag-h-color);
  left: 0;
  top: -3px;
  transform: translateX(-50%);
}

.center:after {
  content: ' ';
  width: 6px;
  height: 1px;
  position: absolute;
  background: var(--drag-h-color);
  left: -3px;
  top: 0;
  transform: translateY(-50%);
}

.rotate {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--drag-h-color);
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURUdwTP///9XV1R0dHf///3Nzc////////////////1ZWVq+vr/T09PX19QQEBP///////8XFxf///////////wYGBv///+jo6P///4aGhqioqMzMzP///2BgYP///////////zExMf///wAAAP///xLps0AAAAAjdFJOUwCxxOdixRDmzSDMv8/Z+tz5wWpXWPk3zALCv8KnyXZVMNuNPnv3CwAAAJ1JREFUKM/NkckOwyAMRFkDBMhC9qWr+//fWCIV1WlzrjoXS36yxmMT8hdqqKoUvRAjMtw22kvecem1GjTuK1vApmI+wQMBbQFy5li+QQRaX4AtRX+vbntAJeRl9HTTx4TiwESs61DXNUPmVQeujzVrQwh43TTxpeRBslVfMUhbiXKWyiAwvnIsMcdyJkfJYdpNvG/ltDm+bjP+8KFP8ggL+zQLGxwAAAAASUVORK5CYII=) 14 14, alias;
}

.rotate:after {
  content: ' ';
  height: 12px;
  width: 1px;
  border-right: var(--drag-h-color) dashed 1px;
  position: absolute;
  left: 2px;
  top: 6px;
}
</style>
