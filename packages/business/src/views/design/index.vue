<script setup lang="ts">
import {CpPanel, CpText} from '@cp-print/design/index'
import {templateDetail, templateUpdate} from "@/api/template";
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import {Element, ElementOption, TextElement} from "@cp-print/design/types/entity";
import {initElement} from "@cp-print/design/utils/elementUtil";

const route = useRoute()
const text = {} as TextElement
initElement(text)
const {templateId} = route.query
const data = reactive({
  template: {}
})

onMounted(() => {
  templateDetail(Number(templateId))
      .then(res => {
        // const panel = reactive(<Panel>JSON.parse(res.data.content))
        // console.log(panel)
        data.template = res.data
        
      })
})

// function saveTemplate() {
//   // console.log(panel)
//   // console.log(template)
//   template.name = panel.name
//   template.content = JSON.stringify(panel, (key, value) => {
//     // console.log(key)
//     // 清除runtime参数
//     // console.log(this)
//     if ("runtimeOption" == key) return undefined
//     if ("status" == key) return undefined
//     return value
//   })
//   templateUpdate(template)
//       .then(res => {
//         console.log(res)
//       })
//   // templateUpdate(props.panel)
//   // console.log(JSON.stringify(toRaw(unref(props.panel))))
//
// }
</script>

<template>
  <cp-panel :template="data.template"
  ></cp-panel>
<!--  <cp-text :element="text"/>-->
</template>

<style scoped>

</style>
