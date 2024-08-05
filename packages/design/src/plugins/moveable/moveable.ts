let entityModule: any = {};
const moveableLocal = false;

if (moveableLocal) {
    loadMoveableLocal();
}

import {
    addCanSelectElement as addCanSelectElementJs,
    alignBottom as alignBottomJs,
    alignHorizontalCenter as alignHorizontalCenterJs,
    alignLeft as alignLeftJs,
    alignRight as alignRightJs,
    alignTop as alignTopJs,
    alignVerticalCenter as alignVerticalCenterJs,
    arrangeHorizontalSpacing as arrangeHorizontalSpacingJs,
    arrangeVerticalSpacing as arrangeVerticalSpacingJs,
    changeDragSnapIs as changeDragSnapIsJs,
    checkInput as checkInputJs,
    dragNewElement as dragNewElementJs,
    dragNewElementCancel as dragNewElementCancelJs,
    freshMoveableOption as freshMoveableOptionJs,
    getSelectElement as getSelectElementJs,
    group as groupJs,
    initMoveable as initMoveableJs,
    moveableClearDragTarget as moveableClearDragTargetJs,
    moveableDragOffsetResize as moveableDragOffsetResizeJs,
    moveableDragResize as moveableDragResizeJs,
    moveableDragTarget as moveableDragTargetJs,
    moveableEditing as moveableEditingJs,
    moveableMove as moveableMoveJs,
    moveableMoveOffset as moveableMoveOffsetJs,
    moveableMoveX as moveableMoveXJs,
    moveableMoveY as moveableMoveYJs,
    moveableResize as moveableResizeJs,
    moveableResizeOffset as moveableResizeOffsetJs,
    moveableRotate as moveableRotateJs,
    removeCanSelectElement as removeCanSelectElementJs,
    removeSelectElement as removeSelectElementJs,
    selectAllElement as selectAllElementJs,
    selectTabNext as selectTabNextJs,
    setSelectedTargets as setSelectedTargetsJs,
    testMoveable as testMoveableJs,
    ungroup as ungroupJs,
    updateMoveableRect as updateMoveableRectJs,
    updatePanel as updatePanelJs
    //@ts-ignore
} from '@myprint/design/plugins/moveable/moveable_js';
import { elementStatus, MyElement, MyHtmlElement } from '@myprint/design/types/entity';
const defineFun = () => {
};

let addCanSelectElementLocal: any = defineFun,
    alignBottomLocal: any = defineFun,
    alignHorizontalCenterLocal: any = defineFun,
    alignLeftLocal: any = defineFun,
    alignRightLocal: any = defineFun,
    alignTopLocal: any = defineFun,
    alignVerticalCenterLocal: any = defineFun,
    arrangeHorizontalSpacingLocal: any = defineFun,
    arrangeVerticalSpacingLocal: any = defineFun,
    changeDragSnapIsLocal: any = defineFun,
    checkInputLocal: any = defineFun,
    dragNewElementLocal: any = defineFun,
    dragNewElementCancelLocal: any = defineFun,
    freshMoveableOptionLocal: any = defineFun,
    getSelectElementLocal: any = defineFun,
    groupLocal: any = defineFun,
    initMoveableLocal: any = defineFun,
    moveableClearDragTargetLocal: any = defineFun,
    moveableDragOffsetResizeLocal: any = defineFun,
    moveableDragResizeLocal: any = defineFun,
    moveableDragTargetLocal: any = defineFun,
    moveableEditingLocal: any = defineFun,
    moveableMoveLocal: any = defineFun,
    moveableMoveOffsetLocal: any = defineFun,
    moveableMoveXLocal: any = defineFun,
    moveableMoveYLocal: any = defineFun,
    moveableResizeLocal: any = defineFun,
    moveableResizeOffsetLocal: any = defineFun,
    moveableRotateLocal: any = defineFun,
    removeCanSelectElementLocal: any = defineFun,
    removeSelectElementLocal: any = defineFun,
    selectAllElementLocal: any = defineFun,
    selectTabNextLocal: any = defineFun,
    setSelectedTargetsLocal: any = defineFun,
    testMoveableLocal: any = defineFun,
    ungroupLocal: any = defineFun,
    updateMoveableRectLocal: any = defineFun,
    updatePanelLocal: any = defineFun;

