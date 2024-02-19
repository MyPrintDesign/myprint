<template>
  <div class="design-panel-container">
    <Toolbar/>
    <div class="display-flex design-panel-container-height design-panel-wrapper">
      <cp-panel/>
      <div style="background: white;" class="display-flex-column width-20">
        <div v-for="(value, key) in handlePanelElementList"
             @click="clickHandlePanelIcon(key)"
             :class="['cp-icon handle-panel-icon iconfont',{'handle-panel-icon-active': configStore.settingPanel[key].visible}, value.icon]"
             :key="key"/>
        <history-panel/>
        <operation-panel/>
        <setting-panel/>
      </div>
      <minimap-panel/>
    </div>
    <!--      <div class="display-flex width-100-p">-->
    <!--        -->
    <!--        -->
    
    <!--      </div>-->
  </div>
  <preview-panel/>
</template>

<script setup lang="ts">
// import { ElScrollbar } from 'element-plus'
import {
  // inject,
  onMounted
} from "vue";

import Toolbar from '../toolbar/toolbar.vue'
import PreviewPanel from "../../preview/previewPanel.vue";
// import {mittKey} from "@cp-print/design/constants/keys";
// import {ScrollbarInstance} from "element-plus";
// import ElementResizeDetectorMaker from "element-resize-detector";
// import _ from 'lodash'
import CpPanel from "./cp-panel.vue";
import {handlePanelElementList} from "@cp-print/design/constants/settingPanel";
import HistoryPanel from "../handle-panel/history-panel.vue";
import OperationPanel from "../handle-panel/operation-panel.vue";
import SettingPanel from "../handle-panel/setting/setting-panel.vue";
import {useConfigStore} from "@cp-print/design/stores/config";
import MinimapPanel from "@cp-print/design/components/panel/handle-panel/minimap-panel.vue";

const configStore = useConfigStore()

// const scrollbarRef = ref<HTMLElement>()!

// const mitt = inject(mittKey)!
// 事件绑定
// mitt.on("preview", preview)
// mitt.on('scaleMove', scaleMove)


/**
 * minimap 的 移动事件
 * @param data
 */
// function scaleMove(data:any) {
//   scrollbarRef.value!.scrollTo(data.x, data.y)
// }

function clickHandlePanelIcon(key: any) {
  configStore.settingPanel[key].visible = !configStore.settingPanel[key].visible
}

onMounted(() => {
  
  // let erd = ElementResizeDetectorMaker();
  // // console.log(scrollbarRef.value.wrapRef)
  // erd.listenTo(scrollbarRef.value.wrapRef, (ele) => {
  //   scrollResize(ele)
  // });
  //
})

// const scrollResize = _.debounce((_ele) => {
// console.log(ele.offsetWidth, ele.offsetHeight)
// contentScale.scrollWidth = ele.offsetWidth
// contentScale.scrollHeight = ele.offsetHeight
// }, 100)

// function generalTemplateData() {
// props.panel!.elementList = elementList.value
// config.value.unit = 'px'
// props.panel.elementList = elementList.value
// console.log(toRaw(unref(props.panel)))
// }

// function preview() {
// mitt.emit('previewPanel', props.panel)
// console.log({width: mm2px(props.panel.width), height: mm2px(props.panel.height)})
// }


</script>
