<template>
  <Design v-for="(element) in elementList" :key="element.id" :element="element"/>
</template>

<script setup lang="ts">
import {MyElement} from "../../types/entity";
import Design from "../../components/design/design.vue";

withDefaults(defineProps<{
  elementList?: Array<MyElement>
}>(), {
  elementList: () => ([] as Array<MyElement>)
})

// function setRef(element, el) {
//   if (el && el.$el) {
//     // console.log(element, el.$el)
//     element.runtimeOption.target = el.$el
//     el.$el.element = element
//   }
// }
</script>
