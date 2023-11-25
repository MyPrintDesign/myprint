<template>
  <div>122223</div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
const query = route.query
console.log(query)
</script>

<style scoped>

</style>
