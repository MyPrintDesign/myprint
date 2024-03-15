<template>
  <my-popover
      pressHide
      :lock="lock"
      placement="right"
      ref="tableDesignRef">
    <template #reference>
      
      <TableView :element="element" ref="tableRef"/>
      
      <template v-if="'HANDLE_ED' == element.runtimeOption.status">
        
        <div class="cp-table-control-head-point" v-for="(item, index) in data.controlPointList"
             :class="{'cp-table-control-head-point-active': data.col == index && data.status != 'RESIZE'}"
             :style="{left: item.x + 'px'}"
             @mousedown="controlPointMouseDown($event, index)">
          <div class="cp-table-control-head-box-point"/>
        </div>
        
        <div class="cp-table-resize" v-for="(item, index) in data.resizeControlList"
             :style="{left: item.x + 'px'}" @mousedown="resizeMouseDown($event, index)"/>
        
        <!--        <div class="cp-table-tool"/>-->
        
        <div class="cp-table-highlight-sort"
             :style="{left: data.highlightSort.x + 'px'}"
             v-show="data.highlightSort.visibility == 'visible'"/>
        
        <div class="cp-table-highlight-column pointer-events"
             v-show="data.highlightColumn.visibility == 'visible'"
             :style="{
        left: data.highlightColumn.x+'px',
        top: data.highlightColumn.y+'px',
        width: data.highlightColumn.width+'px',
        height: data.highlightColumn.height+'px',
           }"
        />
      </template>
    
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
        <el-row v-for="(item, index) in element.headList" :key="index" class="text item">
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
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {Container, CpElement} from "@cp-print/design/types/entity";
import {CirclePlus} from "@element-plus/icons-vue";
import MyPopover from "../../cp/cp-popover/cp-popover.vue";
import TableView from "./tableView.vue";
import {defaultElement, elementHandleStatusList} from "@cp-print/design/constants/common";
import {tableColClone} from "@cp-print/design/utils/dom";
import {useAppStoreHook} from "@cp-print/design/stores/app";
import {sortColumn} from "@cp-print/design/utils/utils";
import {updateMoveableRect} from "@cp-print/design/components/moveable/moveable";
import _ from 'lodash'
import {setCurrentElement} from "@cp-print/design/utils/elementUtil";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element: CpElement
}>(), {
  element: () => ({} as CpElement)
})
const lock = ref(false)
const data = reactive({
  status: "NONE",
  td: undefined,
  row: -1,
  col: -1,
  controlPointMouseDownIs: false,
  tableMouseEnterIs: false,
  highlightSort: {
    x: 0,
    y: 0,
    visibility: "hidden"
  } as Container,
  highlightColumn: {
    row: -1,
    col: -1,
    type: "NONE",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visibility: "hidden"
  },
  controlPointList: [] as any[],
  resizeControlList: [] as any[]
})
const tableRef = ref()
const tableDesignRef = ref()
const useApp = useAppStoreHook()
const bodyList = props.element.bodyList[0]
let resizeObserver: ResizeObserver
onMounted(() => {
  
  // 创建 ResizeObserver 实例
  resizeObserver = new ResizeObserver((entries) => {
    // entries 是 ResizeObserverEntry 对象的数组
    for (const entry of entries) {
      // console.log(entry)
      // entry.contentRect 包含元素的新尺寸
      // console.log('元素尺寸改变:', entry.contentRect.width, entry.contentRect.height);
      props.element.runtimeOption.height = entry.contentRect.height + 1
      props.element.runtimeOption.init.height = props.element.runtimeOption.height
      props.element.width = px2unit(props.element.runtimeOption.width)
      // props.element.height = px2unit(props.element.runtimeOption.height)

    }
  });
  resizeObserver.observe(tableRef.value.$el);
  
  tableRef.value.$el.parentNode.addEventListener('mouseover', function (event: any) {
    const target = event.target;
    const cell = target.closest('td')
    if (cell == undefined) {
      return
    }
    const rowIndex = cell.parentNode.rowIndex;
    // console.log('123213', cell.cellIndex, rowIndex)
    data.td = cell
    data.row = rowIndex
    data.col = cell.cellIndex
    data.tableMouseEnterIs = true
  });
  
  tableRef.value.$el.parentNode.addEventListener('mouseleave', function (_event: MouseEvent) {
    // console.log('离开')
    data.tableMouseEnterIs = false
    
    if (!data.controlPointMouseDownIs) {
      data.row = -1
      data.col = -1
    }
  });
  
})

