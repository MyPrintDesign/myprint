// 找到层的深度
import {
    MyElement,
    Rect,
    RuntimeElementOption,
    TableCellElement,
    TableHeadProviderCellElement,
    TableStatisticsCellElement
} from '@myprint/design/types/entity';
import numberUtil from '@myprint/design/utils/numberUtil';
import { parse, stringify } from '@myprint/design/utils/utils';
import { reactive } from 'vue-demi';
import { installParentElement, setCurrentElement } from '@myprint/design/utils/elementUtil';


export function recursionForTableCell(tableHeadList: TableHeadProviderCellElement[], callback: (providerCell: TableHeadProviderCellElement) => void) {
    for (let tableHeadCellElement of tableHeadList) {
        callback(tableHeadCellElement);
        if (tableHeadCellElement.columnList != null && tableHeadCellElement.columnList.length > 0) {
            recursionForTableCell(tableHeadCellElement.columnList, callback);
        }
    }
}

// 表头深度
export function findTableHeadDeep(tableHeadList: TableHeadProviderCellElement[], deep: number) {
    for (let tableHeadCellElement of tableHeadList) {
        if (tableHeadCellElement.columnList != null && tableHeadCellElement.columnList.length > 0) {
            return findTableHeadDeep(tableHeadCellElement.columnList, deep + 1);
        }
    }
    return deep;
}

// 根据位置获取对应的cell，级下面所有行
export function getTableCellDown(tableHeadList: TableCellElement[][], row: number, col: number) {
    const rowCellList: TableCellElement[][] = [];
    const cellList: TableCellElement[] = [];
    let rowStart = 0;
    let colIndex = -1;
    let baseCell: TableCellElement = undefined!;

    for (let i = 0; i < tableHeadList[row].length; i++) {
        let tableHeadCellElement = tableHeadList[row][i];

        if (tableHeadCellElement && col == rowStart) {
            // cellList.push(tableHeadCellElement);
            baseCell = tableHeadCellElement;
            colIndex = i;
            // 左上角的位置
            break;
        }

        if (tableHeadCellElement == null) {
            continue;
        }

        rowStart++;
        if (tableHeadCellElement.colspan > 1) {
            i = i + tableHeadCellElement.colspan - 1;
        }

    }

    if (colIndex >= 0) {
        for (let i = row; i < tableHeadList.length; i++) {
            const rowList = tableHeadList[i];
            const cellListTmp: TableCellElement[] = [];
            for (let j = 0; j < baseCell.colspan; j++) {
                if (rowList[colIndex + j]) {
                    cellListTmp.push(rowList[colIndex + j]);
                    cellList.push(rowList[colIndex + j]);
                }
            }
            rowCellList.push(cellListTmp);

        }

    }

    // console.log(rowCellList);
    return { cellList, rowCellList, colIndex };
}

// 根据位置获取对应的cell
export function getTableCell(tableHeadList: TableCellElement[][], row: number, col: number) {

    const cellList: TableCellElement[] = [];
    if (row >= 0 && col >= 0) {
        let rowStart = 0;
        for (let i = 0; i < tableHeadList[row].length; i++) {
            let tableHeadCellElement = tableHeadList[row][i];

            if (tableHeadCellElement && col == rowStart) {
                cellList.push(tableHeadCellElement);
                break;
            }

            if (tableHeadCellElement == null) {
                continue;
            }

            rowStart++;
            if (tableHeadCellElement.colspan > 1) {
                i = i + tableHeadCellElement.colspan - 1;
            }

        }

    } else if (col < 0) {
        // 整行
        for (let i = 0; i < tableHeadList[row].length; i++) {
            let tableHeadCellElement = tableHeadList[row][i];
            if (tableHeadCellElement == null) {
                continue;
            }

            cellList.push(tableHeadCellElement);

            if (tableHeadCellElement.colspan > 1) {
                i = i + tableHeadCellElement.colspan - 1;
            }
        }
    } else if (row < 0) {
        // 整列
        for (let i = 0; i < tableHeadList.length; i++) {
            let tableHeadCellElement = tableHeadList[i][col];
            if (tableHeadCellElement == null) {
                continue;
            }

            cellList.push(tableHeadCellElement);

            if (tableHeadCellElement.rowspan > 1) {
                i = i + tableHeadCellElement.rowspan - 1;
            }
        }
    }

    // console.log(cellList);
    return cellList;
}

