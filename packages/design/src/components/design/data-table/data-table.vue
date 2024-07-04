<template>
    <table class="my-print-table"
           ref="tableRef" border="0" cellspacing="0">
        <tbody>
        <tr class="my-print-border-box" :key="'t-'+headRowIndex"
            v-for="(columnList, headRowIndex) in props.element.tableHeadList">
            <template v-for="(column) in columnList">
                <column-view
                    :key="'h'+column.id"
                    v-if="column != null"
                    :column="column"
                />
            </template>
        
        </tr>
        <tr class="my-print-border-box" :key="rowIndex" v-for="(bodyRowList, rowIndex) in props.element.tableBodyList">
            <td class="my-print-table-column_body" v-for="(body) in bodyRowList"
                :key="'b' + rowIndex + '-' + body.id"
                :ref="(el)=>setItemRef(body, el)"
                :style="bodyStyle(body)">
                <TextView v-if="body.type === 'Text'" :element="body" />
                <!--        <ImageView v-if="column.type === 'Image'" :element="convert(column, rowData, indexTr)"/>-->
            </td>
        </tr>
        
        <tr class="my-print-border-box" :key="rowIndex" v-for="(bodyRowList, rowIndex) in props.element.statisticsList">
            <td class="my-print-table-column_body" v-for="(body) in bodyRowList"
                :key="'s'+rowIndex + '-' + body.id"
                :ref="(el)=>setItemRef(body, el)"
                :style="bodyStyle(body)">
                <TextView v-if="body.type === 'Text'" :element="body" />
                <!--        <ImageView v-if="column.type === 'Image'" :element="convert(column, rowData, indexTr)"/>-->
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">

import ColumnView from './column-view.vue';
import TextView from '../text/text.vue';
import { CSSProperties, onMounted, watch } from 'vue';
import { MyElement } from '@myprint/design/types/entity';
import { useAppStoreHook } from '@myprint/design/stores/app';

const props = withDefaults(defineProps<{
    element: MyElement
}>(), {
    element: () => ({} as MyElement)
});

// console.log(props.element)
// defineExpose({ computedWidth });
const itemRefs: HTMLElement[] = [];
const setItemRef = (element: MyElement, el: any) => {
    if (el == null) {
        return;
    }
    // console.log(element, el);
    element.runtimeOption.target = el;
    itemRefs.push(el);
};

const bodyStyle = (column: MyElement) => {
    // console.log(column)
    const style = {
        // maxWidth: column.runtimeOption.width + 'px',
        // width: column.runtimeOption.width + 'px',
        // height: column.runtimeOption.init.height + 'px',
        // maxHeight: column.runtimeOption.init.height + 'px'
    } as CSSProperties;
    
    if (useAppStoreHook().displayModel == 'preview' || useAppStoreHook().displayModel == 'print') {
        style.width = column.runtimeOption.width + 'px';
    }
    
    if (column.option.borderAll) {
        // console.log(column.option.borderAll)
        style['border'] = '1px solid var(--tcolor)';
    } else {
        // style['border'] = '1px solid transparent';
    }
    if (column.contentType == 'QrCode' || column.type == 'Image') {
        style.lineHeight = 0;
    }
    return style;
};

watch(() => props.element.width, (_newQuestion, _oldQuestion) => {
    // computedWidth();
});

// const copyOption = ['font', 'fontSize', 'blob', 'italic', 'underline', 'lineThrough', 'color', 'background',
//   'textAlign', 'verticalAlign']

// const columnList = computed(() => {
//     // console.log(props.element.data)
//     return props.element.tableHeadList.filter((v) => {
//
//         // for (let string of copyOption) {
//         //   let elementOption = props.element.option as any
//         //   let vOption = v.option as any
//         //   vOption[string] = elementOption[string]
//         // }
//
//         return v.cell.option.enable != false;
//     });
// });

onMounted(() => {
    // initTable();
});

// function initTable() {
//
//     let columnTotalWidth = 0, maxHeight = -1;
//     let tableData = {} as any;
//     for (let i = 0; i < props.element.tableHeadList.length; i++) {
//         const cell = props.element.tableHeadList[i].cell;
//         // cell.id = crypto.randomUUID()
//         columnTotalWidth += cell.runtimeOption.width;
//         if (maxHeight < cell.runtimeOption.height) {
//             maxHeight = cell.runtimeOption.height;
//         }
//
//         cell.option.sort = i;
//         cell.option.enable = cell.option.enable || cell.option.enable == null;
//
//         tableData[cell.field!] = cell.data;
//
//         cell.runtimeOption.workEnvironment = 'DataTable';
//
//         // let element = new Element(props.data!.columnList[i].width, props.data!.columnList[i].height, 'Text');
//         // element.id = crypto.randomUUID()
//         // element.data = '表体' + i
//         // if (i == 2) {
//         //   element.type = 'Image'
//         //   element.data = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
//         // }
//         //
//     }
//     // console.log(maxHeight)
//     // console.log(titleHeight)
//     // console.log(tableData)
//     props.element.data = [tableData];
//
//     for (let i = 0; i < props.element.tableHeadList.length; i++) {
//         props.element.tableHeadList[i].cell.runtimeOption.height = maxHeight;
//     }
//     if (props.element.runtimeOption.height < maxHeight * 2) {
//         // 加上2像素的border的高
//         props.element.runtimeOption.height = maxHeight * 2 + 2;
//         // console.log(props.data!.height)
//         // for (let i = 0; i < props.element.columnList!.length; i++) {
//         //   props.element.columnList![i].runtimeOption.height = maxHeight;
//         // }
//     }
//     // console.log(maxHeight * 2)
//
//     if (props.element.runtimeOption.width < columnTotalWidth) {
//         props.element.runtimeOption.width = columnTotalWidth;
//         return;
//     }
//
//     // console.log('initTable')
//     computedWidth();
//
// }
//
// function computedWidth() {
//     let columnTotalWidth = 0;
//     // let minColumnTotalWidth = 0;
//     // console.log(toRaw(unref(columnList.value)))
//     for (let i = 0; i < columnList.value.length; i++) {
//         columnTotalWidth += columnList.value[i].cell.runtimeOption.width;
//         // minColumnTotalWidth += columnList.value[i].minWidth
//     }
//     // console.log('computedWidth', columnTotalWidth)
//
//     // if (props.data!.width > columnTotalWidth) {
//     const diffWidth = props.element.runtimeOption.width - columnTotalWidth;
//
//     const oneWidthAdd = diffWidth / columnList.value.length;
//
//     for (let i = 0; i < props.element.tableHeadList.length; i++) {
//         const head = props.element.tableHeadList[i].cell;
//         // const body = props.element.bodyList[0][i]
//         head.runtimeOption.width = head.runtimeOption.width + oneWidthAdd;
//         head.width = px2unit(head.runtimeOption.width);
//
//         // body.runtimeOption.width = head.runtimeOption.width
//         // body.width = head.width
//     }
//     // }
// }

// function convert(column, rowData, indexTr) {
//   console.log("convert", indexTr)
//   column.data = rowData[column.field]
//   return column
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
