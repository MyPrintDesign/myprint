import { getSelectElement, removeSelectElement, updatePanel } from '@myprint/design/plugins/moveable/moveable';
import { elementTypeContainerList, noCopyElementTypeList } from '@myprint/design/constants/common';
import { Container, MyElement } from '@myprint/design/types/entity';
import { addElement, getCurrentPanel } from '@myprint/design/utils/elementUtil';
import { parse, stringify } from '@myprint/design/utils/utils';
import { ActionEnum, record, Snapshot } from '@myprint/design/utils/historyUtil';
import { nextTick } from 'vue-demi';
import { px2unit } from '@myprint/design/utils/devicePixelRatio';

type memoryClipboardType = 'COPY' | 'CUT'

function boundElement(newElement: MyElement, parentTmp: Container) {
    if (newElement.x + newElement.width > parentTmp.width) {
        newElement.x = parentTmp.width - newElement.width;
    }
    if (newElement.y + newElement.height > parentTmp.height) {
        newElement.y = parentTmp.height - newElement.height;
    }
}

function getIncr(clipboard: any, id: string) {
    let pasteNum = clipboard.pasteNumMap[id];
    if (pasteNum == undefined) {
        pasteNum = 1;
        clipboard.pasteNumMap[id] = pasteNum;
    }
    return pasteNum;
}

export const memoryClipboardUtil = {
    clipboard: {
        data: [] as MyElement[],
        type: 'COPY' as memoryClipboardType,
        pasteNumMap: {}
    },

    copy() {
        const elementList = getSelectElement().filter(v => !noCopyElementTypeList.includes(v.type));
        if (elementList.length == 0) {
            return;
        }

        for (let myElement of this.clipboard.data) {
            myElement.runtimeOption.cutIngIs = undefined!;
        }
        this.clipboard.data = elementList;
        this.clipboard.type = 'COPY';
        this.clipboard.pasteNumMap = {};
    },

    cut() {
        const elementList = getSelectElement().filter(v => !noCopyElementTypeList.includes(v.type));
        if (elementList.length == 0) {
            return;
        }
        for (let myElement of this.clipboard.data) {
            myElement.runtimeOption.cutIngIs = undefined!;
        }
        for (let myElement of elementList) {
            myElement.runtimeOption.cutIngIs = true;
        }
        this.clipboard.data = elementList;
        this.clipboard.type = 'CUT';
        this.clipboard.pasteNumMap = {};
    },

    paste() {
        if (this.clipboard.data == undefined) {
            return;
        }

        // 判断当前选中的元素
        const elementList = getSelectElement();
        const newElementList: MyElement[] = [];
        const panel = getCurrentPanel();
        let parent: Container = panel;

        if (elementList.length == 1 && elementTypeContainerList.includes(elementList[0].type)) {
            parent = elementList[0];
        }

        let panelPasteNum = getIncr(this.clipboard, panel.id);
        let pasteNum = getIncr(this.clipboard, parent.id);

        let x = px2unit(10) * pasteNum;
        let y = px2unit(10) * pasteNum;
        // console.log(elementList);
        if (elementTypeContainerList.includes(parent.type)) {
            x = -this.clipboard.data[0].x + x;
            y = -this.clipboard.data[0].y + y;
        }
        let incrParent = false;
        let incrPanel = false;

        if (this.clipboard.type == 'CUT') {
            for (let myElement of this.clipboard.data) {
                myElement.runtimeOption.cutIngIs = undefined!;
            }
            removeSelectElement(this.clipboard.data);
            // 删除原来的
            this.clipboard.type = 'COPY';
            for (let datum of this.clipboard.data) {
                const parentTmp = elementTypeContainerList.includes(datum.type) ? getCurrentPanel() : parent;
                computePosition(datum, parentTmp);
                boundElement(datum, parentTmp);
                addElement(parentTmp, datum);
                newElementList.push(datum);
            }
            // 记录历史
            record(<Snapshot>{
                type: 'Element',
                action: ActionEnum.CUT,
                elementList: newElementList
            });
        } else {
            // 粘贴新的
            for (let i = 0; i < this.clipboard.data.length; i++) {
                let datum = this.clipboard.data[i];

                const parentTmp = elementTypeContainerList.includes(datum.type) ? getCurrentPanel() : parent;

                // 设置合适的位置
                const newElement = parse(stringify(datum, 'parent', 'target'), {} as MyElement);
                newElement.id = undefined!;
                computePosition(newElement, parentTmp);

                boundElement(newElement, parentTmp);
                addElement(parentTmp, newElement);
                newElementList.push(newElement);
            }

            // 记录历史
            record(<Snapshot>{
                type: 'Element',
                action: ActionEnum.PASTE,
                elementList: newElementList
            });
        }

        nextTick(() => {
            // setSelectedTargets()
            if (elementTypeContainerList.includes(parent.type)) {
                newElementList.length = 0;
                newElementList.push(parent as MyElement);
            }
            updatePanel(newElementList);
        });

        if (incrPanel) {
            this.clipboard.pasteNumMap[panel.id]++;
        }
        if (incrParent) {
            this.clipboard.pasteNumMap[parent.id]++;
        }

        function computePosition(newElement: MyElement, parentTmp: Container) {
            if (parentTmp.type == 'Panel') {
                // 设置合适的位置
                newElement.x = newElement.x + px2unit(10) * panelPasteNum;
                newElement.y = newElement.y + px2unit(10) * panelPasteNum;
                incrPanel = true;
            } else {
                // 设置合适的位置
                newElement.x = newElement.x + x;
                newElement.y = newElement.y + y;
                incrParent = true;
            }
        }
    }

};
