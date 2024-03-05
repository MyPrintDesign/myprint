<template>
  <table class="cp-print-table"
         ref="tableRef"
         @mousedown="mousedown($event)"
         @drop="drop($event)">
    <tbody>
    <tr class="border-box" :key="1">
      <column-view v-for="(column, index) in columnList"
                   :element="column"
                   :key="index"/>
    </tr>
    <tr class="border-box" :key="2">
      <td class="cp-print-table-column_body" v-for="(column, index) in columnList" :key="index"
          @click="clickBody(column.columnBody)"
          :style="bodyStyle(column.columnBody)">
        <TextView v-if="column.columnBody.type === 'Text'" :element="column.columnBody"/>
        <!--        <ImageView v-if="column.type === 'Image'" :element="convert(column, rowData, indexTr)"/>-->
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">

import ColumnView from "./columnView.vue";
// import ImageView from "../image/image.vue";
import TextView from "../text/text.vue";
import {computed, inject, onMounted, watch} from "vue";
import {CpElement, ElementOption} from "@cp-print/design/types/entity";
import {sortColumn} from "@cp-print/design/utils/utils";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {clearEventBubble} from "@cp-print/design/utils/event";
import {mittKey} from "@cp-print/design/constants/keys";
import {initElement} from "@cp-print/design/utils/elementUtil";

const props = withDefaults(defineProps<{
  element: CpElement
}>(), {
  element: () => ({} as CpElement)
})

defineExpose({computedWidth})

const mitt = inject(mittKey)!
// console.log(selectElement)
mitt.on('sortColumn', handleSortColumn)

const bodyStyle = (column: CpElement) => {
  // console.log(column)
  const style = {
    maxWidth: column.runtimeOption.width + 'px',
    width: column.runtimeOption.width + 'px',
    height: column.runtimeOption.height + 'px',
    maxHeight: column.runtimeOption.height + 'px'
  } as any
  if (props.element.option.borderAll) {
    style['border'] = '1px solid white'
  }
  return style
}

watch(() => props.element.width, (_newQuestion, _oldQuestion) => {
  computedWidth()
})

const copyOption = ['font', 'fontSize', 'blob', 'italic', 'underline', 'lineThrough', 'color', 'background',
  'textAlign', 'verticalAlign']

const columnList = computed(() => {
  // console.log(props.element.data)
  return props.element.columnList.filter((v: any) => {
    
    for (let string of copyOption) {
      let elementOption = props.element.option as any
      let vOption = v.option as any
      vOption[string] = elementOption[string]
    }
    
    return v.option.enable != false
  })
})

onMounted(() => {
  if (!props.element.columnList) {
    props.element.columnList = []
  }
  
  if (props.element.columnList.length == 0 || props.element.columnList[0].label !== '序号') {
    let indexView = {
      type: "Text",
      option: <ElementOption>{
        disableSort: true,
        disableEnable: false,
        enable: true,
        formatter: '{{autoIncrement}}',
      }
    } as CpElement;
    initElement(indexView, props.element.columnList.length)
    indexView.field = 'autoIncrement'
    indexView.label = '序号'
    
    indexView.columnBody = {
      type: "Text",
      data: "1",
      option: {...indexView.option}
    } as CpElement
    initElement(indexView.columnBody, 0)
    
    props.element.columnList.unshift(indexView)
  }
  
  initTable()
})

//
function initTable() {
  
  let columnTotalWidth = 0, maxHeight = -1;
  let tableData = {} as any
  for (let i = 0; i < props.element.columnList!.length; i++) {
    const column = props.element.columnList![i]
    column.id = crypto.randomUUID()
    columnTotalWidth += column.runtimeOption.width
    if (maxHeight < column.runtimeOption.height) {
      maxHeight = column.runtimeOption.height
    }
    
    column.option.sort = i;
    column.option.enable = column.option.enable || column.option.enable == null;
    
    tableData[column.field!] = column.data
    
    column.runtimeOption.workEnvironment = 'Table'
    
    // let element = new Element(props.data!.columnList[i].width, props.data!.columnList[i].height, 'Text');
    // element.id = crypto.randomUUID()
    // element.data = '表体' + i
    // if (i == 2) {
    //   element.type = 'Image'
    //   element.data = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    // }
    //
  }
  // console.log(maxHeight)
  // console.log(titleHeight)
  // console.log(tableData)
  props.element.data = [tableData]
  
  for (let i = 0; i < props.element.columnList.length; i++) {
    props.element.columnList[i].runtimeOption.height = maxHeight;
  }
  if (props.element.runtimeOption.height < maxHeight * 2) {
    // 加上2像素的border的高
    props.element.runtimeOption.height = maxHeight * 2 + 2
    // console.log(props.data!.height)
    // for (let i = 0; i < props.element.columnList!.length; i++) {
    //   props.element.columnList![i].runtimeOption.height = maxHeight;
    // }
  }
  // console.log(maxHeight * 2)
  
  if (props.element.runtimeOption.width < columnTotalWidth) {
    props.element.runtimeOption.width = columnTotalWidth
    return
  }
  
  // console.log('initTable')
  computedWidth()
  
}

function computedWidth() {
  let columnTotalWidth = 0;
  // let minColumnTotalWidth = 0;
  // console.log(toRaw(unref(columnList.value)))
  for (let i = 0; i < columnList.value.length; i++) {
    columnTotalWidth += columnList.value[i].runtimeOption.width
    // minColumnTotalWidth += columnList.value[i].minWidth
  }
  // console.log('computedWidth', columnTotalWidth)
  
  // if (props.data!.width > columnTotalWidth) {
  const diffWidth = props.element.runtimeOption.width - columnTotalWidth
  
  const oneWidthAdd = diffWidth / columnList.value.length
  
  for (let i = 0; i < columnList.value.length; i++) {
    columnList.value[i].runtimeOption.width = columnList.value[i].runtimeOption.width + oneWidthAdd
    columnList.value[i].width = px2unit(columnList.value[i].runtimeOption.width)
    
    // console.log(columnList.value[i].columnBody)
    columnList.value[i].columnBody.runtimeOption.width = columnList.value[i].runtimeOption.width
    columnList.value[i].columnBody.width = columnList.value[i].width
  }
  // }
}

// function convert(column, rowData, indexTr) {
//   console.log("convert", indexTr)
//   column.data = rowData[column.field]
//   return column
// }

//
function mousedown(_ev: MouseEvent) {
  // ev.stopPropagation()
}

function drop(event: MouseEvent) {
  console.log('drop1', event)
  clearEventBubble(event)
  event.preventDefault()
}

function handleSortColumn(data: any) {
  sortColumn(props.element?.columnList, data.dragData, data.b, data.flag)
}

function clickBody(_column: any) {
  // selectElement.value = column
}

</script>
