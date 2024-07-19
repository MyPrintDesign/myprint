<template>
    <teleport to="body">
        <div class="my-dialog"
             :class="props.class"
             v-if="data.rendered"
             role="dialog" aria-modal="true" v-show="modelValue">
            <div class="my-dialog_wrapper"
                 ref="dialogRef"
                 tabindex="-1"
                 @keyup.esc="onClose">
                <div v-if="title != null" class="my-dialog_head">
                    <!--                todo 弹窗头-->
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

import { computed, nextTick, reactive, ref, watch } from 'vue-demi';

const emit = defineEmits(['update:modelValue', 'close']);

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
const dialogRef = ref(); // DOM 引用

const style = computed(() => {
    return {
        width: props.width
    };
});

watch(() => props.modelValue, (_n, _o) => {
    if (props.modelValue) {
        data.rendered = true;
        nextTick(() => {
            dialogRef.value.focus();
        });
        document.body.classList.add('my-popup-parent--hidden');
    } else {
        onClose();
        document.body.classList.remove('my-popup-parent--hidden');
    }
});

function onClose() {
    emit('update:modelValue', false);
    emit('close');
}

</script>