// 获取同一个父级下的兄弟元素
export function getChildByParent(tableHeadList: TableCellElement[][], row: number, col: number) {
    const rowList = tableHeadList[row];
    const baseCell = rowList[col];
    const childByParentList: TableCellElement[] = [];

    for (let i = 0; i < rowList.length; i++) {
        const cell = rowList[i];
        if (cell == null) {
            continue;
        }
        if (baseCell.runtimeOption.cellParent == null) {
            childByParentList.push(cell);
        } else {
            if (cell.runtimeOption.cellParent == null) {
                console.log(cell);
            }
            if (cell.runtimeOption.cellParent!.id == baseCell.runtimeOption.cellParent.id) {
                childByParentList.push(cell);
            }
        }
    }
    return childByParentList;
}

export function selectCell(highlightColumn: any, cellList: TableCellElement[]) {
    const rect = computedCellRect(cellList);
    highlightColumn.x = rect.x;
    highlightColumn.y = rect.y;
    highlightColumn.width = rect.width;
    highlightColumn.height = rect.height;
    // data.highlightColumn.rowList = {};
    // data.highlightColumn.rowList[data.row] = [data.col];
    highlightColumn.visibility = 'visible';
    setCurrentElement(cellList);
}

export function computedCellRect(cellList: TableCellElement[]) {
    const rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    } as Rect;

    if (cellList.length == 0) {
        return rect;
    }
    rect.x = cellList[0].runtimeOption.x;
    rect.y = cellList[0].runtimeOption.y;

    for (let i = 0; i < cellList.length; i++) {
        const cell = cellList[i];

        if (rect.x > cell.runtimeOption.x) {
            rect.x = cell.runtimeOption.x;
        }

        if (rect.y > cell.runtimeOption.y) {
            rect.y = cell.runtimeOption.y;
        }
        const width = cell.runtimeOption.x - rect.x + cell.runtimeOption.width;
        const height = cell.runtimeOption.y - rect.y + cell.runtimeOption.height;

        if (rect.width < width) {
            rect.width = width;
        }

        if (rect.height < height) {
            rect.height = height;
        }
    }
    rect.y = rect.y - 1;
    rect.height = rect.height - 1;

    return rect;
}

export function findUpperCell(floorHeaderList: TableCellElement[][], col: number, deep: number) {
    for (let i = deep; i >= 0; i--) {
        const cell = floorHeaderList[i][col];
        if (cell != null) {
            return floorHeaderList[i][col];
        }
    }
}

export function findFromLeftCell(floorHeaderList: TableCellElement[][], row: number, col: number, deep: number) {
    // debugger
    const rowList = floorHeaderList[row];
    // debugger
    if (deep > 0) {
        // 往后找
        for (let i = col + 1; i < rowList.length; i++) {
            const cell = rowList[i];
            if (cell != null) {
                if (--deep == 0) {
                    // debugger
                    return { cell: rowList[i], col: i };
                }
                if (cell.colspan > 1) {
                    i = i + cell.colspan - 1;
                }
            }
        }
    }
    if (deep < 0) {
        // 往前找
        for (let i = col - 1; i >= 0; i--) {
            const cell = rowList[i];
            if (cell != null) {
                if (++deep == 0) {
                    // debugger
                    return { cell: rowList[i], col: i };
                }
            }
        }
    }
}

export function lastHeadList(tableHeadListList: TableCellElement[][]) {
    const headList = tableHeadListList[tableHeadListList.length - 1];
    const lastHeadList: TableCellElement[] = [];

    for (let i = 0; i < headList.length; i++) {
        let head = headList[i];
        if (head == null) {
            head = findUpperCell(tableHeadListList, i, tableHeadListList.length - 1)!;
        }
        lastHeadList.push(head);
    }
    return lastHeadList;
}