onUnmounted(() => {
  resizeObserver.disconnect()
})

function controlPointMouseDown(ev: MouseEvent, col: number) {
  
  data.row = 0
  data.col = col
  data.controlPointMouseDownIs = true
  
  const columnRect = (data.td! as HTMLElement).getBoundingClientRect()
  const tableRect = (tableRef.value.$el as HTMLElement).getBoundingClientRect()
  const columnLeft = columnRect.left;
  const columnTop = columnRect.top;
  const columnWidth = columnRect.width;
  
  const tableLeft = tableRect.left;
  const tableWidth = tableRect.width;
  
  let column: CpElement = props.element.headList[data.col]
  let clientStartX = ev.clientX
  
  tableColClone.show(columnLeft, columnTop, column.runtimeOption.width, column.runtimeOption.parent?.runtimeOption.height,
      tableRef.value.$el.rows, data.col)
  
  let targetIndex: number | undefined = undefined
  
  function controlPointMouseMove(ev: MouseEvent) {
    let clientMoveX = ev.clientX
    const columnCloneLeft = columnLeft + clientMoveX - clientStartX
    const offsetX = columnCloneLeft + columnWidth / 2 - tableLeft
    let findIs = false
    
    if (columnCloneLeft >= tableLeft - columnWidth && columnCloneLeft + columnWidth <= tableLeft + tableWidth + columnWidth) {
      tableColClone.move(columnCloneLeft)
      
      for (let i = 0; i < props.element.headList.length; i++) {
        let columnTmp = props.element.headList[i]
        if (columnTmp === column) {
          continue
        }
        
        if (offsetX >= (i == 0 ? columnTmp.runtimeOption.x - column.width : columnTmp.runtimeOption.x)
            && offsetX <= columnTmp.runtimeOption.x + (i == props.element.headList.length - 1 ? columnTmp.runtimeOption.width + column.runtimeOption.width : columnTmp.runtimeOption.width)) {
          if (offsetX <= columnTmp.runtimeOption.x + columnTmp.runtimeOption.width / 2) {
            if (i == data.col + 1) {
              continue
            }
            data.highlightSort.x = columnTmp.runtimeOption.x
            targetIndex = i
            findIs = true
          } else {
            if (i == data.col - 1) {
              continue
            }
            data.highlightSort.x = columnTmp.runtimeOption.x + columnTmp.runtimeOption.width
            targetIndex = i + 1
            findIs = true
          }
          break
        }
      }
    }
    
    if (findIs) {
      data.highlightSort.visibility = 'visible'
    } else {
      targetIndex = undefined
      data.highlightSort.visibility = 'hidden'
    }
  }
  
  function controlPointMouseUp(_ev: MouseEvent) {
    if (targetIndex != undefined) {
      // console.log(targetIndex)
      if (targetIndex > data.col) {
        targetIndex--
      }
      sortColumn(props.element, data.col, targetIndex)
      if (data.highlightColumn.col == data.col) {
        data.highlightColumn.col = targetIndex
      }
    }
    document.removeEventListener('mousemove', controlPointMouseMove)
    document.removeEventListener('mouseup', controlPointMouseUp)
    // console.log('up')
    tableColClone.hidden()
    useApp.dataRotation = "none"
    
    data.controlPointMouseDownIs = false
    
    if (!data.tableMouseEnterIs) {
      data.row = -1
      data.col = -1
    }
    data.highlightSort.visibility = 'hidden'
  }
  
  useApp.dataRotation = "move"
  ev.stopPropagation()
  // console.log('down')
  document.addEventListener('mousemove', controlPointMouseMove)
  document.addEventListener('mouseup', controlPointMouseUp)
}

