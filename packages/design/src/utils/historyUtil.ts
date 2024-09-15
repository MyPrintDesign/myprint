import { ref } from 'vue-demi';
import { elementTypeFormat, MyElement, Panel } from '../types/entity';
import { useManualRefHistory } from '@vueuse/core';
import { getCurrentPanel, installPanelParentElement } from './elementUtil';
import { useAppStoreHook as appStore } from '../stores/app';
import { updatePanel } from '../plugins/moveable/moveable';
import { parse } from '../utils/utils';

export enum ActionEnum {
    INIT = '加载',
    ADD = '添加<{element}>',
    RESIZE = '修改<{element}>尺寸',
    ROTATE = '旋转<{element}>',
    REMOVE = '删除<{element}>',
    PASTE = '粘贴<{element}>',
    CUT = '剪切<{element}>',
    CLEAR = '清空面板',
    MOVE = '移动<{element}>',
    BATCH_MOVE = '移动<多个元素>',
    UPDATE_STYLE = '修改<{element}>的[{content}]',
    BATCH_UPDATE_STYLE = '修改<多个元素>的[{content}]',
}

let max = 50;

export interface History {
    label: string,
    content: string
}

export interface Snapshot {
    panel?: Panel
    elementList?: MyElement[]
    content?: string
    action: ActionEnum,
    type?: 'Element' | 'PANEL'
}

const historyRecord = ref<History>({} as History);
const {
    undoStack,
    redoStack,
    commit,
    history,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
} = useManualRefHistory(historyRecord, { capacity: max });

function init() {
    record(<Snapshot>{
        type: 'PANEL',
        action: ActionEnum.INIT,
        elementList: appStore().currentElement
    });
    clear();
}

function record(snapshot: Snapshot) {
    let action = snapshot.action as any;
    let label = '';
    if (snapshot.elementList) {
        for (let myElement of snapshot.elementList) {
            label = label + (myElement.label ? myElement.label : elementTypeFormat[myElement.type]) + ',';
        }
        label = label.slice(0, -1);
    } else {
        label = '面板';
    }

    snapshot.panel = getCurrentPanel();
    if (action == ActionEnum.UPDATE_STYLE) {
        if (snapshot.elementList != null) {
            action = action.replace('{element}', label).replace('{content}', snapshot.content);
        } else {
            action = action.replace('{element}', label).replace('{content}', snapshot.content);
        }
    } else if ([ActionEnum.REMOVE, ActionEnum.ADD, ActionEnum.RESIZE, ActionEnum.ROTATE, ActionEnum.MOVE, ActionEnum.CUT, ActionEnum.PASTE].includes(action)) {
        action = action.replace('{element}', label);
    }

    delete snapshot.elementList;
    delete snapshot.content;

    snapshot.action = action;
    historyRecord.value = {
        content: JSON.stringify(snapshot, (key, value) => {
            if ('parent' == key) return undefined;
            if ('target' == key) return undefined;
            return value;
        }),
        label: action
    };
    commit();
}

function undoPanel() {
    if (!canUndo.value) {
        return;
    }
    undo();
    const snapshot = {} as Snapshot;
    parse(historyRecord.value.content, snapshot);
    const panel = getCurrentPanel();
    // panel.elementList = [];
    panel.elementList = snapshot.panel!.elementList;
    panel.pageHeader = snapshot.panel!.pageHeader;
    panel.pageFooter = snapshot.panel!.pageFooter;
    installPanelParentElement(panel);
    updatePanel();
}

function redoPanel() {
    if (!canRedo.value) {
        return;
    }
    const panel = getCurrentPanel();
    redo();
    const snapshot = {} as Snapshot;
    parse(historyRecord.value.content, snapshot);
    // panel.elementList = [];
    panel.elementList = snapshot.panel!.elementList;
    panel.pageHeader = snapshot.panel!.pageHeader;
    panel.pageFooter = snapshot.panel!.pageFooter;
    installPanelParentElement(panel);
    updatePanel();
}

export function changeWrapper(val: string | number, title?: string, callback?: (arg: typeof val) => void) {
    record({
        elementList: appStore().currentElement,
        content: title,
        action: ActionEnum.UPDATE_STYLE
    } as Snapshot);
    if (callback) {
        callback(val);
    }
}

export {
    init,
    record,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
    undoPanel,
    redoPanel,
    redo,
    history,
    clear
};
