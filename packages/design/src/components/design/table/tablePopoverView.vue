<template>
  <my-popover
      pressHide
      :lock="lock"
      placement="right">
    <template #reference>
      <TableView :element="element" ref="tableRef"/>
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
            <el-switch :name="item.label" :disabled="item.option.disableEnable" @change="changeColumn"
                       v-model="item.option.enable"/>
          </el-col>
        </el-row>
      </el-card>
    </my-popover>
  </my-popover>
</template>
<script setup lang="ts">
import { ElSwitch, ElRow, ElCol, ElCard } from 'element-plus'
import {
  PropType,
  ref
} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {CirclePlus} from "@element-plus/icons-vue";
import MyPopover from "../../cp/cp-popover/cp-popover.vue";
import TableView from "./tableView.vue";


const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})

const lock = ref(false)
const tableRef = ref({})

function changeColumn() {
  const columnList = props.element.columnList
  let columnTotalWidth = 0;
  for (let i = 0; i < columnList.length; i++) {
    columnTotalWidth += columnList[i].width
  }
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
