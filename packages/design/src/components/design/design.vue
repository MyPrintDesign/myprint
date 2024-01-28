<template>
  <div class="cp-element-wrapper design-select design-border" :style="style"
       ref="designRef">
    <element-view :element="element"/>
  </div>

</template>

<script setup lang="ts">

import ElementView from "@cp-print/design/components/design/element.vue";

import {Element} from "@cp-print/design/types/entity";
import {computed, CSSProperties, onMounted, ref} from "vue";
// import {CpContainer} from "./container";
// import ElementList from "./elementList.vue";
// import TablePopoverView from "./table/tablePopoverView.vue";
const designRef = ref()

const props = withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})

onMounted(() => {
  designRef.value.element = props.element
  props.element.runtimeOption.target = designRef.value
})

const style = computed(() => {
  return {
    left: props.element.runtimeOption.x + 'px',
    top: props.element.runtimeOption.y + 'px',
    width: props.element.runtimeOption.width + 'px',
    height: props.element.runtimeOption.height + 'px',
    // maxWidth: widthValueUnit(element),
    // maxHeight: heightValueUnit(element),
  } as CSSProperties
})
</script>

<style scoped>

</style>
