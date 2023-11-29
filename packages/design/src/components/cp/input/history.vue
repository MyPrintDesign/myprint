<template>
  <slot @change="(val:any)=>changeWrapper(val, '标题')"/>
</template>

<script setup lang="ts">

import {definePropType} from "@cp-print/design/constants/common";
import {changeWrapper} from "@cp-print/design/utils/historyUtil";

// const emit = defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: definePropType<string | number | null | undefined>([
      String,
      Number,
      Object,
    ]), default: null
  }
})

</script>
