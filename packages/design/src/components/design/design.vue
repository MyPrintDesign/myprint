<template>
  <div class="cp-element-wrapper design-wrapper design-inactive"
       :style="style"
       :class="{
         'dropInIs': element.runtimeOption.dragInIs
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
  CSSProperties, onMounted, reactive, ref, toRefs, watch
} from "vue";
import {CpContainer} from "./container";
import ElementList from "./elementList.vue";
import {onUpdated} from "vue-demi";
// import TablePopoverView from "./table/tablePopoverView.vue";
const designRef = ref()

const props = withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
watch(() => designRef.value, (n, o) => {
  // console.log(n, o)
  console.log(n == o)
  // props.element.runtimeOption.target = n
})

onUpdated(()=>{
  console.log('update')
  props.element.runtimeOption.target = designRef.value
  console.log(props.element, props.element.runtimeOption.target)
})

onMounted(() => {
  designRef.value.element = props.element
  props.element.runtimeOption.target = designRef.value
})

const style = {
  left: props.element.runtimeOption.init.x + 'px',
  top: props.element.runtimeOption.init.y + 'px',
  transform: `translate(0px, 0px) rotate(${props.element.runtimeOption.rotate}deg)`,
  width: props.element.runtimeOption.init.width + 'px',
  height: props.element.runtimeOption.init.height + 'px',
  // maxWidth: widthValueUnit(element),
  // maxHeight: heightValueUnit(element),
} as CSSProperties
</script>

<style scoped lang="scss">
.dropInIs {
  z-index: 1;
  opacity: 0.6;
  background: var(--page-header-drop-color);
  outline: 4px solid var(--drag-h-color);
}
</style>
