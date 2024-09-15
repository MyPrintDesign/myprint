<template>
    <table class="my-print-table"
           ref="tableRef" border="0" cellspacing="0">
        <tbody>
        <tr class="my-print-border-box" :key="'t-'+headRowIndex"
            v-for="(columnList, headRowIndex) in props.element.tableHeadList">
            <template v-for="(column) in columnList">
                <column-view
                    :key="'head'+column.id"
                    v-if="column != null"
                    :column="column" />
            </template>
        </tr>
        <tr class="my-print-border-box" :key="rowIndex" v-for="(bodyRowList, rowIndex) in props.element.tableBodyList">
            <td class="my-print-table-column_body" v-for="(body) in bodyRowList"
                :key="'body' + rowIndex + '-' + body.id"
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
import TextView from '../../text';
import { CSSProperties, onMounted, watch } from 'vue-demi';
import { MyElement } from '@myprint/design/types/entity';
import { useAppStoreHook } from '@myprint/design/stores/app';

const props = withDefaults(defineProps<{
    element: MyElement
}>(), {
    element: () => ({} as MyElement)
});

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

onMounted(() => {
    // initTable();
});

</script>