export function computedTableCell(target: HTMLElement, tableHeadListList: TableCellElement[][]) {
    const tableRect = target.getBoundingClientRect() as DOMRect;

    const rowHeightList: number[] = [];
    for (let row = 0; row < tableHeadListList.length; row++) {
        let height = 0;
        const tableHeadListListElement = tableHeadListList[row];
        for (let col = 0; col < tableHeadListListElement.length; col++) {
            const tableCellElement = tableHeadListListElement[col];
            if (tableCellElement == null) {

                // const tableCellElementTmp = findUpperCell(tableHeadListList, col, row)!;
                // if (tableCellElementTmp == null) {
                //     continue;
                // }
                // x = x + tableCellElementTmp.runtimeOption.width;
                continue;
            }

            const target = tableCellElement.runtimeOption.target as HTMLElement;
            const tdRect = target.getBoundingClientRect();

            const tdY = tdRect.y - tableRect.y;
            const tdX = tdRect.x - tableRect.x;

            if (tableCellElement.colspan > 1) {
                if (row + 1 < tableHeadListList.length) {
                    const childList = tableHeadListList[row + 1];
                    for (let childCol = col; childCol < childList.length; childCol++) {
                        const child = childList[childCol];
                        if (child == null) {
                            continue;
                        }
                        if (child.runtimeOption == null) {
                            child.runtimeOption = {} as RuntimeElementOption;
                        }
                        // console.log(child);
                        child.runtimeOption.cellParent = tableCellElement;
                    }
                }
            }

            tableCellElement.runtimeOption.x = tdX;
            tableCellElement.runtimeOption.y = tdY;
            tableCellElement.runtimeOption.width = tdRect.width;
            tableCellElement.runtimeOption.height = tdRect.height;

            height = numberUtil.div(tableCellElement.runtimeOption.height, tableCellElement.rowspan);

        }

        rowHeightList.push(height);
    }

    return rowHeightList;
}

export function initTableCell(tableHeadListList: TableCellElement[][]) {

    for (let row = 0; row < tableHeadListList.length; row++) {
        const tableHeadListListElement = tableHeadListList[row];
        for (let col = 0; col < tableHeadListListElement.length; col++) {
            const tableCellElement = tableHeadListListElement[col];
            if (tableCellElement == null) {
                continue;
            }
            tableCellElement.runtimeOption.init.width = tableCellElement.runtimeOption.width;
            tableCellElement.runtimeOption.init.height = tableCellElement.runtimeOption.height;
        }
    }
}

export function handleTableCellInitHeight(tableHeadListList: TableCellElement[][]) {
    for (let tableHeadListListElement of tableHeadListList) {
        let height = 0;
        for (let tableCellElement of tableHeadListListElement) {
            if (tableCellElement == null) {
                continue;
            }
            if (height < tableCellElement.height) {
                height = tableCellElement.height;
            }
        }

        for (let tableCellElement of tableHeadListListElement) {
            if (tableCellElement == null) {
                continue;
            }
            tableCellElement.height = height * tableCellElement.rowspan;
        }
    }
}

// 表格处理 树形表头展开
export function recursionHandleTableHead(tableHeadListList: TableCellElement[][], tableHeadList: TableHeadProviderCellElement[], deep: number) {
    const tableHeadListTmp = tableHeadListList[deep];
    for (let j = 0; j < tableHeadList.length; j++) {
        const tableHeadCell = tableHeadList[j];
        const childList = tableHeadCell.columnList;
        tableHeadCell.columnList = undefined!;
        if (childList != null && childList.length > 0) {
            tableHeadCell.rowspan = 1;

            recursionHandleTableHead(tableHeadListList, childList, deep + 1);
            let colspan = 0;
            let width = 0;
            for (let tableHeadCellElement of childList) {
                colspan += tableHeadCellElement.colspan;
                width += tableHeadCellElement.width;
            }

            tableHeadCell.colspan = colspan;
            tableHeadCell.width = width;

        } else {
            tableHeadCell.colspan = 1;
            tableHeadCell.rowspan = tableHeadListList.length - deep;
        }

        tableHeadListTmp.push(tableHeadCell as any);
        for (let k = 1; k < tableHeadCell.colspan; k++) {
            tableHeadListTmp.push(undefined!);
        }
        if (tableHeadCell.rowspan > 1) {
            for (let k = 1 + deep; k < tableHeadCell.rowspan + deep; k++) {
                tableHeadListList[k].push(undefined!);
            }
        }

    }
}

export function addStatisticsRow(tableElement: MyElement) {
    const statisticsRowList: TableStatisticsCellElement[] = [];
    tableElement.tableBodyList[0].map((v) => {
        const element = parse(stringify(v, 'parent', 'target', 'elementList'), reactive({}) as TableStatisticsCellElement);
        element.id = undefined!;
        element.data = undefined!;
        element.option.formatter = undefined!;
        element.runtimeOption.cellType = 'Statistics';
        installParentElement(tableElement, element);
        statisticsRowList.push(element);
    });
    tableElement.statisticsList.push(statisticsRowList);
}

