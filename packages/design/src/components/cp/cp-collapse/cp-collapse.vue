<template>
  <Teleport to="body">
    <div ref="headRef"
         v-show="modelValue"
         class="collapse-panel user-select-none"
         :class="{'disable-collapse-panel-height-duration': data.resizeIs, 'collapse-panel-height-duration': data.loaded}"
         :style="style">
      <div class="collapse-panel-head display-flex">
        <div class="collapse-panel-head-title display-flex" @mousedown="headMouseDown">
          {{ element.label }}
          <slot name="head"/>
        </div>
        
        <el-icon class="cp-handle-panel-icon" @click="clickHead">
          <ArrowRight class="collapse-panel-head-right-icon" :class="{'is-active': data.show }"/>
        </el-icon>
        
        <el-icon class="collapse-panel-head-right-close cursor-pointer" @click="clickHeadClose">
          <Close class="collapse-panel-head-right-icon"/>
        </el-icon>
      
      </div>
      <el-scrollbar style="height: calc(100% - 24px);">
        <slot/>
      </el-scrollbar>
      <div @mousedown="resize" v-if="data.show" class="collapse-panel-resize"></div>
    
    </div>
  </Teleport>
</template>
<script setup lang="ts">
// import {ElIcon, ElScrollbar} from 'element-plus'
import {computed, nextTick, onMounted, reactive, ref, CSSProperties} from "vue";
import {ArrowRight, Close} from "@element-plus/icons-vue";
import {useConfigStore} from "@cp-print/design/stores/config";
import {getCollapsePanelZIndex} from "@cp-print/design/utils/utils";
import {HandlePanel} from "@cp-print/design/types/entity";

export interface Props {
  element?: HandlePanel
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  element: () => ({} as HandlePanel),
  modelValue: false,
})

const emit = defineEmits(['update:modelValue'])

const useConfigStore1 = useConfigStore()
const headRef = ref<HTMLDivElement>()!
const data = reactive({
  x: 0,
  y: 0,
  right: 0,
  bodyResizeHeight: 0,
  translateX: 0,
  translateY: 0,
  show: true,
  resizeIs: false,
  zIndex: 0,
  loaded: false
})

onMounted(() => {
  data.zIndex = getCollapsePanelZIndex(data.zIndex)
  const boundingClientRect = headRef.value!.getBoundingClientRect();
  const left = boundingClientRect.left
  const right = boundingClientRect.right
  data.x = left
  data.y = right
  // data.right = document.body.clientHeight - props.element.x
  data.bodyResizeHeight = document.body.clientHeight - props.element.height

  nextTick(() => {
    data.loaded = true
  })
})

function clickHead() {
  data.show = !data.show
}

function clickHeadClose() {
  // modelValue.visible = false
  emit('update:modelValue', false)
  // data.show = !data.show
}

const style = computed(() => {
  return {
    right: props.element.right + 'px',
    top: props.element.y + 'px',
    width: props.element.width + 'px',
    zIndex: data.zIndex,
    transform: `translate(${data.translateX}px, ${data.translateY}px)`,
    height: data.show ? `max(100% - ${data.bodyResizeHeight}px, 24px)` : '21px'
  } as CSSProperties
})

function headMouseDown(e:MouseEvent) {
  useConfigStore1.changeCursor('cursor-move')
  data.zIndex = getCollapsePanelZIndex(data.zIndex)
  e.preventDefault();
  const disX = e.clientX
  const disY = e.clientY

  const clientWidth = document.body.clientWidth - 20
  const clientHeight = document.body.clientHeight

  let translateXTmp = data.translateX
  let translateYTmp = data.translateY

  let height = headRef.value!.offsetHeight

  const boundingClientRect = headRef.value!.getBoundingClientRect();

  document.onmousemove = function (e) {
    // 通过事件委托，计算移动的距离
    const l = e.clientX - disX
    const t = e.clientY - disY

    // 移动当前元素
    // if (props.element.x + translateXTmp + l < 0) {
    //   data.translateX = -props.element.x
    // } else if (data.right + translateXTmp + l > clientWidth) {
    //   data.translateX = clientWidth - data.right
    // } else {
    //   data.translateX = translateXTmp + l
    // }
    if (boundingClientRect.left + l < 0) {
      data.translateX = translateXTmp - boundingClientRect.left
    } else if (boundingClientRect.right + l > clientWidth) {
      data.translateX = translateXTmp + clientWidth - boundingClientRect.right
    } else {
      data.translateX = translateXTmp + l
    }

    if (props.element.y + translateYTmp + t < 0) {
      data.translateY = -props.element.y
    } else if (props.element.y + height + translateYTmp + t > clientHeight) {
      data.translateY = clientHeight - props.element.y - height
    } else {
      data.translateY = translateYTmp + t
    }
    e.preventDefault()
    e.stopPropagation()
  }

  document.onmouseup = function (_e) {
    useConfigStore1.changeCursor(null)
    document.onmousemove = null
    document.onmouseup = null
  }
  return false

}

function resize(e:MouseEvent) {
  e.preventDefault();
  useConfigStore1.changeCursor('cursor-ns-resize')
  data.resizeIs = true
  const disY = e.clientY
  let tmpHeight = data.bodyResizeHeight

  document.onmousemove = function (e) {
    // 通过事件委托，计算移动的距离
    const t = e.clientY - disY

    data.bodyResizeHeight = tmpHeight - t

    e.preventDefault()
    e.stopPropagation()
  }


  document.onmouseup = function (_e) {
    useConfigStore1.changeCursor(null)
    data.resizeIs = false
    document.onmousemove = null
    document.onmouseup = null
  }
  return false
}

</script>


<style lang="scss">
.collapse-panel {
  pointer-events: all;
  position: absolute;
  width: 200px;
  z-index: 10;
  background-color: white;
  border: 1px solid var(--drag-h-color);
  box-sizing: border-box;
  border-radius: 3px;
  
  
  .collapse-panel-head {
    cursor: move;
    overflow: hidden;
    
    background: var(--drag-h-color);
    color: white;
    height: 20px;
    border-bottom: 1px solid #ebeef5;
    
    .collapse-panel-head-title {
      flex: 1;
      font-size: 14px;
    }
    
    .collapse-panel-head-right-icon {
      transition: transform var(--el-transition-duration);
    }
    
    .collapse-panel-head-right-close {
      font-size: 20px;
      height: 16px;
      width: 16px;
      margin: 2px;
      background: var(--drag-h-color);
      overflow: hidden;
      border-radius: 3px;
      
      .collapse-panel-head-right-icon {
        transition: transform var(--el-transition-duration);
      }
      
      :hover {
        background: red;
      }
    }
    
    .is-active {
      transform: rotate(90deg);
    }
  }
  
  .collapse-panel-resize {
    width: 100%;
    height: 3px;
    opacity: 0.8;
    cursor: ns-resize;
  }
  
  .collapse-panel-resize:hover {
    opacity: 0.8;
    background: var(--drag-h-color);
  }
  
}

.disable-collapse-panel-height-duration {
  transition: none !important;
}

.collapse-panel-height-duration {
  transition: height var(--el-transition-duration);
}

</style>
