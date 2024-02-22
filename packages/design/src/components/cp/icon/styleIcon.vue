<template>
  <tip-icon
      :modelValue="value"
      @update:model-value="change"
      :enable="enable">
    <slot/>
  </tip-icon>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import TipIcon from "@cp-print/design/components/cp/icon/tip-icon.vue";
import {hasStyle} from "@cp-print/design/constants/common";
import {ActionEnum, Snapshot} from "@cp-print/design/utils/historyUtil";
import {mittKey} from "@cp-print/design/constants/keys";
import {multipleElementGetValue, multipleElementSetValue} from "@cp-print/design/utils/elementUtil";

const mitt = inject(mittKey)!

const appStore = useAppStoreHook()
const emit = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<{
      props?: string,
      propsValue?: string,
      enableProps?: string,
      tips?: string,
      enable?: boolean | undefined,
      marginTop?: string,
    }>(),
    {
      props: "",
      propsValue: undefined,
      enableProps: "",
      tips: "",
      enable: undefined,
      marginTop: ""
    })
// console.log(props.enable)

const value = computed(() => {
  
  const result = multipleElementGetValue(props.props)
  
  if (props.propsValue == undefined) {
    return result
  } else {
    return result === props.propsValue
  }
  //
  // if (Array.isArray(appStore.currentElement)) {
  //   for (let currentElementElement of appStore.currentElement) {
  //      else {
  //       if (currentElementElement[props.props] !== props.propsValue) {
  //         return false
  //       }
  //     }
  //   }
  //   return true
  // } else {
  //   if (props.propsValue == undefined) {
  //     return appStore.currentElement[props.props]
  //   } else {
  //     return appStore.currentElement[props.props] === props.propsValue
  //   }
  // }
})

const enable = computed(() => {
  if (props.enable !== undefined) {
    return props.enable
  }
  if (Array.isArray(appStore.currentElement)) {
    for (let currentElementElement of appStore.currentElement) {
      if (!hasStyle(currentElementElement.type, 'bold')) {
        return false
      }
    }
    return true
  } else {
    return hasStyle(appStore.currentElement.type, 'bold')
  }
})

function change(val: boolean) {
  let tmpVal: any = val
  if (props.propsValue != undefined) {
    if (val) {
      tmpVal = props.propsValue
    }
  }
  multipleElementSetValue(props.props, tmpVal)
  
  if (Array.isArray(appStore.currentElement)) {
    for (let currentElementElement of appStore.currentElement) {
      mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, element: currentElementElement} as Snapshot)
    }
  } else {
    mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, element: appStore.currentElement} as Snapshot)
  }
}
</script>
