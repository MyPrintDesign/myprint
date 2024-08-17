<template>
  <div class="my-input-unit__wrapper">
    {{ useAppStore.currentPanel.pageUnit }}
  </div>
</template>

<script setup lang="ts">
import {useAppStoreHook as appStore} from "../../../stores/app";

defineOptions({name: 'MyUnit'})

const useAppStore = appStore()
</script>
