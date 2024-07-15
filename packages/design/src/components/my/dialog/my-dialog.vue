<template>
    <teleport to="body">
        <div class="my-dialog"
             :class="props.class"
             v-if="data.rendered"
             role="dialog" aria-modal="true" v-show="modelValue">
            <div class="my-dialog_wrapper">
                <div v-if="title != null" class="my-dialog_head">
                
                </div>
                
                <div class="my-dialog_content"
                     v-bind="$attrs"
                     :class="{
                    'is-fullscreen': fullscreen
                     }"
                     :style="style">
                    <slot></slot>
                </div>
            
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">

import { computed, reactive, watch } from 'vue';

const emit = defineEmits(['close']);

const props = withDefaults(defineProps<{
    modelValue?: boolean,
    fullscreen?: boolean,
    class?: any,
    title?: string,
    width?: string,
}>(), {
    modelValue: false,
    fullscreen: false,
    class: '',
    width: '500px'
});

const data = reactive({
    rendered: false
});

const style = computed(() => {
    return {
        width: props.width
    };
});

watch(() => props.modelValue, (_n, _o) => {
    if (props.modelValue) {
        data.rendered = true;
        document.body.classList.add('my-popup-parent--hidden');
    } else {
        emit('close');
        document.body.classList.remove('my-popup-parent--hidden');
    }
});

</script>
