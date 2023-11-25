<template>
  <el-popover
      popper-class="my-popover"
      :popper-style="popperStyle"
      :placement="placement"
      :visible="popoverVisible"
      :show-arrow="false"
      :hide-after="0"
      :trigger="trigger">
    <template #reference>
      <div @mousedown="mousedown($event)"
           @mouseup="mouseup($event)"
           @mouseover="hover(true)"
           @mouseleave="hover(false)"
      >
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
import { ElPopover } from 'element-plus'
import {ref, computed} from "vue";
import {onClickOutside} from '@vueuse/core'

const props = defineProps({
  trigger: {type: String, default: 'hover'},
  placement: {type: String, default: 'top'},
  popperStyle: {type: Object, default: () => ({})},
  pressHide: {type: Boolean, default: false},
  lock: {type: Boolean, default: false},
})
const visible = ref({
  popover: false
})
const popoverRef = ref(<any>{})
const mousedownFlag = ref(false)
const popoverVisible = computed(() => {
  return props.lock || visible.value.popover
})
let timer = null

function mousedown(ev) {
  // ev.stopPropagation()
  if (props.pressHide) {
    visible.value.popover = false
  }
  mousedownFlag.value = true;
}

function mouseup(ev) {
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

function hover(flag) {
  if (props.trigger == 'click') {
    return;
  }
  // ev.stopPropagation()
  if (mousedownFlag.value && flag) {
    return
  }
  updateVisible(flag)
}

function updateVisible(flag) {
  
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
  }, 200)
}

let stop: ReturnType<typeof onClickOutside>

</script>

<style lang="scss" scoped>

</style>
<!--
-->
<style lang="scss">
.my-popover {
  background-color: transparent !important;
  border-color: transparent !important;
  padding: 0 !important;
  width: auto !important;
  min-width: auto !important;
  box-shadow: none !important;
}

.my-popover .el-popover__title {
  color: black;
}

.my-popover .popper__arrow::after {
  border-top-color: #090d29 !important;
}
</style>
