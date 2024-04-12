<template>
    
    
    <DataTable :element="element" ref="tableRef" />
    
    <template v-if="'HANDLE_ED' == element.runtimeOption.status && !element.lock">
        
        <div class="my-table-resize" v-for="(item, index) in data.resizeControlList"
             :style="{left: item.x + 'px'}" @mousedown="resizeMouseDown($event, index)" />
        
        <div class="my-table-row-resize" v-for="(item, index) in data.rowResizeControlList"
             :style="{left: item.x + 'px'}" @mousedown="resizeMouseDown($event, index)" />
        
        <!--        <div class="my-table-tool"/>-->
        
        <div class="my-table-highlight-sort"
             :style="{left: data.highlightSort.x + 'px'}"
             v-show="data.highlightSort.visibility == 'visible'" />
        
        <div class="my-table-highlight-column pointer-events"
             v-show="data.highlightColumn.visibility == 'visible'"
             :style="{
        left: (data.highlightColumn.x-1)+'px',
        top: (data.highlightColumn.y)+'px',
        width: (data.highlightColumn.width+2)+'px',
        height: (data.highlightColumn.height + 3)+'px',
           }"
        />
        
        <div class="my-table-control-head-point iconfont icon-sigedian" v-for="(item, index) in data.controlPointList"
             :class="{'my-table-control-head-point-active': data.col == index && data.status != 'RESIZE'}"
             :style="{left: item.x + 'px'}"
             @mousedown="controlPointMouseDown($event, index)">
        </div>
        
        <div class="my-table-control-head-col-point iconfont icon-sigedian"
             v-for="(item, index) in data.rowControlPointList"
             :class="{'my-table-control-head-point-active': data.row == index && data.status != 'RESIZE'}"
             :style="{top: item.y + 'px'}"
             @mousedown="controlPointMouseDown($event, index)">
            <div style="color: black">{{data.row}}</div>
        </div>
    </template>

</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { Container, MyElement } from '@myprint/design/types/entity';
import DataTable from './data-table.vue';
import { defaultElement, elementHandleStatusList } from '@myprint/design/constants/common';
import { tableColClone } from '@myprint/design/utils/dom';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { sortColumn } from '@myprint/design/utils/utils';
import { freshMoveableOption, updateMoveableRect } from '@myprint/design/plugins/moveable/moveable';
import _ from 'lodash';
import { setCurrentElement, setElementHeightPx } from '@myprint/design/utils/elementUtil';
import { px2unit } from '@myprint/design/utils/devicePixelRatio';

type MyRow = Record<number, Record<number, null>>

const props = withDefaults(defineProps<{
    element: MyElement
}>(), {
    element: () => ({} as MyElement)
});
// const lock = ref(false)
const data = reactive({
    status: 'NONE',
    td: undefined,
    row: -1,
    col: -1,
    controlPointMouseDownIs: false,
    tableMouseEnterIs: false,
    highlightSort: {
        x: 0,
        y: 0,
        visibility: 'hidden'
    } as Container,
    highlightColumn: {
        rowList: {} as MyRow,
        type: 'NONE',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visibility: 'hidden'
    },
    controlPointList: [] as any[],
    resizeControlList: [] as any[],
    rowControlPointList: [] as any[],
    rowResizeControlList: [] as any[]
});
const tableRef = ref();
const useApp = useAppStoreHook();
const bodyList = props.element.bodyList[0];
let resizeObserver: ResizeObserver;
onMounted(() => {
    
    // 创建 ResizeObserver 实例
    resizeObserver = new ResizeObserver((entries) => {
        // entries 是 ResizeObserverEntry 对象的数组
        for (const entry of entries) {
            // console.log(entry)
            // entry.contentRect 包含元素的新尺寸
            // console.log('元素尺寸改变:', entry.contentRect.width, entry.contentRect.height);
            setElementHeightPx(entry.contentRect.height + 1, props.element);
            props.element.width = px2unit(props.element.runtimeOption.width);
            
            // props.element.height = px2unit(props.element.runtimeOption.height)
            nextTick(() => {
                updateMoveableRect();
            });
        }
    });
    // resizeObserver.observe(tableRef.value.$el);
    
    tableRef.value.$el.parentNode.addEventListener('mouseover', function(event: any) {
        const target = event.target;
        const cell = target.closest('td');
        if (cell == undefined) {
            return;
        }
        const rowIndex = cell.parentNode.rowIndex;
        // console.log('123213', cell.cellIndex, rowIndex)
        data.td = cell;
        data.row = rowIndex;
        data.col = cell.cellIndex;
        data.tableMouseEnterIs = true;
    });
    
    tableRef.value.$el.parentNode.addEventListener('mouseleave', function(_event: MouseEvent) {
        // console.log('离开')
        data.tableMouseEnterIs = false;
        
        if (!data.controlPointMouseDownIs) {
            data.row = -1;
            data.col = -1;
        }
    });
    
    computeColumnHeight()
});

