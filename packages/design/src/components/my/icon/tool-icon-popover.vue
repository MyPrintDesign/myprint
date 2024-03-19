<template>
  <my-popover
      trigger="click"
      :disabled="!enable"
      placement="bottom">
    <template #reference>
      <div class="display-flex icon-popover" :class="[{'my-icon-disabled': !enable}, 'my-color-icon']">
        <div class="display-flex">
          <div class="display-flex-column">
            <slot name="reference"/>
          </div>
          <my-icon v-if="showArrow" class="my-style-font_arrow icon-jt-x iconfont my-icon-downList-arrow" :enable="enable">
          </my-icon>
        </div>
      
      </div>
    </template>
    <slot name="panel"/>
  </my-popover>
</template>

<script setup lang="ts">
import MyPopover from "@myprint/design/components/my/popover/my-popover.vue";
import MyIcon from "@myprint/design/components/my/icon/my-icon.vue";

withDefaults(defineProps<{
  enable?: boolean
  showArrow?: boolean
}>(), {
  enable: false,
  showArrow: true,
})
</script>
