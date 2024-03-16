<template>
  <el-popover
      popper-class="cp-popover"
      :popper-style="popperStyle"
      :placement="placement"
      :visible="popoverVisible"
      :disabled="disabled"
      :show-arrow="false"
      :show-after="0"
      :hide-after="0"
      :trigger="trigger">
    <template #reference>
      <div @mousedown="mousedown($event)"
           @mouseup="mouseup($event)"
           @mouseover="hover(true)"
           @mouseleave="hover(false)">
        <slot name="reference"/>
      </div>
    </template>
    
    <div @mouseover="hover(true)"
         ref="popoverRef"
         @mouseleave="hover(false)">
      
      <slot/>
    
    </div>
  
  </el-popover>
</template>

<script setup lang="ts">
// import { ElPopover } from 'element-plus'
import {ref, computed} from "vue";
import {onClickOutside} from '@vueuse/core'

export interface Props {
  trigger?: string
  placement?: string
  popperStyle?: any
  pressHide?: boolean
  disabled?: boolean
  lock?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  placement: 'top',
  popperStyle: () => ({}),
  pressHide: false,
  disabled: false,
  lock: false,
})

const visible = ref({
  popover: false
})
const popoverRef = ref(<any>{})
const mousedownFlag = ref(false)
const popoverVisible = computed(() => {
  return props.lock || visible.value.popover
})
let timer: any = null
let stop: ReturnType<typeof onClickOutside>

function mousedown(_ev: MouseEvent) {
  // ev.stopPropagation()
  if (props.pressHide) {
    visible.value.popover = false
  }
  mousedownFlag.value = true;
}

function mouseup(_ev: MouseEvent) {
  // ev.stopPropagation()
  if (props.trigger == 'click') {
    updateVisible(!visible.value.popover)
    
    return;
  }
  
  if (props.pressHide) {
    updateVisible(true)
  }
  mousedownFlag.value = false
  
}

function hover(flag: boolean) {
  if (props.trigger == 'click') {
    return;
  }
  // ev.stopPropagation()
  if (mousedownFlag.value && flag) {
    return
  }
  updateVisible(flag)
}

function updateVisible(flag: boolean) {
  
  if (timer != null) {
    clearTimeout(timer)
  }
  timer = setTimeout(function () {
    visible.value.popover = flag
    if (visible.value.popover) {
      stop = onClickOutside(popoverRef,
          () => {
            if (props.trigger !== 'hover') {
              updateVisible(false)
            }
          });
    } else {
      if (stop) {
        stop()
      }
    }
  }, 0)
}
</script>
