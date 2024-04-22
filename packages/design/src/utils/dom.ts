import { isFunction } from './utils';
import { TableCellElement } from '@myprint/design/types/entity';

export const mouseEventType = {
    MOVE: 'mousemove',
    UP: 'mouseup'
};


// 获取rect模型
export function getSize(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return [parseInt(rect.width + ''), parseInt(rect.height + '')];
}

// 将选择器与父元素匹配
export function matchesSelectorToParentElements(el: any, selector: any, baseNode: any) {
    let node = el;
    const matchesSelectorFunc = [
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ].find(func => isFunction(node[func]))!;

    if (!isFunction(node[matchesSelectorFunc])) return false;
    do {
        if (node[matchesSelectorFunc](selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
    } while (node);

    return false;
}

export function getComputedSize($el: any) {
    const style = window.getComputedStyle($el);
    return [parseFloat(style.getPropertyValue('width')), parseFloat(style.getPropertyValue('height'))];
}

// 添加事件
export function addEvent(el: any, event: any, handler: any) {
    if (!el) {
        return;
    }
    if (el.attachEvent) {
        el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
        el.addEventListener(event, handler, true);
    } else {
        el['on' + event] = handler;
    }
}

// 删除事件
export function removeEvent(el: any, event: any, handler: any) {
    if (!el) {
        return;
    }
    if (el.detachEvent) {
        el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
        el.removeEventListener(event, handler, true);
    } else {
        el['on' + event] = null;
    }
}

export const tableColClone = {
    showIs: false,
    clonedTable: document.createElement('table'),
    init() {
        this.clonedTable.classList.add('my-print-table');
        this.clonedTable.classList.add('my-table-clone-drag');
    },

    show(columnLeft: number, columnTop: number, width: number, rows: TableCellElement[][]) {
        if (this.showIs) {
            return;
        }
        this.showIs = true;
        this.clonedTable.style.left = columnLeft - 0.5 + 'px';
        this.clonedTable.style.top = (columnTop - 0.5) + 'px';
        this.clonedTable.style.width = width + 1 + 'px';
        // this.clonedTable.style.opacity = '0.5';

        // 复制选中列的所有单元格并添加到新的表格中

        let tableHeight = 0;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.length == 0) {
                continue;
            }
            const tr = document.createElement('tr');
            this.clonedTable.appendChild(tr);
            for (let j = 0; j < row.length; j++) {
                // console.log(row[j].runtimeOption.target);
                const clonedCell = row[j].runtimeOption.target.cloneNode(true);
                if (row.length == 1) {
                    // console.log(111);
                    clonedCell.rowSpan = 1;
                }
                tr.appendChild(clonedCell);
            }
            tableHeight = tableHeight + row[row.length - 1].runtimeOption.height;
        }
        this.clonedTable.style.height = (tableHeight! - 1) + 'px';
        document.body.appendChild(this.clonedTable);
    },
    move(columnLeft: number) {
        this.clonedTable.style.left = columnLeft + 'px';
    },
    hidden() {
        if (!this.showIs) {
            return;
        }
        this.showIs = false;
        this.clonedTable.innerHTML = '';
        document.body.removeChild(this.clonedTable);
    }
};
tableColClone.init();
