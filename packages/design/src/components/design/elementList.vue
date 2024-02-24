<template>
  <template v-for="(element, index) in elementList" :key="index">
    <Design :element="element"/>
  </template>
</template>

<script setup lang="ts">

import {CpElement} from "@cp-print/design/types/entity";
import Design from "@cp-print/design/components/design/design.vue";

withDefaults(defineProps<{
  elementList?: Array<CpElement>
}>(), {
  elementList: () => ([] as Array<CpElement>)
})
</script>
