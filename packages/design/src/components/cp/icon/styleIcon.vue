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
      enable?: boolean | undefined,
      marginTop?: string,
    }>(),
    {
      props: "",
      propsValue: undefined,
      enableProps: "",
      enable: undefined,
      marginTop: ""
    })
// console.log(props.tips)

const value = computed(() => {
  
  const result = multipleElementGetValue(props.props)
  
  if (props.propsValue == undefined) {
    return result
  } else {
    return result === props.propsValue
  }
})

const enable = computed(() => {
  if (props.enable !== undefined) {
    return props.enable
  }
  if (appStore.currentElement.length == 0) {
    return false
  }
  for (let currentElementElement of appStore.currentElement) {
    if (!hasStyle(currentElementElement.type, props.enableProps as any)) {
      // console.log(props.enableProps, 'false')
      return false
    }
  }
  // console.log(props.enableProps, 'true')
  return true
})

function change(val: boolean) {
  let tmpVal: any = val
  if (props.propsValue != undefined) {
    if (val) {
      tmpVal = props.propsValue
    }
  }
  
  // console.log(val)
  // console.log(appStore.currentElement)
  multipleElementSetValue(props.props, tmpVal)
  
  mitt.emit('panelSnapshot', {action: ActionEnum.UPDATE_STYLE, elementList: appStore.currentElement} as Snapshot)
  
}
</script>
