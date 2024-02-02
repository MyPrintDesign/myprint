<template>
  <div class="cp-element-wrapper design-wrapper design-inactive"
       :style="style"
       ref="designRef">
    <element-view :element="element"/>
    
    <cp-container v-if="element.type === 'PageHeader'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    <cp-container v-else-if="element.type === 'PageFooter'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    <cp-container v-else-if="element.type === 'Container'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    
  </div>

</template>

<script setup lang="ts">

import ElementView from "@cp-print/design/components/design/element.vue";

import {CpElement} from "@cp-print/design/types/entity";
import {computed, CSSProperties, onMounted, ref} from "vue";
import {CpContainer} from "./container";
import ElementList from "./elementList.vue";
// import TablePopoverView from "./table/tablePopoverView.vue";
const designRef = ref()

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})

onMounted(() => {
  designRef.value.element = props.element
  props.element.runtimeOption.target = designRef.value
})

const style = computed(() => {
  return {
    left: props.element.runtimeOption.x + 'px',
    top: props.element.runtimeOption.y + 'px',
    transform: `translate(0px, 0px) rotate(${props.element.runtimeOption.rotate}deg)`,
    width: props.element.runtimeOption.width + 'px',
    height: props.element.runtimeOption.height + 'px',
    // maxWidth: widthValueUnit(element),
    // maxHeight: heightValueUnit(element),
  } as CSSProperties
})
</script>

<style scoped>
</style>
