<template>
    
    <DataTable :element="element" ref="tableRef" />
    
    <template v-if="'HANDLE_ED' == element.runtimeOption.status && !element.lock">
        
        <div class="my-table-resize" v-for="(item, index) in data.resizeControlList"
             :style="{left: item.x + 'px'}" @mousedown="resizeMouseDown($event, index)" />
        
        <!--        <div class="my-table-row-resize" v-for="(item, index) in data.rowResizeControlList"-->
        <!--             :style="{left: item.x + 'px'}" @mousedown="resizeMouseDown($event, index)" />-->
        <!--        -->
        <!--        <div class="my-table-tool"/>-->
        
        <div class="my-table-highlight-sort"
             :style="{left: data.highlightSort.x + 'px', top: data.highlightSort.y + 'px', height: data.highlightSort.height + 'px'}"
             v-show="data.highlightSort.visibility == 'visible'" />
        
        <div class="my-table-highlight-column pointer-events"
             v-show="data.highlightColumn.visibility == 'visible'"
             :style="{
        left: (data.highlightColumn.x-1)+'px',
        top: (data.highlightColumn.y)+'px',
        width: (data.highlightColumn.width+2)+'px',
        height: (data.highlightColumn.height + 3)+'px'
           }" />
        
        <template v-for="(rowList, row) in data.controlPointList">
            <div class="my-table-control-head-point iconfont icon-sigedian" v-for="(item, col) in rowList"
                 :style="{left: item.x + 'px', top: (item.y - 10) + 'px'}"
                 :class="{'my-table-control-head-point-active': (data.row == row && data.col == col) && data.status != 'RESIZE'}"
                 @mousedown="controlPointMouseDown($event, row, col)">
            </div>
        </template>
        
        <!--        <div class="my-table-control-head-col-point iconfont icon-sigedian"-->
        <!--             v-for="(item, index) in data.rowControlPointList"-->
        <!--             :class="{'my-table-control-head-point-active': data.row == index && data.status != 'RESIZE'}"-->
        <!--             :style="{top: item.y + 'px'}"-->
        <!--             @mousedown="rowControlPointMouseDown($event, index)">-->
        <!--            <div style="color: black">{{ data.row }}</div>-->
        <!--        </div>-->
        
        <div class="my-table-statistics-row-remove user-select-none"
             v-for="(item, index) in data.rowRemovePointList"
             @click="removeStatisticsRow(item)"
             :key="index"
             style="background: white !important"
             :style="{top: (item.y-1)+'px'}" />
        
        <my-popover
            trigger="click"
            ref="popoverRef"
            class="table-more-icon_popover"
            @show="showTableEnableSetting"
            placement="top">
            <template #reference>
                <div class="table-more-icon"
                     ref="containerMoveIconRef">
                    <i class="icon-setting iconfont " />
                </div>
            </template>
            <my-scrollbar height="200px">
                <div class="table_header_setting">
                    <my-tree-list @change="changeColumnEnable" nullActive :list="tableHeadNest" />
                </div>
            </my-scrollbar>
        </my-popover>
    </template>

</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue-demi';
import { Container, MyElement, TableCellElement } from '@myprint/design/types/entity';
import DataTable from './data-table.vue';
import { elementHandleStatusList } from '@myprint/design/constants/common';
import { useAppStoreHook } from '@myprint/design/stores/app';
import { sortColumn } from '@myprint/design/utils/utils';
import { freshMoveableOption, updateMoveableRect } from '@myprint/design/plugins/moveable/moveable';
import { throttle } from 'lodash';
import {
    getRecursionParentPanel,
    recursionUpdateCellParentInitWidth,
    recursionUpdateCellParentWidth,
    setCurrentElement,
    setElementHeightPx,
    setElementOffsetWidthPx,
    setElementWidthPx
} from '@myprint/design/utils/elementUtil';
import {
    computeColumnColspan,
    computedDisableColumn,
    computedTableCell,
    getChildByParent,
    getTableCell,
    getTableCellDown,
    initTableCell,
    lastHeadList,
    selectCell,
    tableHeadList2Nest
} from '@myprint/design/utils/table/dataTable';
import { tableColClone } from '@myprint/design/utils/myprint';
import MyPopover from '@myprint/design/components/my/popover/my-popover.vue';
import MyScrollbar from '@myprint/design/components/my/scrollbar/my-scrollbar.vue';
import MyTreeList from '@myprint/design/components/my/tree-list/my-tree-list.vue';
import numberUtil from '@myprint/design/utils/numberUtil';

