<template>
    <tip-icon
        :modelValue="value"
        @update:model-value="change"
        :disabled="disabled">
        <slot />
    </tip-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue-demi';
import { useAppStoreHook } from '@myprint/design/stores/app';
import TipIcon from '@myprint/design/components/my/icon/tip-icon.vue';
import { hasStyle } from '@myprint/design/constants/common';
import { ActionEnum, Snapshot } from '@myprint/design/utils/historyUtil';
import { multipleElementGetValue, multipleElementSetValue } from '@myprint/design/utils/elementUtil';
import { mitt } from '@myprint/design/utils/utils';

const appStore = useAppStoreHook();
const emit = defineEmits(['update:modelValue']);

const props = withDefaults(defineProps<{
        props?: string,
        propsValue?: string,
        enableProps?: string,
        disabled?: boolean | undefined,
        marginTop?: string,
    }>(),
    {
        props: '',
        propsValue: undefined,
        enableProps: '',
        disabled: undefined,
        marginTop: ''
    });
// console.log(props.tips)

const value = computed(() => {
    
    if (!props.props) {
        return false;
    }
    
    const result = multipleElementGetValue(props.props);
    
    if (props.propsValue == undefined) {
        return result;
    } else {
        return result === props.propsValue;
    }
});

const disabled = computed(() => {
    if (props.disabled !== undefined) {
        return props.disabled;
    }
    if (appStore.currentElement.length == 0) {
        return true;
    }
    for (let currentElementElement of appStore.currentElement) {
        if (!hasStyle(currentElementElement.type, props.enableProps as any)) {
            // console.log(props.enableProps, 'false')
            return true;
        }
    }
    // console.log(props.enableProps, 'true')
    return false;
});

function change(val: boolean) {
    let tmpVal: any = val;
    if (props.propsValue != undefined) {
        if (val) {
            tmpVal = props.propsValue;
        }
    }
    
    // console.log(val)
    // console.log(appStore.currentElement)
    multipleElementSetValue(props.props, tmpVal);
    
    mitt.emit('panelSnapshot', { action: ActionEnum.UPDATE_STYLE, elementList: appStore.currentElement } as Snapshot);
    
}
</script>
