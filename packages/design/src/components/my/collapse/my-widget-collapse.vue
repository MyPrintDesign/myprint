<template>
    <div ref="headRef"
         class="widget-collapse-panel user-select-none"
         :class="{'widget-collapse-panel-fold': !data.show}">
        <div class="collapse-panel-head display-flex">
            <div class="collapse-panel-head-title display-flex">
                {{ title }}
                <slot name="head" />
            </div>
            
            <my-icon class="my-handle-panel-icon" @click="clickHead">
                <ArrowRight class="collapse-panel-head-right-icon" :class="{'is-active': data.show }" />
            </my-icon>
        </div>
        <slot />
    
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import ArrowRight from '@myprint/design/components/my/icon/icons/ArrowRight.vue';

withDefaults(defineProps<{
    title?: string;
}>(), {
    title: ''
});
const emit = defineEmits(['update:modelValue']);

const headRef = ref<HTMLDivElement>()!;
const data = reactive({
    show: true
});

function clickHead() {
    data.show = !data.show;
}

</script>