onUnmounted(() => {
    resizeObserver.disconnect();
});

function controlPointMouseDown(ev: MouseEvent, col: number) {
    
    data.row = 0;
    data.col = col;
    data.controlPointMouseDownIs = true;
    
    const columnRect = (data.td! as HTMLElement).getBoundingClientRect();
    const tableRect = (tableRef.value.$el as HTMLElement).getBoundingClientRect();
    const columnLeft = columnRect.left;
    const columnTop = columnRect.top;
    const columnWidth = columnRect.width;
    
    const tableLeft = tableRect.left;
    const tableWidth = tableRect.width;
    
    let column: MyElement = props.element.headList[data.col];
    let clientStartX = ev.clientX;
    let clientStartY = ev.clientY;
    
    tableColClone.show(columnLeft, columnTop, column.runtimeOption.width, column.runtimeOption.parent?.runtimeOption.height,
        tableRef.value.$el.rows, data.col);
    
    let targetIndex: number | undefined = undefined;
    
    function controlPointMouseMove(ev: MouseEvent) {
        let clientMoveX = ev.clientX;
        const columnCloneLeft = columnLeft + clientMoveX - clientStartX;
        const offsetX = columnCloneLeft + columnWidth / 2 - tableLeft;
        let findIs = false;
        
        if (columnCloneLeft >= tableLeft - columnWidth && columnCloneLeft + columnWidth <= tableLeft + tableWidth + columnWidth) {
            tableColClone.move(columnCloneLeft);
            
            for (let i = 0; i < props.element.headList.length; i++) {
                let columnTmp = props.element.headList[i];
                if (columnTmp === column) {
                    continue;
                }
                
                if (offsetX >= (i == 0 ? columnTmp.runtimeOption.x - column.width : columnTmp.runtimeOption.x)
                    && offsetX <= columnTmp.runtimeOption.x + (i == props.element.headList.length - 1 ? columnTmp.runtimeOption.width + column.runtimeOption.width : columnTmp.runtimeOption.width)) {
                    if (offsetX <= columnTmp.runtimeOption.x + columnTmp.runtimeOption.width / 2) {
                        if (i == data.col + 1) {
                            continue;
                        }
                        data.highlightSort.x = columnTmp.runtimeOption.x;
                        targetIndex = i;
                        findIs = true;
                    } else {
                        if (i == data.col - 1) {
                            continue;
                        }
                        data.highlightSort.x = columnTmp.runtimeOption.x + columnTmp.runtimeOption.width;
                        targetIndex = i + 1;
                        findIs = true;
                    }
                    break;
                }
            }
        }
        
        if (findIs) {
            data.highlightSort.visibility = 'visible';
        } else {
            targetIndex = undefined;
            data.highlightSort.visibility = 'hidden';
        }
    }
    
    function controlPointMouseUp(evUp: MouseEvent) {
        
        let clientEndX = evUp.clientX;
        let clientEndY = evUp.clientY;
        let bodyElement: MyElement = bodyList[data.col];
        
        if (clientStartX == clientEndX && clientEndY == clientStartY) {
            
            data.highlightColumn.rowList = {};
            data.highlightColumn.width = column.runtimeOption.width;
            data.highlightColumn.x = column.runtimeOption.x;
            data.highlightColumn.rowList[0] = { [data.col]: null };
            data.highlightColumn.rowList[1] = { [data.col]: null };
            data.highlightColumn.y = 0;
            data.highlightColumn.height = column.runtimeOption.height + bodyElement.runtimeOption.height;
            setCurrentElement([column, bodyElement]);
            
            data.highlightColumn.visibility = 'visible';
        } else {
            if (targetIndex != undefined) {
                // console.log(targetIndex)
                if (targetIndex > data.col) {
                    targetIndex--;
                }
                sortColumn(props.element, data.col, targetIndex);
                // if (data.highlightColumn.rowList[data.row] == data.col) {
                //     data.highlightColumn.col = targetIndex;
                // }
                data.highlightColumn.visibility = 'hidden';
                data.highlightColumn.rowList = {};
            }
        }
        
        document.removeEventListener('mousemove', controlPointMouseMove);
        document.removeEventListener('mouseup', controlPointMouseUp);
        // console.log('up')
        tableColClone.hidden();
        useApp.dataRotation = 'none';
        
        data.controlPointMouseDownIs = false;
        
        if (!data.tableMouseEnterIs) {
            data.row = -1;
            data.col = -1;
        }
        data.highlightSort.visibility = 'hidden';
    }
    
    useApp.dataRotation = 'move';
    ev.stopPropagation();
    document.addEventListener('mousemove', controlPointMouseMove);
    document.addEventListener('mouseup', controlPointMouseUp);
}

