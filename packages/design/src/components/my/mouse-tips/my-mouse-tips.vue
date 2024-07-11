<template>
  <Teleport v-if="mouseTips.data.visible" to="body">
    <div ref="wrapperRef" class="mouse-tips" :style="{
    transform: `translate(${mouseTips.data.x}px, ${mouseTips.data.y}px)`
  }">
      {{ mouseTips.data.data }}
    </div>
  </Teleport>

</template>

<script setup lang="ts">
import {mouseTips} from "@myprint/design/utils/mouseTips";
</script>
