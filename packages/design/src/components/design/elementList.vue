<template>
  <Design v-for="(element) in elementList" :key="element.id" :element="element"/>
</template>

<script setup lang="ts">

import {CpElement} from "@cp-print/design/types/entity";
import Design from "@cp-print/design/components/design/design.vue";

withDefaults(defineProps<{
  elementList?: Array<CpElement>
}>(), {
  elementList: () => ([] as Array<CpElement>)
})

// function setRef(element, el) {
//   if (el && el.$el) {
//     // console.log(element, el.$el)
//     element.runtimeOption.target = el.$el
//     el.$el.element = element
//   }
// }
</script>