function resizeMouseDown(ev: MouseEvent, col: number) {
    // console.log(col)
    const clientStartX = ev.clientX;
    const columnElement = props.element.headList[col];
    const bodyElement = bodyList[col];
    const columnOldWidth = props.element.headList[col].runtimeOption.width;
    const tableOldWidth = props.element.runtimeOption.width;
    useApp.dataRotation = 'col-resize';
    data.status = 'RESIZE';
    
    function resizeMouseMove(ev: MouseEvent) {
        const offsetX = ev.clientX - clientStartX;
        // console.log(offsetX, col)
        const newWidth = columnOldWidth + offsetX;
        if (newWidth > 20) {
            columnElement.runtimeOption.width = columnOldWidth + offsetX;
            bodyElement.runtimeOption.width = columnOldWidth + offsetX;
            props.element.runtimeOption.width = tableOldWidth + offsetX;
            props.element.runtimeOption.init.width = tableOldWidth + offsetX;
            updateMoveableRect();
        }
    }
    
    function resizeMouseUp() {
        useApp.dataRotation = 'none';
        data.status = 'NONE';
        document.removeEventListener('mousemove', resizeMouseMove);
        document.removeEventListener('mouseup', resizeMouseUp);
    }
    
    ev.stopPropagation();
    document.addEventListener('mousemove', resizeMouseMove);
    document.addEventListener('mouseup', resizeMouseUp);
}

function tableMouseDown(ev: MouseEvent) {
    let column: MyElement = props.element.headList[data.col];
    let bodyElement: MyElement = bodyList[data.col];
    let clientStartX = ev.clientX, clientStartY = ev.clientY;
    
    data.highlightColumn.width = column.runtimeOption.width;
    data.highlightColumn.x = column.runtimeOption.x;
    // data.highlightColumn.row = data.row;
    data.highlightColumn.rowList = {};
    data.highlightColumn.rowList[data.row] = { [data.col]: null };
    // data.highlightColumn.col = data.col;
    if (data.row == 0) {
        data.highlightColumn.y = 0;
        data.highlightColumn.height = column.runtimeOption.height;
        setCurrentElement([column]);
    } else {
        data.highlightColumn.y = column.runtimeOption.height;
        data.highlightColumn.height = bodyElement.runtimeOption.height;
        setCurrentElement([bodyElement]);
    }
    
    function tableMouseUp(ev: MouseEvent) {
        let clientEndX = ev.clientX, clientEndY = ev.clientY;
        
        if (clientEndX == clientStartX && clientEndY == clientStartY) {
            // click
            data.highlightColumn.visibility = 'visible';
        }
        
        document.removeEventListener('mouseup', tableMouseUp);
    }
    
    document.addEventListener('mouseup', tableMouseUp);
}

watch(() => props.element.option.tableHeightType, (n, _o) => {
    if (n == 'AUTO') {
        resizeObserver.observe(tableRef.value.$el);
    } else {
        resizeObserver.unobserve(tableRef.value.$el);
    }
    freshMoveableOption(props.element);
});

