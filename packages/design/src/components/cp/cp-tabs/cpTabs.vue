<template>
  <div class="cp_tab display-flex-column">
    <div class="cp_tab-tab">
      <div class="cp_tab-title"
           :class="{active: item.value == modelValue}"
           v-for="(item) in itemList" @click="click(item)">{{ item.label }}
      </div>
    </div>
    <div class="cp_tab-line">
    </div>
  </div>
</template>

<script setup lang="ts">
import {DownList} from "@cp-print/design/types/entity";

const emit = defineEmits(['update:modelValue', 'click'])

withDefaults(defineProps<{
      showSelectedStatus?: boolean,
      modelValue?: any,
      itemList: DownList[],
    }>(),
    {
      modelValue: null,
      showSelectedStatus: false,
      itemList: () => [] as DownList[]
    })

function click(item: DownList) {
  if (item.click) {
    item.click()
  } else {
    emit('update:modelValue', item.value)
  }
  
}

</script>