function resizeMouseDown(ev: MouseEvent, col: number) {
  // console.log(col)
  const clientStartX = ev.clientX
  const columnElement = props.element.headList[col]
  const bodyElement = bodyList[col]
  const columnOldWidth = props.element.headList[col].runtimeOption.width
  const tableOldWidth = props.element.runtimeOption.width
  useApp.dataRotation = 'col-resize'
  data.status = "RESIZE"
  
  function resizeMouseMove(ev: MouseEvent) {
    const offsetX = ev.clientX - clientStartX
    // console.log(offsetX, col)
    const newWidth = columnOldWidth + offsetX
    if (newWidth > 20) {
      columnElement.runtimeOption.width = columnOldWidth + offsetX
      bodyElement.runtimeOption.width = columnOldWidth + offsetX
      props.element.runtimeOption.width = tableOldWidth + offsetX
      props.element.runtimeOption.init.width = tableOldWidth + offsetX
      updateMoveableRect()
    }
  }
  
  function resizeMouseUp() {
    useApp.dataRotation = 'none'
    data.status = "NONE"
    document.removeEventListener('mousemove', resizeMouseMove)
    document.removeEventListener('mouseup', resizeMouseUp)
  }
  
  ev.stopPropagation()
  document.addEventListener('mousemove', resizeMouseMove)
  document.addEventListener('mouseup', resizeMouseUp)
}

//重新计算高

function tableMouseDown(ev: MouseEvent) {
  let column: CpElement = props.element.headList[data.col]
  let bodyElement: CpElement = bodyList[data.col]
  let clientStartX = ev.clientX, clientStartY = ev.clientY
  
  data.highlightColumn.width = column.runtimeOption.width
  data.highlightColumn.x = column.runtimeOption.x
  data.highlightColumn.row = data.row
  data.highlightColumn.col = data.col
  if (data.row == 0) {
    data.highlightColumn.y = 0
    data.highlightColumn.height = column.runtimeOption.height
    setCurrentElement([column])
  } else {
    data.highlightColumn.y = column.runtimeOption.height
    data.highlightColumn.height = bodyElement.runtimeOption.height
    setCurrentElement([bodyElement])
  }
  
  function tableMouseUp(ev: MouseEvent) {
    let clientEndX = ev.clientX, clientEndY = ev.clientY
    
    if (clientEndX == clientStartX && clientEndY == clientStartY) {
      // click
      data.highlightColumn.visibility = 'visible'
    }
    
    document.removeEventListener('mouseup', tableMouseUp)
  }
  
  document.addEventListener('mouseup', tableMouseUp)
}

watch(() => props.element.option.tableHeightType, (n, _o) => {
  if (n == 'AUTO') {
    resizeObserver.observe(tableRef.value.$el);
  } else {
    resizeObserver.unobserve(tableRef.value.$el);
  }
})

watch(() => props.element.runtimeOption.status, (n, _o) => {
  if (elementHandleStatusList.includes(n)) {
    // console.log('han')
    tableRef.value.$el.addEventListener('mousedown', tableMouseDown);
    // tableRef.value.$el.nextElementSibling.addEventListener('mousedown', tableMouseDown);
  } else {
    tableRef.value.$el.removeEventListener('mousedown', tableMouseDown);
    data.highlightColumn.visibility = 'hidden'
    setCurrentElement(defaultElement)
  }
})

watch(props.element.headList, (_n, _o) => {
  computeColumn()
})

const computeColumn = _.throttle(() => {
  // console.log('---')
  data.controlPointList.length = 0
  data.resizeControlList.length = 0
  let width = 0
  
  for (let i = 0; i < props.element.headList!.length; i++) {
    const column = props.element.headList[i];
    column.runtimeOption.x = width
    width = width + column.runtimeOption.width
    data.controlPointList.push({
      x: column.runtimeOption.x + column.runtimeOption.width / 2 - 10,
      y: 0
    })
    
    data.resizeControlList.push({
      x: column.runtimeOption.x + column.runtimeOption.width - 5,
      y: 0
    })
  }
  
  if (data.highlightColumn.col != -1) {
    const columnElement = props.element.headList[data.highlightColumn.col]
    const bodyElement = bodyList[data.highlightColumn.col]
    data.highlightColumn.width = columnElement.runtimeOption.width
    data.highlightColumn.x = columnElement.runtimeOption.x
    
    if (data.highlightColumn.y != 0) {
      data.highlightColumn.y = columnElement.runtimeOption.height
      data.highlightColumn.height = bodyElement.runtimeOption.height
    } else {
      data.highlightColumn.height = columnElement.runtimeOption.height
    }
    
  }
}, 10)

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
