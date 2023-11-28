<template>
  
  <!--  <vue-drag-->
  <!--      :element="element"-->
  <!--      :handles="['bm']">-->
  <!--    <cp-drop-->
  <!--        @drop="drop"-->
  <!--        class="container"-->
  <!--        :class="{-->
  <!--        'cp-print-container_over': data.dropOver-->
  <!--      }"-->
  <!--        @dragover="dragover"-->
  <!--        @dragleave="dragleave">-->
  <!--      -->
  <!--    </cp-drop>-->
  <!--  </vue-drag>-->
  
<!--  <element-list :element-list="element.elementList"/>-->

</template>

<script setup lang="ts">
import {PropType} from "vue";
import {Element} from "@cp-print/design/types/entity";
// import ElementList from "../../elementList.vue";

defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

</script>

<style scoped>

</style>
