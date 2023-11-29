<template>
  <template v-for="(element) in elementList">
    <ElementDrag :element="element"/>

  </template>
</template>

<script setup lang="ts">

import {Element} from "@cp-print/design/types/entity";
import ElementDrag from "./elementDrag.vue";

withDefaults(defineProps<{
  elementList?: Array<Element>
}>(), {
  elementList: () => ([] as Array<Element>)
})
</script>
