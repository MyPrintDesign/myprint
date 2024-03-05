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
import CpDrag from "../../design/src/components/design/drag/index";
import ElementView from "../../design/src/components/design/element.vue";
import {CpElement} from "packages/design/src/types/entity";
import {computedHandles, computeDrag} from "packages/design/src/utils/elementUtil";
import {CpContainer} from "../../design/src/components/design/container";
import ElementList from "../../design/src/components/design/elementList.vue";
import TablePopoverView from "../../design/src/components/design/table/tablePopoverView.vue";

withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
</script>
