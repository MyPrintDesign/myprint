<template>
    <teleport to="body">
        <div class="my-dialog"
             :class="props.class"
             v-if="data.rendered"
             role="dialog" aria-modal="true" v-show="modelValue">
            <div class="my-dialog_wrapper display-flex-column"
                 ref="dialogRef"
                 tabindex="-1"
                 @keyup.esc="onClose">
                
                <div class="my-dialog_content"
                     v-bind="$attrs"
                     :class="{
                    'is-fullscreen': fullscreen
                     }"
                     :style="style">
                    
                    <div class="my-dialog_header display-flex" v-if="showHeader">
                        <div v-if="title != null" class="my-dialog_head_title">
                            {{ title }}
                        </div>
                        <div v-else class="my-dialog_head_slot">
                            <slot name="head"></slot>
                        </div>
                        
                        <div class="my-dialog_head_close display-flex">
                            <my-icon color="#666666" size="20" class="cursor-pointer" @click="onClose">
                                <CloseBold />
                            </my-icon>
                        </div>
                    </div>
                    <slot></slot>
                </div>
            
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">

import { computed, nextTick, reactive, ref, watch } from 'vue-demi';
import CloseBold from '../../../components/my/icon/icons/CloseBold.vue';
import MyIcon from '../../../components/my/icon/my-icon.vue';

const emit = defineEmits(['update:modelValue', 'close']);

const props = withDefaults(defineProps<{
    modelValue?: boolean,
    fullscreen?: boolean,
    showHeader?: boolean,
    class?: any,
    title?: string,
    width?: string,
}>(), {
    modelValue: false,
    fullscreen: false,
    showHeader: true,
    class: '',
    width: '500px'
});

const data = reactive({
    rendered: false
});
const dialogRef = ref();

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
