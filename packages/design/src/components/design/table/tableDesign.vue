<template>
  <my-popover
      pressHide
      :lock="lock"
      placement="right">
    <template #reference>
      <TableView :element="element" ref="tableRef"/>
      
      <!--      <div class="cp-table-sort-line"/>-->
      <div class="cp-table-resize" v-for="(item) in resize"
           :style="{left: item.x + 'px'}"></div>
      <div class="cp-table-tool"></div>
    
    </template>
    <my-popover
        @hide="lock = false"
        trigger="click"
        placement="right">
      <template #reference>
        <el-icon class="addColumn" size="30" @click="lock = !lock">
          <CirclePlus/>
        </el-icon>
      </template>
      <el-card class="box-card">
        <el-row v-for="(item, index) in element.columnList" :key="index" class="text item">
          <el-col :span="12">
            <el-text>{{ item.label }}</el-text>
          </el-col>
          <el-col :span="12">
            <el-switch :name="item.label!" :disabled="item.option.disableEnable" @change="changeColumn"
                       v-model="item.option.enable"/>
          </el-col>
        </el-row>
      </el-card>
    </my-popover>
  </my-popover>
</template>
<script setup lang="ts">
// import { ElSwitch, ElRow, ElCol, ElCard } from 'element-plus'
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {CpElement, Point} from "@cp-print/design/types/entity";
import {CirclePlus} from "@element-plus/icons-vue";
import MyPopover from "../../cp/cp-popover/cp-popover.vue";
import TableView from "./tableView.vue";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element: CpElement
}>(), {
  element: () => ({} as CpElement)
})

const lock = ref(false)
const tableRef = ref()
let resizeObserver: ResizeObserver
onMounted(() => {
  // 创建 ResizeObserver 实例
  resizeObserver = new ResizeObserver((entries) => {
    // entries 是 ResizeObserverEntry 对象的数组
    for (const entry of entries) {
      // entry.contentRect 包含元素的新尺寸
      // console.log('元素尺寸改变:', entry.contentRect.width, entry.contentRect.height);
      props.element.runtimeOption.height = entry.contentRect.height + 1
      props.element.runtimeOption.init.height = props.element.runtimeOption.height
      props.element.height = px2unit(props.element.runtimeOption.height)
      // 在这里可以触发你的逻辑或者触发 Vue 的事件
      // this.$emit('resize', entry.contentRect);
    }
  });
  
  // 开始观察尺寸变化
  // console.log(tableRefa.value.$el)
  resizeObserver.observe(tableRef.value.$el.nextElementSibling);
})

onUnmounted(() => {
  resizeObserver.disconnect()
})

// function mousemove() {
//   console.log('mousedown')
// }

const resize = computed(() => {
  let width = 0
  const resizeControlList: Point[] = []
  // console.log(props.element.columnList)
  
  for (let i = 0; i < props.element.columnList!.length - 1; i++) {
    const column = props.element.columnList[i];
    width = width + column.runtimeOption.width
    resizeControlList.push({
      x: width,
      y: 0
    })
  }
  
  return resizeControlList
  
})

watch(() => props.element.option.tableHeightType, (n, _o) => {
  if (n == 'AUTO') {
    resizeObserver.observe(tableRef.value.$el.nextElementSibling);
  } else {
    resizeObserver.unobserve(tableRef.value.$el.nextElementSibling);
  }
})

function changeColumn() {
  // const columnList = props.element.columnList
  // let columnTotalWidth = 0;
  // for (let i = 0; i < columnList!.length; i++) {
  //   columnTotalWidth += columnList![i].width
  // }
  // props.element.width = columnTotalWidth
  // tableRef.value.computedWidth()
}

</script>
<style lang="scss" scoped>
//border-collapse: collapse;
//border-spacing: 0;


.addColumn {
  background: white;
  margin-left: 10px;
  border-radius: 15px;
}

.columnCard {
  background: white;
  
}
</style>
