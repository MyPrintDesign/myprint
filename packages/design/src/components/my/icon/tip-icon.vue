<template>
  <el-tooltip :content="tips"
              :disabled="tips == ''"
              :show-after="50"
              :enterable="false"
              :hide-after="0"
              trigger="hover"
              placement="bottom">
    <my-icon :enable="enable"
             :class="props.class"
             @click="$emit('click')"
             @update:model-value="(val)=>$emit('update:modelValue', val)"
             :modelValue="modelValue">
      <slot/>
    </my-icon>
  </el-tooltip>
</template>

<script setup lang="ts">
import MyIcon from "@myprint/design/components/my/icon/my-icon.vue";

const props = withDefaults(defineProps<{
      tips?: string,
      enable?: boolean,
      modelValue?: boolean,
      class?: string,
    }>(),
    {
      tips: "",
      enable: true,
      modelValue: false,
      class: ""
    })
</script>
