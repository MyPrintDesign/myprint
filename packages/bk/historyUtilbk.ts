// import {reactive, ref} from "vue";
// import {Element, Panel} from "@/types/entity";
// import {arrayRemove, swap, toElement} from "@/utils/utils";
//
// export enum ActionEnum {
//     ADD = '添加',
//     RESIZE = '缩放',
//     REMOVE = '删除',
//     MOVE = '移动',
//     UPDATE_STYLE = '修改%s属性',
// }
//
// export interface Snapshot {
//     target: Element[]
//     action: ActionEnum,
//     type: 'ELEMENT' | 'PANEL'
// }
//
// let max = 50
// let current = ref(0)
// let snapshotList = reactive<Array<Snapshot>>([])
//
// function record(snapshot: Snapshot, ignoreField?: Array<keyof typeof snapshot.target[0]>) {
//     // historyRecord.value = snapshot
//     // commit()
//     // console.log(snapshot)
//     // console.log(current.value)
//     if (current.value < snapshotList.length) {
//         // 覆盖
//         snapshotList.splice(0, snapshotList.length - current.value);
//     }
//
//     snapshot.target = JSON.parse(JSON.stringify(snapshot.target))
//     if (ignoreField) {
//         for (let element of snapshot.target) {
//             for (let ignoreFieldElement of ignoreField) {
//                 element[ignoreFieldElement.toString()] = null
//             }
//         }
//     }
//
//     snapshotList.unshift(snapshot);
//
//     if (snapshotList.length > max) {
//         snapshotList.pop();
//     } else {
//         current.value++;
//     }
//     console.log(snapshotList)
//
// }
//
// function undo(): Snapshot {
//     // hUndo()
//     // return historyRecord.value
//     if (snapshotList.length <= 0) return;
//     if (current.value <= 0) return;
//
//     return snapshotList[snapshotList.length - current.value--];
// }
//
// function redo(): Snapshot {
//     if (current.value >= snapshotList.length) return;
//     return snapshotList[snapshotList.length - ++current.value];
// }
//
// function undoPanel(panel: Panel) {
//     const snapshot = undo()
//     if (!snapshot) {
//         return
//     }
//     reset(snapshot, panel)
// }
//
// function redoPanel(panel: Panel) {
//     const snapshot = redo()
//     if (!snapshot) {
//         return
//     }
//     reset(snapshot, panel)
// }
//
// function reset(snapshot: Snapshot, panel: Panel) {
//     if (snapshot.type == 'PANEL') {
//         // switch (h.action) {
//         //     case ActionEnum.RESIZE:
//         //         panel.width =
//         //         break
//         //
//         // }
//     } else if (snapshot.type == 'ELEMENT') {
//         switch (snapshot.action) {
//             case ActionEnum.ADD:
//                 for (let i = 0; i < snapshot.target.length; i++) {
//                     arrayRemove(panel.elementList, snapshot.target[i])
//                 }
//                 break
//             case ActionEnum.REMOVE:
//                 for (let i = 0; i < snapshot.target.length; i++) {
//                     panel.elementList.push(toElement(snapshot.target[i]))
//                 }
//                 break
//             case ActionEnum.RESIZE:
//             case ActionEnum.MOVE:
//                 for (let i = 0; i < snapshot.target.length; i++) {
//                     for (let j = 0; j < panel.elementList.length; j++) {
//                         if (panel.elementList[j].id == snapshot.target[i].id) {
//                             // console.log(snapshot.target[i])
//                             // console.log(panel.elementList[j])
//                             swap(snapshot.target[i], panel.elementList[j])
//                             // console.log(panel.elementList[j])
//                             break
//                         }
//                     }
//                 }
//                 break
//
//         }
//     }
// }
//
// function clear() {
//     current.value = 0
//     snapshotList = []
// }
//
// export {
//     record,
//     undoPanel,
//     redoPanel,
//     redo,
//     snapshotList,
//     current,
//     clear
// }
