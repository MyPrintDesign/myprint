<template>
  <div class="align-down-list-panel">
    
    <div v-for="(elementAlignChildList, index) in elementAlignList">
      <div class="align-down-list-panel__item"
           v-for="(elementAlign) in elementAlignChildList"
           @click="click(elementAlign)">
        
        <div v-if="showSelectedStatus"
             class="align-down-list-panel__item__select"
             :class="{'cp-hidden': modelValue != elementAlign.value}">
        </div>
        
        <i class="align-down-list-panel__item__icon" v-if="elementAlign.icon"
           :class="elementAlign.icon"/>
        
        <div class="align-down-list-panel__item__content user-select-none">
          {{ elementAlign.label }}
        </div>
      </div>
      
      <div v-if="index < elementAlignList.length - 1"
           class="align-down-list-panel__divider"/>
    </div>
  
  </div>
</template>

<script setup lang="ts">
import {DownList} from "@cp-print/design/types/entity";

const emit = defineEmits(['update:modelValue', 'click'])

withDefaults(defineProps<{
      showSelectedStatus?: boolean,
      modelValue?: any,
      elementAlignList: DownList[][],
    }>(),
    {
      modelValue: null,
      showSelectedStatus: false,
      elementAlignList: () => [] as DownList[][]
    })

function click(elementAlign: DownList) {
  if (elementAlign.click) {
    elementAlign.click()
  } else {
    emit('update:modelValue', elementAlign.value)
  }
  
}

</script>


