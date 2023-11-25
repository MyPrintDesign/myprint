<template>
  <template v-for="(element) in elementList">
   <ElementDrag :element="element"/>
    
    <!--          <div class="posts" v-if="element.runtimeOption.TL" :style="{-->
    <!--      left: valueUnit( element.runtimeOption.TL.x),-->
    <!--      top: valueUnit(element.runtimeOption.TL.y-10)-->
    <!--    }"/>-->
    
    <!--          <div class="posts" v-if="element.runtimeOption.TL" :style="{-->
    <!--      left: valueUnit( element.runtimeOption.TR.x),-->
    <!--      top: valueUnit(element.runtimeOption.TR.y-10)-->
    <!--    }"/>-->
    
    <!--          <div class="posts" v-if="element.runtimeOption.TL" :style="{-->
    <!--      left: valueUnit( element.runtimeOption.BL.x),-->
    <!--      top: valueUnit(element.runtimeOption.BL.y-10)-->
    <!--    }"/>-->
    
    <!--          <div class="posts" v-if="element.runtimeOption.TL" :style="{-->
    <!--      left: valueUnit( element.runtimeOption.BR.x),-->
    <!--      top: valueUnit(element.runtimeOption.BR.y-10)-->
    <!--    }"/>-->
  </template>
</template>

<script setup lang="ts">

import {PropType} from "vue";
import {Element} from "@cp-print/design//types/entity";
import ElementDrag from "./elementDrag.vue";

defineProps({
  elementList: {type: Object as PropType<Array<Element>>, default: () => ({})}
})
</script>

<style scoped>

</style>
