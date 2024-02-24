import {ref} from "vue";
import {CpElement, elementTypeFormat, Panel} from "@cp-print/design/types/entity";
import {useManualRefHistory} from '@vueuse/core';
import {
    getCurrentPanel,
    installPanelParentElement
} from "./elementUtil";
import {useAppStoreHook as appStore} from "@cp-print/design/stores/app";

export enum ActionEnum {
    INIT = '加载',
    ADD = '添加<{element}>',
    RESIZE = '修改<{element}>尺寸',
    ROTATE = '旋转<{element}>',
    REMOVE = '删除<{element}>',
    CLEAR = '清空面板',
    MOVE = '移动<{element}>',
    BATCH_MOVE = '移动<多个元素>',
    UPDATE_STYLE = '修改<{element}>的[{content}]',
}

let max = 50

export interface Snapshot {
    panel?: Panel
    elementList?: CpElement[]
    content?: string
    action: ActionEnum,
    type?: 'Element' | 'PANEL'
}

const historyRecord = ref<Snapshot>(<Snapshot>{})
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
} = useManualRefHistory(historyRecord, {capacity: max})
let current = ref(0)

// let snapshotList = reactive<Array<Snapshot>>([])
function init() {
    // console.log(history)
    record(<Snapshot>{
        type: "PANEL",
        action: ActionEnum.INIT,
        elementList: appStore().currentElement
    })
    clear()
    // console.log(panel.elementList)
}

function record(snapshot: Snapshot) {
    let action = snapshot.action as any
    let label = ""
    if (snapshot.elementList) {
        for (let cpElement of snapshot.elementList) {
            label = label + (cpElement.label ? cpElement.label : elementTypeFormat[cpElement.type]) + ","
        }
    }else {
        label = "面板"
    }

    snapshot.panel = getCurrentPanel()
    if (action == ActionEnum.UPDATE_STYLE) {

        // console.log('修改', title)
        if (snapshot.elementList != null) {
            action = action.replace('{element}', label).replace("{content}", snapshot.content)
        } else {
            action = action.replace('{element}', label).replace("{content}", snapshot.content)
        }
    } else if ([ActionEnum.REMOVE, ActionEnum.ADD, ActionEnum.RESIZE, ActionEnum.ROTATE, ActionEnum.MOVE].includes(action)) {
        // console.log('删除', label)
        action = action.replace('{element}', label)
    }

    delete snapshot.elementList
    delete snapshot.content

    snapshot.action = action
    // console.log(snapshot)
    historyRecord.value = JSON.parse(JSON.stringify(snapshot, (key, value) => {
        if ("parent" == key) return undefined
        if ("target" == key) return undefined
        return value
    }))
    commit()
}

// function undoPanel(): Snapshot {
//     // hUndo()
//     // return historyRecord.value
//     if (snapshotList.length <= 0) return;
//     if (current.value <= 0) return;
//
//     return snapshotList[snapshotList.length - current.value--];
// }

// function redo(): Snapshot {
//     if (current.value >= snapshotList.length) return;
//     return snapshotList[snapshotList.length - ++current.value];
// }

function undoPanel() {
    if (!canUndo.value) {
        return
    }
    undo()
    // console.log(history)
    // console.log(historyRecord)
    // console.log(history)
    const panel = getCurrentPanel()
    panel.elementList = (historyRecord.value.panel as Panel).elementList
    installPanelParentElement(panel)
    // console.log(redoStack)
    // copyBasicType(historyRecord.value.target, panel)
    // if (!snapshot) {
    //     return
    // }
    // reset(snapshot, panel)
}

function redoPanel() {
    if (!canRedo.value) {
        return
    }
    // const snapshot = redo()
    // if (!snapshot) {
    //     return
    // }
    // reset(snapshot, panel)
    const panel = getCurrentPanel()
    redo()
    panel.elementList = (historyRecord.value.panel as Panel).elementList
    installPanelParentElement(panel)
    // copyBasicType(historyRecord.value.target, panel)
}

export function changeWrapper(val: string | number, title?: string, callback?: (arg: typeof val) => void) {
    record({
        elementList: appStore().currentElement,
        content: title,
        action: ActionEnum.UPDATE_STYLE
    } as Snapshot)
    if (callback) {
        callback(val)
    }
}

export function changeLog(action: ActionEnum, element: CpElement) {
    // record(<Snapshot>{
    //     elementList: element,
    //     action: action,
    //     panel: getCurrentPanel()
    // })
}

// function reset(snapshot: Snapshot, panel: Panel) {
// if (snapshot.type == 'PANEL') {
//     // switch (h.action) {
//     //     case ActionEnum.RESIZE:
//     //         panel.width =
//     //         break
//     //
//     // }
// } else if (snapshot.type == 'ELEMENT') {
//     switch (snapshot.action) {
//         case ActionEnum.ADD:
//             for (let i = 0; i < snapshot.target.length; i++) {
//                 arrayRemove(panel.elementList, snapshot.target[i])
//             }
//             break
//         case ActionEnum.REMOVE:
//             for (let i = 0; i < snapshot.target.length; i++) {
//                 panel.elementList.push(toElement(snapshot.target[i]))
//             }
//             break
//         case ActionEnum.RESIZE:
//         case ActionEnum.MOVE:
//             for (let i = 0; i < snapshot.target.length; i++) {
//                 for (let j = 0; j < panel.elementList.length; j++) {
//                     if (panel.elementList[j].id == snapshot.target[i].id) {
//                         // console.log(snapshot.target[i])
//                         // console.log(panel.elementList[j])
//                         swap(snapshot.target[i], panel.elementList[j])
//                         // console.log(panel.elementList[j])
//                         break
//                     }
//                 }
//             }
//             break
//
//     }
// }
// }

// function clear() {
//     current.value = 0
//     // snapshotList = []
// }

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
    current,
    clear
}