async function loadMoveableLocal() {
    if (!moveableLocal) {
        return;
    }

    try {
        //@ts-ignore
        entityModule = await import('./moveable_local');
        addCanSelectElementLocal = entityModule.addCanSelectElement;
        alignBottomLocal = entityModule.alignBottom;
        alignHorizontalCenterLocal = entityModule.alignHorizontalCenter;
        alignLeftLocal = entityModule.alignLeft;
        alignRightLocal = entityModule.alignRight;
        alignTopLocal = entityModule.alignTop;
        alignVerticalCenterLocal = entityModule.alignVerticalCenter;
        arrangeHorizontalSpacingLocal = entityModule.arrangeHorizontalSpacing;
        arrangeVerticalSpacingLocal = entityModule.arrangeVerticalSpacing;
        changeDragSnapIsLocal = entityModule.changeDragSnapIs;
        checkInputLocal = entityModule.checkInput;
        dragNewElementLocal = entityModule.dragNewElement;
        dragNewElementCancelLocal = entityModule.dragNewElementCancel;
        freshMoveableOptionLocal = entityModule.freshMoveableOption;
        getSelectElementLocal = entityModule.getSelectElement;
        groupLocal = entityModule.group;
        initMoveableLocal = entityModule.initMoveable;
        moveableClearDragTargetLocal = entityModule.moveableClearDragTarget;
        moveableDragOffsetResizeLocal = entityModule.moveableDragOffsetResize;
        moveableDragResizeLocal = entityModule.moveableDragResize;
        moveableDragTargetLocal = entityModule.moveableDragTarget;
        moveableEditingLocal = entityModule.moveableEditing;
        moveableMoveLocal = entityModule.moveableMove;
        moveableMoveOffsetLocal = entityModule.moveableMoveOffset;
        moveableMoveXLocal = entityModule.moveableMoveX;
        moveableMoveYLocal = entityModule.moveableMoveY;
        moveableResizeLocal = entityModule.moveableResize;
        moveableResizeOffsetLocal = entityModule.moveableResizeOffset;
        moveableRotateLocal = entityModule.moveableRotate;
        removeCanSelectElementLocal = entityModule.removeCanSelectElement;
        removeSelectElementLocal = entityModule.removeSelectElement;
        selectAllElementLocal = entityModule.selectAllElement;
        selectTabNextLocal = entityModule.selectTabNext;
        setSelectedTargetsLocal = entityModule.setSelectedTargets;
        testMoveableLocal = entityModule.testMoveable;
        ungroupLocal = entityModule.ungroup;
        updateMoveableRectLocal = entityModule.updateMoveableRect;
        updatePanelLocal = entityModule.updatePanel;
    } catch (error) {
        console.error('模块不存在或导入失败', error);
    }
}

export function dragNewElement(newElement: MyHtmlElement, inputEvent) {
    moveableLocal ? dragNewElementLocal(newElement, inputEvent) : dragNewElementJs(newElement, inputEvent);
}

export function dragNewElementCancel(newElement: MyHtmlElement) {
    moveableLocal ? dragNewElementCancelLocal(newElement) : dragNewElementCancelJs(newElement);
}

export function updatePanel(list: MyElement[] = []) {
    moveableLocal ? updatePanelLocal(list) : updatePanelJs(list);
}

export function moveableMove(x?: number, y?: number) {
    moveableLocal ? moveableMoveLocal(x, y) : moveableMoveJs(x, y);
}

export function moveableMoveX(x: number) {
    moveableLocal ? moveableMoveXLocal(x) : moveableMoveXJs(x);
}

export function moveableMoveY(y: number) {
    moveableLocal ? moveableMoveYLocal(y) : moveableMoveYJs(y);
}

export function moveableMoveOffset(x: number, y: number) {
    moveableLocal ? moveableMoveOffsetLocal(x, y) : moveableMoveOffsetJs(x, y);
}

export function group() {
    moveableLocal ? groupLocal() : groupJs();
}

export function ungroup() {
    moveableLocal ? ungroupLocal() : ungroupJs();
}

export function moveableResize(width: number, height: number, keepRatio?: boolean) {
    moveableLocal ? moveableResizeLocal(width, height, keepRatio) : moveableResizeJs(width, height, keepRatio);
}

export function moveableRotate(rotate: number) {
    moveableLocal ? moveableRotateLocal(rotate) : moveableRotateJs(rotate);
}