type MyRow = Record<number, number[]>

const props = withDefaults(defineProps<{
    element: MyElement
}>(), {
    element: () => ({} as MyElement)
});
const data = reactive({
    status: 'NONE',
    td: undefined,
    row: -1,
    logicRow: -1,
    col: -1,
    handleIng: false,
    controlPointMouseDownIs: false,
    tableMouseEnterIs: false,
    highlightSort: {
        x: 0,
        y: 0,
        height: 0,
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
    tableRowHeightList: [] as number[],
    lastHeadList: [] as TableCellElement[],
    cellList: [] as TableCellElement[],
    headHeight: 0,
    controlPointList: [] as any[][],
    resizeControlList: [] as any[],
    rowControlPointList: [] as any[],
    rowRemovePointList: [] as any[],
    rowResizeControlList: [] as any[]
});
const tableRef = ref();
const useApp = useAppStoreHook();
let resizeObserver: ResizeObserver;

// 处理表格行
const bodyList = computed(() => {
    const bodyList = [...props.element.tableHeadList, ...props.element.tableBodyList, ...props.element.statisticsList];
    // console.log('computed-bodyList');
    nextTick(() => {
        data.tableRowHeightList = computedTableCell(props.element, tableRef.value.$el, bodyList);
        data.lastHeadList = lastHeadList(props.element.tableHeadList);
        
        initTableCell(bodyList);
        initTableNest();
        
        computeColumn();
        computeColumnHeight();
    });
    return bodyList;
});
const tableHeadNest = ref<TableCellElement[]>([]);

function initTableNest() {
    // 不处理enable
    tableHeadNest.value = tableHeadList2Nest(props.element.tableHeadList, 0, 0, props.element.tableHeadList[0].length);
}

onMounted(() => {
    // console.log(props.element);
    // console.log(props.element.tableHeadList);
    // 创建 ResizeObserver 实例
    resizeObserver = new ResizeObserver((entries) => {
        // entries 是 ResizeObserverEntry 对象的数组
        for (const entry of entries) {
            // console.log(entry);
            if (entry.contentRect.height == 0 && entry.contentRect.width == 0 && entry.contentRect.x == 0) {
                continue;
            }
            // entry.contentRect 包含元素的新尺寸
            // console.log('元素尺寸改变:', entry.contentRect.width, entry.contentRect.height);
            setElementHeightPx(entry.contentRect.height + 1, props.element);
            setElementWidthPx(entry.contentRect.width + 1, props.element);
            nextTick(() => {
                data.tableRowHeightList = computedTableCell(props.element, tableRef.value.$el, bodyList.value);
                if (data.cellList && data.cellList.length > 0) {
                    selectCell(data.highlightColumn, data.cellList);
                }
                updateMoveableRect();
                computeColumn();
                computeColumnHeight();
            });
        }
    });
    resizeObserver.observe(tableRef.value.$el);
    
    tableRef.value.$el.parentNode.addEventListener('mouseover', function(event: MouseEvent) {
        if (data.handleIng) {
            return;
        }
        const target = event.target!;
        // @ts-ignore
        const cell = target.closest('td');
        if (cell == undefined) {
            return;
        }
        data.td = cell;
        data.row = cell.parentNode.rowIndex;
        // console.log(event.offsetY);
        // data.logicRow = cell.parentNode.rowIndex;
        data.col = cell.cellIndex;
        
        // console.log(rowIndex, cell.cellIndex);
        data.tableMouseEnterIs = true;
    });
    
    tableRef.value.$el.parentNode.addEventListener('mouseleave', function(_event: MouseEvent) {
        // console.log('离开')
        if (data.handleIng) {
            return;
        }
        data.tableMouseEnterIs = false;
        
        if (data.controlPointMouseDownIs) {
            return;
        }
        data.row = -1;
        data.col = -1;
    });
    bodyList.value;
});

onUnmounted(() => {
    resizeObserver.disconnect();
});

function showTableEnableSetting() {
    initTableNest();
}

/**
 * 排序控制点事件
 */
function controlPointMouseDown(ev: MouseEvent, row: number, col: number) {
    
    data.row = row;
    data.col = col;
    data.controlPointMouseDownIs = true;
    data.handleIng = true;
    
    const columnRect = (data.td! as HTMLElement).getBoundingClientRect();
    const tableRect = (tableRef.value.$el as HTMLElement).getBoundingClientRect();
    const columnLeft = columnRect.left;
    const columnTop = columnRect.top;
    const columnWidth = columnRect.width;
    
    const tableLeft = tableRect.left;
    const tableWidth = tableRect.width;
    const { rowCellList, colIndex } = getTableCellDown(bodyList.value, data.row, data.col);
    const childByParentList = getChildByParent(bodyList.value, data.row, colIndex);
    
    let columnCell: MyElement = rowCellList[0][0];
    let clientStartX = ev.clientX;
    let clientStartY = ev.clientY;
    
    data.highlightSort.y = columnCell.runtimeOption.y;
    data.highlightSort.height = props.element.runtimeOption.height - columnCell.runtimeOption.y;
    
    tableColClone.show(columnLeft, columnTop, columnCell.runtimeOption.width, rowCellList);
    
    // 设置可移动范围
    let targetIndex: number | undefined = undefined;
    
    function controlPointMouseMove(ev: MouseEvent) {
        let clientMoveX = ev.clientX;
        // console.log(clientMoveX);
        const columnCloneLeft = columnLeft + clientMoveX - clientStartX;
        const offsetX = columnCloneLeft + columnWidth / 2 - tableLeft;
        let findIs = false;
        // console.log(data.col);
        if (columnCloneLeft >= tableLeft - columnWidth && columnCloneLeft + columnWidth <= tableLeft + tableWidth + columnWidth) {
            tableColClone.move(columnCloneLeft);
            
            for (let i = 0; i < childByParentList.length; i++) {
                let columnCellTmp = childByParentList[i];
                if (columnCellTmp === columnCell) {
                    continue;
                }
                
                // 判断排序高亮的绿色竖线是否显示
                if (offsetX >= (i == 0 ? columnCellTmp.runtimeOption.x - columnCell.width : columnCellTmp.runtimeOption.x)
                    && offsetX <= columnCellTmp.runtimeOption.x + (i == childByParentList.length - 1 ? columnCellTmp.runtimeOption.width + columnCell.runtimeOption.width : columnCellTmp.runtimeOption.width)) {
                    if (offsetX <= columnCellTmp.runtimeOption.x + columnCellTmp.runtimeOption.width / 2) {
                        if (i == col + 1) {
                            continue;
                        }
                        data.highlightSort.x = columnCellTmp.runtimeOption.x;
                        targetIndex = i;
                        findIs = true;
                    } else {
                        if (i == col - 1) {
                            continue;
                        }
                        data.highlightSort.x = columnCellTmp.runtimeOption.x + columnCellTmp.runtimeOption.width;
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
        data.handleIng = false;
        
        if (clientStartX == clientEndX && clientEndY == clientStartY) {
            // 选取整列
            const { cellList } = getTableCellDown(bodyList.value, data.row, data.col);
            data.cellList = cellList;
            selectCell(data.highlightColumn, data.cellList);
        } else {
            if (targetIndex != undefined) {
                // console.log(col, targetIndex);
                if (targetIndex > col) {
                    targetIndex--;
                }
                // console.log(col, targetIndex);
                sortColumn(props.element, colIndex, row, col, targetIndex);
                // if (data.highlightColumn.rowList[data.row] == data.col) {
                //     data.highlightColumn.col = targetIndex;
                // }
                
                nextTick(() => {
                    computedTableCell(props.element, props.element.runtimeOption.target, bodyList.value);
                    computeColumn();
                });
                // const rect = computedCellRect(data.cellList);
                // data.highlightColumn.x = rect.x;
                // data.highlightColumn.y = rect.y;
                // data.highlightColumn.width = rect.width;
                // data.highlightColumn.height = rect.height;
                
                data.highlightColumn.visibility = 'hidden';
                // data.highlightColumn.rowList = {};
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

// function rowControlPointMouseDown(ev: MouseEvent, row: number) {
//
//     data.row = row;
//     data.col = 0;
//     data.controlPointMouseDownIs = true;
//
//     let clientStartX = ev.clientX;
//     let clientStartY = ev.clientY;
//
//     function controlPointMouseUp(evUp: MouseEvent) {
//
//         let clientEndX = evUp.clientX;
//         let clientEndY = evUp.clientY;
//         // console.log(bodyList.value[data.row]);
//         let bodyElement: MyElement = bodyList.value[data.row][0];
//         // console.log(bodyElement);
//         if (clientStartX == clientEndX && clientEndY == clientStartY) {
//             data.highlightColumn.rowList = {};
//             data.highlightColumn.width = props.element.runtimeOption.width;
//             data.highlightColumn.x = 0;
//             data.highlightColumn.rowList[data.row] = Array.from(bodyList.value[data.row], (_, i) => i + 1);
//             data.highlightColumn.y = bodyElement.runtimeOption.y;
//             data.highlightColumn.height = bodyElement.runtimeOption.height;
//             setCurrentElement(bodyList.value[data.row]);
//
//             data.highlightColumn.visibility = 'visible';
//         } else {
//
//         }
//
//         document.removeEventListener('mouseup', controlPointMouseUp);
//         // console.log('up')
//         useApp.dataRotation = 'none';
//
//         data.controlPointMouseDownIs = false;
//
//         if (!data.tableMouseEnterIs) {
//             data.row = -1;
//             data.col = -1;
//         }
//     }
//
//     useApp.dataRotation = 'move';
//     ev.stopPropagation();
//     document.addEventListener('mouseup', controlPointMouseUp);
// }

/**
 * 更改列尺寸
 */
function resizeMouseDown(ev: MouseEvent, col: number) {
    const clientStartX = ev.clientX;
    const columnElement = data.lastHeadList[col];
    const columnOldWidth = data.lastHeadList[col].runtimeOption.width;
    const tableOldWidth = props.element.runtimeOption.width;
    useApp.dataRotation = 'col-resize';
    data.status = 'RESIZE';
    data.handleIng = true;
    
    function resizeMouseMove(ev: MouseEvent) {
        const offsetX = ev.clientX - clientStartX;
        const newWidth = columnOldWidth + offsetX;
        // console.log(offsetX);
        if (newWidth > 20) {
            setElementWidthPx(tableOldWidth + offsetX, props.element);
            recursionUpdateCellParentWidth(columnElement, offsetX, getRecursionParentPanel(props.element));
            // 更新body 的宽
            setElementOffsetWidthPx(offsetX, props.element.tableBodyList[0][col]);
            // 更新
            updateMoveableRect();
            // 更新resize位置
            computeColumn();
        }
        // 计算辅助位置
        if (data.highlightColumn.visibility == 'visible') {
            nextTick(() => {
                computedTableCell(props.element, props.element.runtimeOption.target, bodyList.value);
                selectCell(data.highlightColumn, data.cellList);
            });
            
            // const rect = computedCellRect(props.element.runtimeOption.target, data.cellList);
            // data.highlightColumn.x = rect.x;
            // data.highlightColumn.y = rect.y;
            // data.highlightColumn.width = rect.width;
            // data.highlightColumn.height = rect.height;
        }
    }
    
    function resizeMouseUp() {
        useApp.dataRotation = 'none';
        data.status = 'NONE';
        data.handleIng = false;
        initTableCell(bodyList.value);
        recursionUpdateCellParentInitWidth(columnElement);
        document.removeEventListener('mousemove', resizeMouseMove);
        document.removeEventListener('mouseup', resizeMouseUp);
    }
    
    ev.stopPropagation();
    document.addEventListener('mousemove', resizeMouseMove);
    document.addEventListener('mouseup', resizeMouseUp);
}

function tableMouseDown(ev: MouseEvent) {
    // console.log(data);
    // console.log(data.row, data.col);
    // console.log(data.tableRowHeightList);
    data.cellList = getTableCell(bodyList.value, data.row, data.col);
    // 选取范围
    // console.log(cellList);
    // const rect = computedCellRect(props.element.runtimeOption.target, data.cellList);
    // console.log(rect);
    
    let clientStartX = ev.clientX, clientStartY = ev.clientY;
    
    function tableMouseUp(ev: MouseEvent) {
        let clientEndX = ev.clientX, clientEndY = ev.clientY;
        
        if (clientEndX == clientStartX && clientEndY == clientStartY) {
            // click
            selectCell(data.highlightColumn, data.cellList);
            // data.highlightColumn.x = rect.x;
            // data.highlightColumn.y = rect.y;
            // data.highlightColumn.width = rect.width;
            // data.highlightColumn.height = rect.height;
            // data.highlightColumn.rowList = {};
            // data.highlightColumn.rowList[data.row] = [data.col];
            // data.highlightColumn.visibility = 'visible';
            // setCurrentElement(data.cellList);
        }
        
        document.removeEventListener('mouseup', tableMouseUp);
    }
    
    document.addEventListener('mouseup', tableMouseUp);
}

function removeStatisticsRow(item: any) {
    // console.log('删除');
    data.cellList = [];
    data.highlightColumn.visibility = 'hidden';
    setCurrentElement([props.element]);
    // console.log(bodyList.value.length);
    props.element.statisticsList.splice(item.row, 1);
    // console.log(bodyList.value.length);
    bodyList.value;
}

function changeColumnEnable() {
    props.element.disableCellMap = computedDisableColumn(props.element.tableHeadList);
    
    computeColumnColspan(tableHeadNest.value, 0);
    let widthTotal = 0;
    for (let lastHeadListElement of data.lastHeadList) {
        widthTotal = numberUtil.sum(widthTotal, lastHeadListElement.runtimeOption.width);
    }
    setElementWidthPx(numberUtil.sum(widthTotal, 1), props.element);
    
    nextTick(() => {
        computedTableCell(props.element, props.element.runtimeOption.target, bodyList.value);
        computeColumn();
    });
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
        // data.highlightColumn.rowList = {};
        // setCurrentElement(defaultElement);
    }
});

const computeColumn = throttle(() => {
    data.controlPointList.length = 0;
    data.resizeControlList.length = 0;
    
    for (let tableHeadListElement of props.element.tableHeadList) {
        const pointListTmp: any[] = [];
        for (let tableCellElement of tableHeadListElement) {
            if (tableCellElement == null) {
                continue;
            }
            
            pointListTmp.push({
                x: tableCellElement.runtimeOption.x + tableCellElement.runtimeOption.width / 2 - 10,
                y: tableCellElement.runtimeOption.y
            });
        }
        data.controlPointList.push(pointListTmp);
    }
    
    for (let i = 0; i < data.lastHeadList.length; i++) {
        let tableCellElement = data.lastHeadList[i];
        
        data.resizeControlList.push({
            x: tableCellElement.runtimeOption.x + tableCellElement.runtimeOption.width - 5,
            y: 0
        });
    }
}, 10);

const computeColumnHeight = throttle(() => {
    // console.log('---')
    data.rowControlPointList.length = 0;
    data.rowResizeControlList.length = 0;
    data.rowRemovePointList.length = 0;
    let height = 0;
    
    for (let i = 0; i < bodyList.value.length; i++) {
        const rowList = bodyList.value[i];
        // console.log(rowList);
        let firstColumn = rowList[0];
        for (let rowListElement of rowList) {
            if (rowListElement != null && rowListElement.rowspan == 1) {
                firstColumn = rowListElement;
                break;
            }
        }
        if (firstColumn == null) {
            continue;
        }
        // firstColumn.runtimeOption.y = height;
        height = height + firstColumn.runtimeOption.height;
        
        data.rowControlPointList.push({
            x: 0,
            y: firstColumn.runtimeOption.y + firstColumn.runtimeOption.height / 2 - 10
        });
    }
    
    for (let i = 0; i < props.element.statisticsList.length; i++) {
        let firstColumn = props.element.statisticsList[i][0];
        data.rowRemovePointList.push({
            row: i,
            y: firstColumn.runtimeOption.y + firstColumn.runtimeOption.height / 2 - 10
        });
    }
    
    // console.log(data.rowRemovePointList);
    
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
