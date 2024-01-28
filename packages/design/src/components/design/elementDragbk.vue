<template>
  <cp-drag
      :element="element"
      snap
      :handles="computedHandles(element)"
      :drag="computeDrag(element)"
      :on-drag-start="element.runtimeOption.onDragStart"
      rotatable>
    <element-view :element="element"/>
    
    <TablePopoverView v-if="element.type === 'Table'" :element="element"/>
    
    <cp-container v-else-if="element.type === 'Container'" :element="element"/>
    <cp-container v-else-if="element.type === 'PageHeader'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
    <cp-container v-else-if="element.type === 'PageFooter'" :element="element">
      <element-list :element-list="element.elementList"/>
    </cp-container>
  </cp-drag>
</template>
<script setup lang="ts">
import CpDrag from "./drag";
import ElementView from "./element.vue";
import {Element} from "@cp-print/design/types/entity";
import {computedHandles, computeDrag} from "@cp-print/design/utils/elementUtil";
import {CpContainer} from "./container";
import ElementList from "./elementList.vue";
import TablePopoverView from "./table/tablePopoverView.vue";

withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})
</script>