export function moveableResizeOffset(width: number, height: number, keepRatio?: boolean) {
    moveableLocal ? moveableResizeOffsetLocal(width, height, keepRatio) : moveableResizeOffsetJs(width, height, keepRatio);
}

export function moveableDragResize(x: number, y: number, width: number, height: number, element: MyElement) {
    moveableLocal ? moveableDragResizeLocal(x, y, width, height, element) : moveableDragResizeJs(x, y, width, height, element);
}

export function moveableDragOffsetResize(x: number, y: number, width: number, height: number, element: MyElement) {
    moveableLocal ? moveableDragOffsetResizeLocal(x, y, width, height, element) : moveableDragOffsetResizeJs(x, y, width, height, element);
}

export function moveableDragTarget(drag: HTMLElement | null, event?) {
    moveableLocal ? moveableDragTargetLocal(drag, event) : moveableDragTargetJs(drag, event);
}

export function moveableClearDragTarget() {
    moveableLocal ? moveableClearDragTargetLocal() : moveableClearDragTargetJs();
}

export function alignTop() {
    moveableLocal ? alignTopLocal() : alignTopJs();
}

export function alignBottom() {
    moveableLocal ? alignBottomLocal() : alignBottomJs();

}

export function alignLeft() {
    moveableLocal ? alignLeftLocal() : alignLeftJs();
}

export function alignRight() {
    moveableLocal ? alignRightLocal() : alignRightJs();
}

export function alignVerticalCenter() {
    moveableLocal ? alignVerticalCenterLocal() : alignVerticalCenterJs();
}

export function alignHorizontalCenter() {
    moveableLocal ? alignHorizontalCenterLocal() : alignHorizontalCenterJs();
}

/**
 * 排列垂直间距
 */
export function arrangeVerticalSpacing() {
    moveableLocal ? arrangeVerticalSpacingLocal() : arrangeVerticalSpacingJs();
}

/**
 * 排列水平间距
 */
export function arrangeHorizontalSpacing() {
    moveableLocal ? arrangeHorizontalSpacingLocal() : arrangeHorizontalSpacingJs();
}

export function updateMoveableRect() {
    moveableLocal ? updateMoveableRectLocal() : updateMoveableRectJs();
}

export const setSelectedTargets = (nextTargetes: Array<MyHtmlElement | MyHtmlElement[]>, status: elementStatus = 'HANDLE') => {
    moveableLocal ? setSelectedTargetsLocal(nextTargetes, status) : setSelectedTargetsJs(nextTargetes, status);
};

export function freshMoveableOption(element: MyElement) {
    moveableLocal ? freshMoveableOptionLocal(element) : freshMoveableOptionJs(element);
}

export function initMoveable(_selecto, _highlightRule) {
    moveableLocal ? initMoveableLocal(_selecto, _highlightRule) : initMoveableJs(_selecto, _highlightRule);
}

export function getSelectElement() {
    return moveableLocal ? getSelectElementLocal() : getSelectElementJs();
}

export function selectAllElement() {
    moveableLocal ? selectAllElementLocal() : selectAllElementJs();
}

export function removeSelectElement(elementList?: MyElement[]) {
    moveableLocal ? removeSelectElementLocal(elementList) : removeSelectElementJs(elementList);
}

export function addCanSelectElement(elementList: MyElement | MyElement[]) {
    moveableLocal ? addCanSelectElementLocal(elementList) : addCanSelectElementJs(elementList);
}

export function removeCanSelectElement(elementList: MyElement | MyElement[]) {
    moveableLocal ? removeCanSelectElementLocal(elementList) : removeCanSelectElementJs(elementList);
}

export function selectTabNext() {
    moveableLocal ? selectTabNextLocal() : selectTabNextJs();
}

export function moveableEditing() {
    moveableLocal ? moveableEditingLocal() : moveableEditingJs();
}

export function testMoveable() {
    moveableLocal ? testMoveableLocal() : testMoveableJs();
}

export function checkInput() {
    moveableLocal ? checkInputLocal() : checkInputJs();
}

/**
 * 边界限制
 * @param filterStatus
 */
export function changeDragSnapIs(filterStatus: boolean = true) {
    moveableLocal ? changeDragSnapIsLocal(filterStatus) : changeDragSnapIsJs(filterStatus);
}
