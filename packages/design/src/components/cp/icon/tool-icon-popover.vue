<template>
  <my-popover
      trigger="click"
      :disabled="!enable"
      placement="bottom">
    <template #reference>
      <div class="display-flex font-style font-color" :class="[{'cp-icon-disabled': !enable}, 'cp-color-icon']">
        <div class="display-flex">
          <div class="display-flex-column">
            <slot name="reference"/>
          </div>
          <svg viewBox="0 0 1024 1024"
               class="cp-color-icon-arrow"
               width="10" height="10">
            <path fill="currentColor"
                  d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
          </svg>
        </div>
      
      </div>
    </template>
    <slot name="panel"/>
  </my-popover>
</template>

<script setup lang="ts">
import MyPopover from "../cp-popover/cp-popover.vue";

export interface Props {
  enable?: boolean
}

withDefaults(defineProps<Props>(), {
  enable: false,
})
</script>
