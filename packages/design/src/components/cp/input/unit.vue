<template>
  <div class="cp-input-unit__wrapper">
    {{ useAppStore.currentPanel.pageUnit }}
  </div>
</template>

<script setup lang="ts">
import {useAppStoreHook as appStore} from "@cp-print/design/stores/app";

defineOptions({name: 'CpUnit'})

const useAppStore = appStore()
</script>