// preview
export function previewTableStatisticsList(tableStatisticsTmpList: TableStatisticsCellElement[][], tableStatisticsList: TableStatisticsCellElement[][],
                                           statisticsListWrapper: Record<number, any[]>,
                                           headList: TableCellElement[]) {

    for (let i = 0; i < tableStatisticsTmpList.length; i++) {
        const rowList = [...tableStatisticsTmpList[i]];
        let hasCell = previewRowStatisticsList(rowList, statisticsListWrapper, headList, 'everyPageStatisticsIs');
        if (hasCell) {
            tableStatisticsList.push(rowList);
        }
    }
}

export function previewRowStatisticsList(rowList: TableStatisticsCellElement[], statisticsList: Record<number, any[]>, headList: TableCellElement[], statisticsDisplayType: string) {
    let hasCell = false;
    for (let col = 0; col < rowList.length; col++) {
        const head = rowList[col];
        if (head == null || !head[statisticsDisplayType]) {
            continue;
        }
        const statisticsCell = parse(stringify(head, 'parent'), reactive({}) as TableStatisticsCellElement);
        // console.log(statisticsCell);
        statisticsCell.runtimeOption.parent = head.runtimeOption.parent;
        rowList[col] = statisticsCell;

        hasCell = true;
        let statisticsWrapper = statisticsList[col];
        if (statisticsWrapper == undefined) {
            statisticsWrapper = [];
            statisticsList[col] = statisticsWrapper;
        }
        const column = headList[col];
        const cellWrapper = {
            head: column,
            value: 0,
            count: 0,
            setCount: {},
            cell: statisticsCell
        };
        if (statisticsCell.statisticsType == 'Min') {
            cellWrapper.value = Number.MAX_VALUE;
        }
        if (statisticsCell.statisticsType == 'Max') {
            cellWrapper.value = Number.MIN_VALUE;
        }
        statisticsWrapper.push(cellWrapper);
    }

    return hasCell;
}

export function statisticsData(previewDataList: any[], statisticsListWrapper: Record<number, any[]>) {
    // console.log(previewDataList, statisticsListWrapper);
    // const rowList = previewDataList[0];
    const colList = Object.keys(statisticsListWrapper);

    if (colList.length == 0) {
        return;
    }

    for (let previewData of previewDataList) {
        for (let col of colList) {
            const statisticsWrapperList = statisticsListWrapper[col];
            for (let statisticsWrapper of statisticsWrapperList) {
                const cell = statisticsWrapper.cell as TableStatisticsCellElement;
                const head = statisticsWrapper.head as TableCellElement;
                const data = previewData[head.field];
                // console.log(col, cell, head, previewData[head.field]);

                if (numberUtil.isNumber(data)) {
                    if (cell.statisticsType == 'Sum' || cell.statisticsType == 'Avg') {
                        statisticsWrapper.value = statisticsWrapper.value + data;

                        if (cell.statisticsType == 'Avg') {
                            statisticsWrapper.count++;
                        }
                    } else if (cell.statisticsType == 'Max') {
                        if (statisticsWrapper.value < data) {
                            statisticsWrapper.value = data;
                        }
                    } else if (cell.statisticsType == 'Min') {
                        if (statisticsWrapper.value > data) {
                            statisticsWrapper.value = data;
                        }
                    }
                }
                if (cell.statisticsType == 'Count') {
                    statisticsWrapper.count++;
                }
                if (cell.statisticsType == 'DistinctCount') {
                    statisticsWrapper.setCount[data] = null;
                }
            }
        }
    }

    for (let col of colList) {
        for (let statisticsWrapper of statisticsListWrapper[col]) {
            const cell = statisticsWrapper.cell as TableStatisticsCellElement;
            if (cell.statisticsType == 'Sum' || cell.statisticsType == 'Max' || cell.statisticsType == 'Min') {
                cell.data = statisticsWrapper.value;
            } else if (cell.statisticsType == 'Avg') {
                cell.data = numberUtil.div(statisticsWrapper.value, statisticsWrapper.count);
            } else if (cell.statisticsType == 'Count') {
                cell.data = statisticsWrapper.count;
            } else if (cell.statisticsType == 'DistinctCount') {
                cell.data = Object.keys(statisticsWrapper.setCount).length;
            }
        }
    }
}
