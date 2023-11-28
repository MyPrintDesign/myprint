<template>
  <div :class="getStyle()"
       id="rectangular"
       :style="{
       width: valueUnit(data.width), height: valueUnit(data.height),
  left: valueUnit(data.x),
  top: valueUnit(data.y)
  }"
  />
</template>
<script setup lang="ts">
import {Element} from "@cp-print/design/types/entity";
import {valueUnit} from "@cp-print/design/utils/elementUtil";

withDefaults(defineProps<{
  data?: Element
}>(), {
  data: () => ({} as Element)
})


function getStyle() {
  let classObj = {
    verticalAlignLine: false,
    horizontalAlignLine: false
  }
  // switch (props.data.type) {
  //   case 'VerticalAlignLine' :
  //     classObj.verticalAlignLine = true
  //     break
  //   case 'HorizontalAlignLine' :
  //     classObj.horizontalAlignLine = true
  //     break
  // }
  return classObj
}

</script>

<style scoped>
.alignLine {
  border-top: dashed #df6a57;
  
  position: absolute;
}

.verticalAlignLine {
  border: none;
  border-left: 1px dashed #df6a57;
  position: absolute;
}

.horizontalAlignLine {
  border: none;
  border-top: 1px dashed #df6a57;
  position: absolute;
}
</style>
