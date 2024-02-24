<template>
  <el-container :class="configStore.cursor">
    <el-aside width="180" style="border-right: 1px #e9e9e9 solid; background: #f8f8f8">
      <options :module="data.template.module"/>
    </el-aside>
    <el-main>
      <DesignContent/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
// import { ElContainer, ElAside, ElMain } from 'element-plus'
import Options from "./options/options.vue";
import DesignContent from './content/index.vue'
import {
  inject,
  onMounted, provide, reactive, Ref, ref, watch
} from "vue";
import {Container, Panel, Provider} from "@cp-print/design/types/entity";
import {to} from "@cp-print/design/utils/utils";
import {
  mittKey, panelKey, previewDataKey, providerKey
} from "@cp-print/design/constants/keys";
import {init} from "@cp-print/design/utils/historyUtil";
import {setCurrentPanel, initElement, parentInitElement} from "@cp-print/design/utils/elementUtil";
import {Template} from "@cp-print/design/types/R";
import {useConfigStore} from "@cp-print/design/stores/config";

const configStore = useConfigStore()

const $emit = defineEmits(["saveTemplate"])

const provider = ref({}) as Ref<Provider>
const panel = reactive({}) as Panel
const mitt = inject(mittKey)!
const previewData = ref<any>({} as any)
provide(panelKey, panel)
provide(providerKey, provider)
provide(previewDataKey, previewData)

mitt.on('saveTemplate', saveTemplate)

const props = withDefaults(defineProps<{
  template?: Template
}>(), {
  template: () => ({} as Template)
})
const data = reactive({
  template: {} as Template
})

// let template: Template

watch(() => props.template.id, (n, _o) => {
  if (n != null) {
    data.template = props.template
    to(JSON.parse(props.template.content), panel)
    console.log(panel)
    previewData.value = JSON.parse(props.template.module.previewData!)
    setCurrentPanel(panel)
    panel.type = 'Panel'
    if (!panel.watermarkContent) {
      panel.watermarkContent = 'cp-print'
    }
    if (!panel.groupList) {
      panel.groupList = []
    }
    for (let i = 0; i < panel.elementList.length; i++) {
      const element = panel.elementList[i]
      parentInitElement(panel as Container, element, i)
      if (element.type == 'Table') {
        for (let i = 0; i < element.columnList.length; i++) {
          initElement(element.columnList[i], i)
        }
      }
    }
    panel.pageHeader && parentInitElement(panel, panel.pageHeader, 0)
    panel.pageFooter && parentInitElement(panel, panel.pageFooter, 0)
    
    init()
    
    provider.value = JSON.parse(data.template.module.provider!)
    // console.log(provider.value.elementList)
    if (provider.value.elementList) {
      for (let elementListElement of provider.value.elementList) {
        if (elementListElement.type == 'Table') {
          let width = 0, height = 0
          for (let columnListElement of elementListElement.columnList!) {
            width += columnListElement.width
            height = Math.max(height, columnListElement.height)
          }
          elementListElement.width = width + 30
          elementListElement.height = height * 2
        }
      }
    }
//   templateDetail(Number(templateId))
//       .then(res => {
//         // const panel = reactive(<Panel>JSON.parse(res.data.content))
//         // console.log(panel)
//
//         // provide(panelKey, panel)
//
//       })
    
    mitt.emit('updatePanel')
    mitt.emit('changePageSize')
    
  }
}, {immediate: true})

onMounted(() => {

})

function saveTemplate() {
  // console.log(panel)
  // console.log(template)
  const template = {} as Template
  template.name = panel.name
  template.content = JSON.stringify(panel, (key, value) => {
    // console.log(key)
    // 清除runtime参数
    // console.log(this)
    if ("runtimeOption" == key) return undefined
    if ("status" == key) return undefined
    return value
  })
  
  $emit("saveTemplate", template);
}
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-main {
  padding: 0;
}
</style>
