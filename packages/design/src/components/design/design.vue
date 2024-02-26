<template>
  <div class="cp-element-wrapper design-wrapper "
       :style="style"
       :class="{
         'dropInIs': element.runtimeOption.dragInIs,
         'design-inactive': element.runtimeOption.status !== 'HANDLE',
         'design-activate': element.runtimeOption.status == 'HANDLE',
       }"
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
import {
  computed,
  // computed,
  CSSProperties, onMounted, ref
} from "vue";
import {CpContainer} from "./container";
import ElementList from "./elementList.vue";
// import {onUpdated} from "vue-demi";
// import TablePopoverView from "./table/tablePopoverView.vue";
const designRef = ref()

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})


onMounted(() => {
  // console.log(designRef)
  // let ss = designRef
  // console.log(props.element.runtimeOption)
  // console.log(props.element.runtimeOption.target)
  // props.element.runtimeOption.target.value = designRef
  // console.log(props.element.runtimeOption.target)
  // designRef.value.element = props.element
})

const style = computed(() => {
  return {
    left: props.element.runtimeOption.init.x + 'px',
    top: props.element.runtimeOption.init.y + 'px',
    transform: `translate(0px, 0px) rotate(${props.element.runtimeOption.init.runtimeOption.rotate}deg)`,
    width: props.element.runtimeOption.init.width + 'px',
    height: props.element.runtimeOption.init.height + 'px',
    // maxWidth: widthValueUnit(element),
    // maxHeight: heightValueUnit(element),
  } as CSSProperties
})
</script>

<style scoped lang="scss">
.dropInIs {
  z-index: 1;
  opacity: 0.6;
  background: var(--page-header-drop-color);
  outline: 4px solid var(--drag-h-color);
}
</style>
