import { valueUnit } from '@myprint/design/utils/elementUtil';
import { printCssStyle } from '@myprint/design/utils/utils';
import { Panel, TableCellElement } from '@myprint/design/types/entity';


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

export function getPrintElementHtml(htmlElement: HTMLElement[], pageList: any[]) {
    let html = '<div style="width: 60mm; overflow: hidden; background: black !important; --tcolor: black;">';
    for (let i = 0; i < htmlElement!.length; i++) {
        html += htmlElement![i].outerHTML;
    }
    html += '</div>';
    pageList.length = 0;
    return html;
}

export function iFramePrint(panel: Panel, html: string) {
    // 创建iframe
    let iframe = document.createElement('iframe');
    // 设置iframe样式
    iframe.setAttribute('id', 'print-box');
    iframe.setAttribute(
        'style',
        `height: ${valueUnit(panel.height)}; width: ${valueUnit(panel.width)}; display: none; position: absolute; left: 99999; top: 0;border: 0;
      z-index: 10000;`
    );
    // 在页面插入iframe
    document.body.appendChild(iframe);
    // 获取iframe内的html
    let iframeDocument = iframe.contentWindow!.document;
    // 经需要打印的DOM插入iframe

    const linkElement = iframeDocument.createElement('style');
    linkElement.type = 'text/css';
    linkElement.textContent = printCssStyle(); // 根据实际文件路径修改
    iframeDocument.body.innerHTML = html;

    // 设置iframe内的header，添加样式文件
    iframeDocument.getElementsByTagName('head')[0].innerHTML = `
  <style>
    *{ margin:0;padding:0; }
    @media print {
      @page {
        size: ${valueUnit(panel.width)} ${valueUnit(panel.height)};
        margin: 0;
      }
    }
  </style>
  <meta http-equiv="content-type" content="text/html;charset=utf-8">`;
    iframeDocument.head.appendChild(linkElement);

    // 关闭iframe
    iframeDocument.close();
    // 使iframe失去焦点
    iframe.contentWindow!.focus();
    // 调用iframe的打印方法
    iframe.contentWindow!.print();
    // 移除iframe
    setTimeout(function() {
        // console.log('关闭');
        // data.pageList = [];
        document.body.removeChild(iframe);
    }, 100);
}
