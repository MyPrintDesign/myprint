<template>
  <table class="cp-print-table"
         ref="tableRef"
         :style="{maxWidth: valueUnit(element.width), width: valueUnit(element.width), height: valueUnit(element.height)}"
         @mousedown="mousedown($event)"
         @drop="drop($event)">
    <tbody>
    <tr class="border-box">
      <column-view v-for="(column, index) in columnList"
                   :element="column"
                   :key="index"/>
    </tr>
    <tr v-for="(rowList, indexTr) in props.element.runtimeOption.rowList" :key="indexTr" class="border-box">
      <td class="cp-print-table-column_body" v-for="(rowColumn, index) in rowList" :key="index"
          @click="clickBody(rowColumn)"
          :style="bodyStyle(rowColumn)">
        <TextView v-if="rowColumn.type === 'Text'" :element="rowColumn"/>
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
import {
  computed,
  onMounted,
  watch,
  // inject
} from "vue";
import {Element, ElementOption} from "../../../types/entity";
import {sortColumn} from "../../../utils/utils";
import {unit2px, px2unit} from "../../../utils/devicePixelRatio";
import {clearEventBubble} from "../../../utils/event";
// import {mittKey} from "../../../constants/keys";
import {initElement, valueUnit} from "../../../utils/elementUtil";

const props = withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})

defineExpose({computedWidth})

// const mitt = inject(mittKey)!
// console.log(selectElement)
// mitt.on('sortColumn', handleSortColumn)

const bodyStyle = (column: Element) => {
  // console.log(column)
  const style = {
    maxWidth: valueUnit(column.width),
    width: valueUnit(column.width),
    height: valueUnit(column.height)
  } as any
  if (props.element.option.borderAll) {
    style['border'] = '1px solid #771082'
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
  
  return props.element.columnList!.filter((v: any) => {
    
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
    let indexView = {} as Element;
    indexView.type = 'Text'
    indexView.option = <ElementOption>{
      disableSort: true,
      disableEnable: false,
      enable: true,
      formatter: '{{autoIncrement}}',
    }
    initElement(indexView)
    indexView.field = 'autoIncrement'
    indexView.label = '序号'
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
    columnTotalWidth += column.width
    if (maxHeight < column.height) {
      maxHeight = column.height
    }
    
    if (column.option == null) {
      column.option = {} as ElementOption
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
  if (props.element.height != maxHeight * 2) {
    // 加上2像素的border的高
    props.element.height = px2unit(unit2px(maxHeight * 2) + 2)
    // console.log(props.data!.height)
    for (let i = 0; i < props.element.columnList!.length; i++) {
      props.element.columnList![i].height = maxHeight;
    }
  }
  // console.log(maxHeight * 2)
  
  if (props.element.width < columnTotalWidth) {
    props.element.width = columnTotalWidth
    return
  }
  
  // console.log('initTable')
  computedWidth()
  
}

function computedWidth() {
  let columnTotalWidth = 0;
  // let minColumnTotalWidth = 0;
  // console.log(toRaw(unref(columnList.value)))
  // for (let i = 0; i < columnList.value.length; i++) {
  //   columnTotalWidth += columnList.value[i].width
  //   minColumnTotalWidth += columnList.value[i].minWidth
  // }
  // console.log('computedWidth', columnTotalWidth)
  
  // if (props.data!.width > columnTotalWidth) {
  const diffWidth = props.element!.width - columnTotalWidth
  
  const oneWidthAdd = diffWidth / columnList.value.length
  
  for (let i = 0; i < columnList.value.length; i++) {
    columnList.value[i].width = columnList.value[i].width + oneWidthAdd
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

<style scoped>

</style>
