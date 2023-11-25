<template>
  <div class="body">{{title}}</div>
  <Counter />
</template>

<script setup lang="ts">
  import {ref} from "vue";
  import {Counter} from "./src";

  const title = ref('example');
</script>
