<template>
  <el-tooltip :content="tips"
              :disabled="tips == ''"
              :show-after="200"
              :enterable="false"
              :hide-after="0"
              trigger="hover"
              placement="bottom">
    <div class="style-icon"
         :class="{focus: enable && (hoverFlag || modelValue), 'cp-icon-disabled': !enable}"
         @click="click"
         @mouseover="hover(true)"
         @mouseleave="hover(false)">
      <slot/>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits(['update:modelValue', 'click'])

const props = withDefaults(defineProps<{
      tips?: string,
      enable?: boolean,
      modelValue?: boolean,
    }>(),
    {
      tips: "",
      enable: true,
      modelValue: false,
    })

const hoverFlag = ref(false)

function click() {
  if (!props.enable) {
    return
  }
  emit('update:modelValue', !props.modelValue)
  emit('click')
}

function hover(flag: boolean) {
  hoverFlag.value = flag
}

</script>
