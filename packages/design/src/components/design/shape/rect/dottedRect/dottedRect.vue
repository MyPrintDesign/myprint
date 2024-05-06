<template>
  <div class="my-print-dotted-rect__wrapper"
       ref="textRef"
       :style="{maxWidth: widthValueUnit(data), width: valueUnit(trend1(data.width - 2 * data.option.borderWidth)),
       height: valueUnit(trend1(data.height - 2 * data.option.borderWidth)),
       margin: valueUnit(data.option.borderWidth),
       outlineWidth: valueUnit(data.option.borderWidth),
       }">
  </div>
</template>
<script setup lang="ts">

import {onUnmounted, PropType, ref} from "vue";
import {MyElement} from "@myprint/design/types/entity";
import {trend1} from "@myprint/design/utils/utils";
import {valueUnit, widthValueUnit} from "@myprint/design/utils/elementUtil";

defineProps({
  data: {type: Object as PropType<MyElement>, default: () => ({} as MyElement)}
})
const textRef = ref()
onUnmounted(() => {

})

</script>
<style scoped>

</style>
