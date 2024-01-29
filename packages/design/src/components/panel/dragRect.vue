<template>
  <div class="selectRect"
       id="rectangular"
       :style="{
       width: valueUnit(element.width), height: valueUnit(element.height)}"
  />
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";

defineProps({
  element: {type: Object as PropType<CpElement>, default: () => ({} as CpElement)}
})

</script>

<style scoped>
.selectRect {
  outline: 1px solid slateblue;
}
</style>
