<template>
  <my-popover
      trigger="click"
      :disabled="!enable"
      placement="bottom">
    <template #reference>
      <div class="display-flex icon-popover" :class="[{'cp-icon-disabled': !enable}, 'cp-color-icon']">
        <div class="display-flex">
          <div class="display-flex-column">
            <slot name="reference"/>
          </div>
          <cp-icon v-if="showArrow" class="cp-style-font_arrow icon-jt-x iconfont cp-icon-downList-arrow" :enable="enable">
          </cp-icon>
        </div>
      
      </div>
    </template>
    <slot name="panel"/>
  </my-popover>
</template>

<script setup lang="ts">
import MyPopover from "../cp-popover/cp-popover.vue";
import CpIcon from "@cp-print/design/components/cp/icon/cp-icon.vue";

withDefaults(defineProps<{
  enable?: boolean
  showArrow?: boolean
}>(), {
  enable: false,
  showArrow: true,
})
</script>
