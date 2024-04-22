// 找到层的深度
import {
    Rect,
    RuntimeElementOption,
    TableCellElement,
    TableHeadProviderCellElement
} from '@myprint/design/types/entity';
import numberUtil from '@myprint/design/utils/numberUtil';


export function recursionForTableCell(tableHeadList: TableHeadProviderCellElement[], callback: (providerCell: TableHeadProviderCellElement) => void) {
    for (let tableHeadCellElement of tableHeadList) {
        callback(tableHeadCellElement);
        if (tableHeadCellElement.childList != null && tableHeadCellElement.childList.length > 0) {
            recursionForTableCell(tableHeadCellElement.childList, callback);
        }
    }
}

// 表头深度
export function findTableHeadDeep(tableHeadList: TableHeadProviderCellElement[], deep: number) {
    for (let tableHeadCellElement of tableHeadList) {
        if (tableHeadCellElement.childList != null && tableHeadCellElement.childList.length > 0) {
            return findTableHeadDeep(tableHeadCellElement.childList, deep + 1);
        }
    }
    return deep;
}

// 根据位置获取对应的cell，级下面所有行
export function getTableCellDown(tableHeadList: TableCellElement[][], row: number, col: number) {
    const rowCellList: TableCellElement[][] = [];
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
            const cellList: TableCellElement[] = [];
            for (let j = 0; j < baseCell.colspan; j++) {
                if (rowList[colIndex + j])
                    cellList.push(rowList[colIndex + j]);
            }
            rowCellList.push(cellList);

        }

    }

    // console.log(rowCellList);
    return { rowCellList, colIndex };
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
            if (cell.runtimeOption.cellParent.id == baseCell.runtimeOption.cellParent.id) {
                childByParentList.push(cell);
            }
        }
    }
    return childByParentList;
}


export function computedCellRect(cellList: TableCellElement[]) {
    const rect = {
        x: 999999,
        y: 999999,
        width: 0,
        height: 0
    } as Rect;

    for (let i = 0; i < cellList.length; i++) {
        const cell = cellList[i];

        if (rect.x > cell.runtimeOption.x) {
            rect.x = cell.runtimeOption.x;
        }

        if (rect.y > cell.runtimeOption.y) {
            rect.y = cell.runtimeOption.y;
        }

        if (rect.width < cell.width) {
            rect.width = cell.width;
        }

        if (rect.height < cell.height) {
            rect.height = cell.height;
        }
    }

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
    if (deep > 0) {
        // 往后找
        for (let i = col + 1; i < rowList.length; i++) {
            const cell = rowList[i];
            if (cell != null) {
                if (--deep == 0) {
                    // debugger
                    return { cell: rowList[i], col: i };
                }
                i = i + cell.colspan;
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

export function computedTableCell(tableHeadListList: TableCellElement[][]) {
    const rowHeightList: number[] = [];
    let y = 0;
    for (let row = 0; row < tableHeadListList.length; row++) {
        let height = 0;
        let x = 0;
        const tableHeadListListElement = tableHeadListList[row];
        for (let col = 0; col < tableHeadListListElement.length; col++) {
            const tableCellElement = tableHeadListListElement[col];
            if (tableCellElement == null) {

                const tableCellElementTmp = findUpperCell(tableHeadListList, col, row)!;
                if (tableCellElementTmp == null) {
                    continue;
                }
                x = x + tableCellElementTmp.runtimeOption.width;
                continue;
            }

            if (tableCellElement.colspan > 1) {
                if (row + 1 < tableHeadListList.length) {
                    const childList = tableHeadListList[row + 1];
                    for (let childCol = col; childCol < childList.length; childCol++) {
                        const child = childList[childCol];
                        if (child == null) {
                            break;
                        }
                        if (child.runtimeOption == null) {
                            child.runtimeOption = {} as RuntimeElementOption;
                        }
                        child.runtimeOption.cellParent = tableCellElement;
                    }
                }
            }

            tableCellElement.runtimeOption.y = y;
            tableCellElement.runtimeOption.x = x;

            height = numberUtil.div(tableCellElement.runtimeOption.height, tableCellElement.rowspan);

            x = x + tableCellElement.runtimeOption.width;
        }

        y = y + height;
        rowHeightList.push(height);
    }

    return rowHeightList;
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
        const childList = tableHeadCell.childList;
        tableHeadCell.childList = undefined!;
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