watch(() => props.element.runtimeOption.status, (n, _o) => {
    if (elementHandleStatusList.includes(n)) {
        // console.log('han')
        tableRef.value.$el.addEventListener('mousedown', tableMouseDown);
        // tableRef.value.$el.nextElementSibling.addEventListener('mousedown', tableMouseDown);
    } else {
        tableRef.value.$el.removeEventListener('mousedown', tableMouseDown);
        data.highlightColumn.visibility = 'hidden';
        data.highlightColumn.rowList = {};
        setCurrentElement(defaultElement);
    }
});

watch(props.element.headList, (_n, _o) => {
    computeColumn();
});

const computeColumn = _.throttle(() => {
    // console.log('---')
    data.controlPointList.length = 0;
    data.resizeControlList.length = 0;
    let width = 0;
    
    for (let i = 0; i < props.element.headList!.length; i++) {
        const column = props.element.headList[i];
        column.runtimeOption.x = width;
        width = width + column.runtimeOption.width;
        data.controlPointList.push({
            x: column.runtimeOption.x + column.runtimeOption.width / 2 - 10,
            y: 0
        });
        
        data.resizeControlList.push({
            x: column.runtimeOption.x + column.runtimeOption.width - 5,
            y: 0
        });
    }
    
    const keys = Object.keys(data.highlightColumn.rowList);
    console.log(keys);
    if (keys.length > 0) {
        const colKeys = Object.keys(data.highlightColumn.rowList[keys[0]]);
        let width = 0;
        let minIndex = 99999;
        // console.log(data.highlightColumn.rowList);
        for (let colKey of colKeys) {
            console.log(colKey);
            const columnElement = props.element.headList[colKey];
            // const bodyElement = bodyList[colKey];
            if (minIndex > Number.parseInt(colKey)) {
                minIndex = Number.parseInt(colKey);
            }
            width = width + columnElement.runtimeOption.width;
        }
        
        data.highlightColumn.width = width;
        data.highlightColumn.x = props.element.headList[minIndex].runtimeOption.x;
        
        // if (data.highlightColumn.y != 0) {
        //     data.highlightColumn.y = columnElement.runtimeOption.height;
        //     data.highlightColumn.height = bodyElement.runtimeOption.height;
        // } else {
        //     data.highlightColumn.height = columnElement.runtimeOption.height;
        // }
    }
}, 10);

const computeColumnHeight = _.throttle(() => {
    // console.log('---')
    data.rowControlPointList.length = 0;
    data.rowResizeControlList.length = 0;
    let height = 0;
    
    for (let i = 0; i < props.element.bodyList.length; i++) {
        const rowList = props.element.bodyList[i];
        const firstColumn = rowList[0]
        firstColumn.y = height;
        height = height + firstColumn.runtimeOption.height;
        
        data.rowControlPointList.push({
            x: 0,
            y: firstColumn.y + firstColumn.runtimeOption.height / 2 - 10
        });
    }
    
    // console.log(props.element.bodyList);
    // console.log(data.rowControlPointList);
    // data.rowResizeControlList.push({
    //     x: 0,
    //     y: column.runtimeOption.y + column.runtimeOption.height - 5
    // });
    
    // const keys = Object.keys(data.highlightColumn.rowList);
    // console.log(keys);
    // if (keys.length > 0) {
    //     const colKeys = Object.keys(data.highlightColumn.rowList[keys[0]]);
    //     let width = 0;
    //     let minIndex = 99999;
    //     console.log(data.highlightColumn.rowList);
    //     for (let colKey of colKeys) {
    //         console.log(colKey);
    //         const columnElement = props.element.headList[colKey];
    //         // const bodyElement = bodyList[colKey];
    //         if (minIndex > Number.parseInt(colKey)) {
    //             minIndex = Number.parseInt(colKey);
    //         }
    //         width = width + columnElement.runtimeOption.width;
    //     }
    //
    //     data.highlightColumn.width = width;
    //     data.highlightColumn.x = props.element.headList[minIndex].runtimeOption.x;
    //
    //     // if (data.highlightColumn.y != 0) {
    //     //     data.highlightColumn.y = columnElement.runtimeOption.height;
    //     //     data.highlightColumn.height = bodyElement.runtimeOption.height;
    //     // } else {
    //     //     data.highlightColumn.height = columnElement.runtimeOption.height;
    //     // }
    // }
}, 10);

</script>
