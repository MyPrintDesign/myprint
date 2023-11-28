<template>
  <div class="selectRect"
       id="rectangular"
       :style="{left : valueUnit(element.x),
       top : valueUnit(element.y),
       width: valueUnit(element.width),
       height: valueUnit(element.height)}"/>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";

defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

</script>
