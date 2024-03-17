<template>
  <table class="cp-print-table"
         ref="tableRef">
    <tbody>
    <tr class="border-box" :key="0">
      <column-view v-for="(column, index) in props.element.headList"
                   :element="column"
                   :key="index"/>
    </tr>
    <tr class="border-box" :key="rowIndex" v-for="(bodyRowList, rowIndex) in props.element.bodyList">
      <td class="cp-print-table-column_body" v-for="(body, colIndex) in bodyRowList" :key="colIndex"
          :style="bodyStyle(body)">
        <TextView v-if="body.type === 'Text'" :element="body"/>
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
import {computed, CSSProperties, onMounted, watch} from "vue";
import {CpElement} from "@cp-print/design/types/entity";
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element: CpElement
}>(), {
  element: () => ({} as CpElement)
})

// console.log(props.element)
defineExpose({computedWidth})

const bodyStyle = (column: CpElement) => {
  // console.log(column)
  const style = {
    // maxWidth: column.runtimeOption.width + 'px',
    // width: column.runtimeOption.width + 'px',
    // height: column.runtimeOption.init.height + 'px',
    // maxHeight: column.runtimeOption.init.height + 'px'
  } as CSSProperties
  if (column.option.borderAll) {
    // console.log(column.option.borderAll)
    style['border'] = '1px solid var(--tcolor)'
  }
  if (column.contentType == 'QrCode' || column.type == 'Image') {
    style.lineHeight = 0
  }
  return style
}

watch(() => props.element.width, (_newQuestion, _oldQuestion) => {
  computedWidth()
})

// const copyOption = ['font', 'fontSize', 'blob', 'italic', 'underline', 'lineThrough', 'color', 'background',
//   'textAlign', 'verticalAlign']

const columnList = computed(() => {
  // console.log(props.element.data)
  return props.element.headList.filter((v: any) => {
    
    // for (let string of copyOption) {
    //   let elementOption = props.element.option as any
    //   let vOption = v.option as any
    //   vOption[string] = elementOption[string]
    // }
    
    return v.option.enable != false
  })
})

onMounted(() => {
  initTable()
})

function initTable() {
  
  let columnTotalWidth = 0, maxHeight = -1;
  let tableData = {} as any
  for (let i = 0; i < props.element.headList!.length; i++) {
    const column = props.element.headList![i]
    // column.id = crypto.randomUUID()
    columnTotalWidth += column.runtimeOption.width
    if (maxHeight < column.runtimeOption.height) {
      maxHeight = column.runtimeOption.height
    }
    
    column.option.sort = i;
    column.option.enable = column.option.enable || column.option.enable == null;
    
    tableData[column.field!] = column.data
    
    column.runtimeOption.workEnvironment = 'DataTable'
    
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
  
  for (let i = 0; i < props.element.headList.length; i++) {
    props.element.headList[i].runtimeOption.height = maxHeight;
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
  
  for (let i = 0; i < props.element.headList.length; i++) {
    const head = props.element.headList[i]
    // const body = props.element.bodyList[0][i]
    head.runtimeOption.width = head.runtimeOption.width + oneWidthAdd
    head.width = px2unit(head.runtimeOption.width)
    
    // body.runtimeOption.width = head.runtimeOption.width
    // body.width = head.width
  }
  // }
}

// function convert(column, rowData, indexTr) {
//   console.log("convert", indexTr)
//   column.data = rowData[column.field]
//   return column
// }

// function clickColumn(clickColumn: CpElement) {
//   // console.log('click')
//   emit('clickColumn', clickColumn)
// }

//
// function mousedown(_ev: MouseEvent) {
// ev.stopPropagation()
// }

// function drop(event: MouseEvent) {
//   console.log('drop1', event)
//   clearEventBubble(event)
//   event.preventDefault()
// }


</script>
