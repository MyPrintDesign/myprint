import {
    OnDragStart,
    OnDragEnd,
    OnDrag,
    OnBeforeResize,
    OnResizeStart,
    OnResize,
    OnResizeEnd,
    OnDragGroup,
    OnResizeGroup,
    OnRound,
    OnRoundGroup,
    OnRotateGroup,
    OnRotateStart,
    OnRotateEnd,
    OnRotate,
    OnBound,
    OnChangeTargets,
    // MoveableInterface,
    MoveableManagerInterface, Renderer,
    MoveableOptions,
    BoundType, MoveableRefType, ElementGuidelineValueOption
} from './types'
import {px2unit, unit2px} from "@cp-print/design/utils/devicePixelRatio";
import {nextTick, reactive, Ref, ref} from "vue";
import {
    GroupManager
    // , TargetGroupsType
} from "@moveable/helper";
import {deepFlat, throttle} from "@daybrush/utils";
import {
    forElement,
    getCurrentPanel,
    removeElement,
    setCurrentElement
} from "@cp-print/design/utils/elementUtil";
import {defaultElement, elementTypeLineList} from "@cp-print/design/constants/common";
import {arrayRemove} from "@cp-print/design/utils/arrays";
import Selecto, {OnDragStart as OnSelectDragStart, OnSelectEnd, OnSelect} from "selecto";
import Moveable
    // , {makeAble}
    from "moveable";
import {Container, CpElement, CpHtmlElement, elementType} from "@cp-print/design/types/entity";
import numberUtil from "@cp-print/design/utils/numberUtil";
import {ElScrollbar} from "element-plus";
// import {OnBeforeDragStart} from "react-moveable";
let moveable: Moveable & MoveableOptions
let selecto: Selecto
let firstElement: CpHtmlElement | undefined;
const groupManager = new GroupManager([]);
let highlightRule: Record<'horizontal' | 'vertical', Container>
// 是否加载完成
let isChangeTargetLoadFinished = true
// let elScrollbar: InstanceType<typeof ElScrollbar>

export const snapElementList: Ref<Array<ElementGuidelineValueOption | MoveableRefType<CpHtmlElement>>> = ref([".design-content"])
export const elementList: Array<CpHtmlElement> = reactive([])
export const canSelectElementList: Array<CpHtmlElement> = reactive([])
const bounds = {"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"} as BoundType;
const boundsTop = {"top": 0, "position": "css"} as BoundType;
const boundsBottom = {"bottom": 0, "position": "css"} as BoundType;
const tipsStatus = ref<'drag' | "resize" | 'rotate' | undefined>();

const props = {dimensionViewable: true, editable: true, enterLeave: true}

export const targets = ref([]) as Ref<Array<CpHtmlElement>>
const noSelectList: Array<elementType> = ['PageFooter', 'PageHeader', 'Container']

export const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveableInner: MoveableManagerInterface, React: Renderer) {
        const rect = moveableInner.getRect();
        const {offsetX, offsetY} = offsetContainer()

        let value
        switch (tipsStatus.value) {
            case "resize":
                value = `(${Math.round(rect.offsetWidth)}*${Math.round(rect.offsetHeight)})`
                break
            case "rotate":
                value = `${Math.round(rect.rotation)}°`
                break
            case "drag":
                value = `(${Math.round(rect.left - offsetX)}, ${Math.round(rect.top - offsetY)})`
                break
        }

        return React.createElement("div", {
            key: "dimension-viewer",
            className: "moveable-dimension",
            style: {
                display: value ? 'block' : 'none',
                position: "absolute",
                left: `${rect.width / 2}px`,
                top: `${rect.height + 20}px`,
                background: "#4af",
                borderRadius: "2px",
                padding: "2px 4px",
                color: "black",
                fontSize: "13px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                willChange: "transform",
                transform: `translate(-50%, 0px)`
            }
        }, [
            value,
        ]);
    }
}

export const Editable = {
    name: "editable",
    props: [],
    events: [],
    render(moveableInner: MoveableManagerInterface & {
        _dragTarget: any
    }, React: Renderer) {
        // console.log(moveable)
        const rect = moveableInner.getRect();
        const {pos2} = moveableInner.state;
        const EditableViewer = moveableInner.useCSS("div", `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
            z-index: 10000;
        }
            `);
        return React.createElement(EditableViewer, {
            key: "editable-viewer",
            className: "moveable-editable",
            style: {
                transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(5px, -30px)`
            }
        }, [
            React.createElement("button", {
                className: "cp-ss icon-design-remove iconfont desgin-remove",
                onClick: () => {
                    // alert("+");
                    // console.log("删除")
                    // console.log(targets.value, moveableInner._dragTarget)
                    // console.log(targets.value[0] == moveableInner._dragTarget)
                    for (let moveableOne of moveableInner.getMoveables()) {
                        const cpElement = moveableOne.getDragElement() as CpHtmlElement
                        removeElement(cpElement.element)
                        arrayRemove(targets.value, cpElement)
                    }

                    // console.log(targets.value)
                    targets.value = [...targets.value]
                    setSelectedTargets(targets.value)
                }
            })
        ]);
    }
}

export function updatePanel() {
    nextTick(() => {
        setTimeout(() => {
            elementList.length = 0
            canSelectElementList.length = 0
            forElement(getCurrentPanel(), v => {
                // console.log(v.runtimeOption.target)
                elementList.push(v.runtimeOption.target)
                if (!noSelectList.includes(v.type)) {
                    canSelectElementList.push(v.runtimeOption.target)
                }
            })
            // console.log(selecto.getSelectableElements() as Array<CpHtmlElement>)
            // console.log(elementList)
            // console.log(snapElementList)
            selecto.selectableTargets = canSelectElementList
            groupManager.set([], canSelectElementList);
        }, 100)
    })
}

export function moveableMove(x: number, y: number) {
    if (!isChangeTargetLoadFinished) {
        return
    }
    // console.log(moveable.getTargets())
    // console.log(targets.value)
    // moveable.dragTarget
    moveable.request("draggable", {
        x: x,
        y: y,
        useSnap: true
    }, true);
}

export function moveableDragTarget(drag: HTMLElement | null, event?) {
    moveable.dragTarget = drag
    if (event) {
        moveable.dragStart(event)
    }
}

// 就是每次截单 和 导入一样 有个记录号 记录号下挂发货单/越库单 只要没有包裹码（已创建） 都可以取消两张单子 并把对应供拣越库记录的发货单号 和 越库单号清空
// 找到一个新方法 在供拣按单越库 和供拣门店直送 两个菜单的列表页和详情页 增加 手动回滚； 只要这张越库单 和对应的发货单 实发包裹数均为0
// 就可以手动回滚 手动回滚的定义是 把这张越库单对应的供拣越库记录的发货单号 越库单号 清掉 再把越库单和发货单的状态变成已取消
export function moveableClearDragTarget() {
    moveable.dragTarget = null
}

function updateLocation(e: OnDrag) {
    requestAnimationFrame(() => {
        // const {offsetX, offsetY} = offsetContainer()
        const target = e.target as CpHtmlElement
        // console.log(e)
        // console.log(target.element.runtimeOption.x! + e.translate[0], target.element.runtimeOption.y! + e.translate[1])
        target.element.x = px2unit(target.element.runtimeOption.x! + e.translate[0])
        target.element.y = px2unit(target.element.runtimeOption.y! + e.translate[1])

        // 特殊处理，兼容 bounds自动贴边时，无法达到边界值0
        if (Math.abs(target.element.x) < 2 || Math.abs(target.element.y) < 2) {
            const rect = moveable.getRect();
            if (rect.left == 0) {
                target.element.x = 0
            }
            if (rect.top == 0) {
                target.element.y = 0
            }
        }

        // const cpElement = moveableOne.getTargets()[0] as CpHtmlElement
        // console.log(rect)
        // console.log(rect.left - offsetX, rect.top - offsetY)
        // // console.log(cpElement.element)
        // cpElement.element.x = px2unit(rect.left - offsetX)
        // cpElement.element.y = px2unit(rect.top - offsetY)
    });
}

function offsetContainer() {
    let offsetX = 0, offsetY = 0

    if (targets.value.length > 0) {
        const targetElement = targets.value[0] as CpHtmlElement
        const parentElement = targetElement.element.runtimeOption.parent!
        if (noSelectList.includes(parentElement.type)) {
            // console.log('容器')
            offsetX = unit2px(parentElement.x)
            offsetY = unit2px(parentElement.y)
        }
    }
    return {offsetX, offsetY}
}

function updateRect(e: OnResize) {
    const target = (e.target as CpHtmlElement)
    let width = e.width
    let height = e.height
    if (elementTypeLineList.includes(target.element.type)) {
        width = numberUtil.limitMin(width, 30)
        height = numberUtil.limitMin(height, 30)
    }
    // console.log(e)
    computeDirectionRect('--direction-width', width)
    computeDirectionRect('--direction-height', height)

    requestAnimationFrame(() => {

        for (let moveableOne of moveable.getMoveables()) {
            const rect = moveableOne.getRect()
            const cpElement = moveableOne.getDragElement() as CpHtmlElement
            cpElement.element.x = px2unit(rect.left)
            cpElement.element.y = px2unit(rect.top)
        }
    });
    target.element.width = px2unit(e.width)
    target.element.height = px2unit(e.height)
}

function computeDirectionRect(attr: string, length: number) {
    requestAnimationFrame(() => {
        if (length < 70) {
            document.documentElement.style.setProperty(attr, (length / 3.5) + '');
        } else {
            document.documentElement.style.setProperty(attr, "20");
        }
    });

}

function updateRotate(e: OnRotate) {
    // console.log('rotate,r: ', e.rotation)
    const target = (e.target as CpHtmlElement)
    // console.log(e.rotation)
    // updateLocation()
    target.element.option.rotate = e.rotation % 360

}

const onRender = (e: any) => {
    console.log(e.cssText)
    // console.log(e)
    e.target.style.cssText += e.cssText;
    // console.log(e.cssText)
    updateRuleRect()
};

const onRenderGroup = (e: any) => {
    // console.log(e)
    // console.log(e)
    e.events.forEach((ev: any) => {
        ev.target.style.cssText += ev.cssText;
    });

    updateRuleRect()
};

function changeTargets(_e: OnChangeTargets) {
    // console.log(true)
    isChangeTargetLoadFinished = true
    // console.log('rect', e.moveable.getRect())
    // updateRuleRect()
}

const onDragStart = (_e: OnDragStart) => {

    tipsStatus.value = 'drag'
}

function onDragEnd(_e: OnDragEnd) {
    tipsStatus.value = undefined
    // console.log('onDrag', e)
    // updateLocation(e)
    // e.target.style.transform = e.transform;
}

function onDrag(_e: OnDrag) {
    // console.log('onDrag', _e)
    updateLocation(_e)
    // e.target.style.transform = e.transform;
}

function onDragGroup(e: OnDragGroup) {
    // console.log('onDragGroup', e)
    for (let _event of e.events) {
        updateLocation(e)
    }
    // e.target.style.transform = e.transform;
}

const onBeforeRotate = (e: any) => {
    e.setRotation(throttle(e.rotation, 1));
};

function rotate(e: OnRotate) {
    // console.log('rotate', e)
    updateRotate(e)
    // e.target.style.transform = e.transform;
}

function onRotateStart(_e: OnRotateStart) {
    tipsStatus.value = 'rotate'
    // console.log('rotate', e)
    // updateRotate(e)
    // e.target.style.transform = e.transform;
}

function onRotateEnd(_e: OnRotateEnd) {
    tipsStatus.value = undefined
    // console.log('rotate', e)
    // updateRotate(e)
    // e.target.style.transform = e.transform;
}

function rotateGroup(e: OnRotateGroup) {
    // console.log('rotateGroup', e)
    for (let event of e.events) {
        updateRotate(event)
    }
    // e.target.style.transform = e.transform;
}

function resize(e: OnResize) {
    // console.log('resize', e)
    // e.target.element.runtimeOption.width = e.width
    // e.target.element.runtimeOption.height =e.height
    // e.target.style.cssText += "width: "+ e.width+"px; height:"+ e.height+"px";
    updateRect(e)
    // e.target.style.transform = e.transform;
}

function onResizeEnd(_e: OnResizeEnd) {
    // console.log('onResizeEnd', e)
    tipsStatus.value = undefined
}

function onResizeStart(_e: OnResizeStart) {
    // console.log('onResizeStart', _e)
    tipsStatus.value = 'resize'
}

function onBeforeResize(_e: OnBeforeResize) {
    // console.log('onBeforeResize', _e)
}

function resizeGroup(e: OnResizeGroup) {
    // console.log('resizeGroup', e)
    for (let event of e.events) {
        updateRect(event)
    }
    // e.target.style.transform = e.transform;
}

function round(_e: OnRound) {
    // console.log('round', e)
    // e.target.style.transform = e.transform;
}

function roundGroup(_e: OnRoundGroup) {
    // console.log('roundGroup', e)
    // e.target.style.transform = e.transform;
}

function bound(_e: OnBound) {
    // console.log('bound', _e)
    // e.target.style.transform = e.transform;
}

function onScroll({scrollContainer, direction}) {
    let elemtnt = scrollContainer as HTMLElement
    // console.log(elemtnt.childNodes[0])
    elemtnt.childNodes[0].scrollBy(direction[0] * 10, direction[1] * 10);
    // console.log(direction[1] * 10)

    // console.log(scrollContainer, direction)
    // if(direction[1] == 1){
    //     elScrollbar.setScrollTop(elScrollbar.scrollbarRef)
    // }
    // options.onTriggerScroll(direction)
}

export const setSelectedTargets = (nextTargetes: Array<CpHtmlElement>) => {
    // console.log(nextTargetes)
    if (targets.value.length > 0) {
        if (nextTargetes.length == targets.value.length) {
            if (targets.value.length == 1 && targets.value[0] == nextTargetes[0]) {
                // console.log('setSelectedTargets return1')
                return;
            }
            if (targets.value.length > 1) {
                // console.log('setSelectedTargets return2')
                return
            }
        }
    }

    isChangeTargetLoadFinished = false
    targets.value = nextTargetes;
    moveable.target = targets.value
    selecto.setSelectedTargets(deepFlat(nextTargetes));

    if (nextTargetes.length == 0) {
        highlightRule.horizontal.x = undefined
        highlightRule.vertical.x = undefined
    }

    for (let nextTargete of nextTargetes) {
        nextTargete.element.status = 'HANDLE'
    }

    setCurrentElement(defaultElement)

    if (targets.value.length > 0) {
        const firstElementTarget = targets.value[0];
        defaultMoveable()

        if (targets.value.length == 1) {
            setCurrentElement(firstElementTarget.element)
            let width = unit2px(firstElementTarget.element.width)
            let height = unit2px(firstElementTarget.element.height)
            if (firstElementTarget.element.option.aspectRatio) {
                moveable.keepRatio = true
            }
            // "n" 可以解释为 "上"，表示向上移动或相对于参考点的较高位置。
            // "nw" 可以解释为 "左上"，表示向左上方移动或相对于参考点的较左上位置。
            // "ne" 可以解释为 "右上"，表示向右上方移动或相对于参考点的较右上位置。
            // "s" 可以解释为 "下"，表示向下移动或相对于参考点的较低位置。
            // "se" 可以解释为 "右下"，表示向右下方移动或相对于参考点的较右下位置。
            // "sw" 可以解释为 "左下"，表示向左下方移动或相对于参考点的较左下位置。
            // "e" 可以解释为 "右"，表示向右移动或相对于参考点的较右位置。
            // "w" 可以解释为 "左"，表示向左移动或相对于参考点的较左位置。

            if (firstElementTarget.element.type == 'HorizontalLine' || firstElementTarget.element.type == 'DottedHorizontalLine') {
                moveable.renderDirections = ["w", "e"]
                height = 30
            }

            if (firstElementTarget.element.type == 'VerticalLine' || firstElementTarget.element.type == 'DottedVerticalLine') {
                moveable.renderDirections = ["n", "s"]
                width = 30
            }

            if (firstElementTarget.element.type == 'PageFooter') {
                // ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
                moveable.renderDirections = ["n"]
                moveable.draggable = false
                moveable.rotatable = false
                moveable.bounds = boundsTop

            } else if (firstElementTarget.element.type == 'PageHeader') {
                // ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
                moveable.renderDirections = ["w"]
                moveable.draggable = false
                moveable.rotatable = false
                moveable.bounds = boundsBottom

            } else if (firstElementTarget.element.type == 'Container') {
                moveable.rotatable = false
            }

            computeDirectionRect('--direction-width', width)
            computeDirectionRect('--direction-height', height)
        } else {
            computeDirectionRect('--direction-width', 70)
            computeDirectionRect('--direction-height', 70)
        }

        const parent = firstElementTarget.element.runtimeOption.parent! as CpElement;
        if (noSelectList.includes(parent.type)) {
            moveable.snapContainer = parent.runtimeOption.target
        } else {
            moveable.snapContainer = null
        }
    }

    snapElementList.value.length = 1
    for (let element of elementList) {
        if (element.element.status == 'NONE') {
            snapElementList.value.push({element: element})
        }
    }
    // console.log(snapElementList.value.length)
    if (nextTargetes.length > 0) {
        moveable.waitToChangeTarget().then(() => {
            updateRuleRect()
        });
    }
}

const onSelectDragStart = (e: OnSelectDragStart) => {
    // const moveable = moveableRef.value;
    const target = e.inputEvent.target;
    // console.log(targets.value)
    const flatted = deepFlat(targets.value!);
    // console.log(moveable!.isMoveableElement(target))
    // @ts-ignore
    if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
        || flatted.some(t => t === target || t.contains(target))
    ) {
        // console.log(123)
        e.stop();
    }

    if (e.currentTarget.getSelectedTargets().length == 1) {
        // console.log(333)
        const currentSelect = e.currentTarget.getSelectedTargets()[0] as CpHtmlElement
        if (currentSelect.element.type != 'PageFooter') {
            stop()
        }
    }

    // console.log(e)
    // console.log(targets.value)
    // e.data.startTargets = targets.value;
    e.data.startTargets = targets.value;
}

const onSelect = (e: OnSelect) => {
    const {startAdded, startRemoved, isDragStartEnd} = e;
    if (isDragStartEnd) {
        return;
    }
    // console.log(e.data.startTargets, startAdded, startRemoved)
    const nextChilds = groupManager.selectSameDepthChilds(
        e.data.startTargets,
        startAdded,
        startRemoved
    )
    // console.log(startAdded)
    let targetList: Array<CpHtmlElement>
    const allTargets = nextChilds.targets() as Array<CpHtmlElement>
    if (allTargets.length == 1 || firstElement == undefined) {
        firstElement = allTargets[0] as CpHtmlElement;
    }

    targetList = allTargets.filter((v: CpHtmlElement) => {
        return (!firstElement || (firstElement && v.element.runtimeOption.parent == firstElement.element.runtimeOption.parent))
    })
    // @ts-ignore
    const controlBoxElement = moveable.getControlBoxElement() as HTMLElement
    setTimeout(() => {
        if (controlBoxElement.childNodes.length == 0) {
            controlBoxElement.remove()
        }
    }, 1)

    // console.log(nextChilds.targets())
    setSelectedTargets(targetList);
};
const onSelectEnd = (e: OnSelectEnd) => {
    const {
        isDragStartEnd,
        isClick,
        added,
        removed,
        inputEvent,
    } = e
    // console.log('select-end')
    // selecto.selectableTargets = selectElementList
    // console.log(e)
    for (let snapElement of removed) {
        const element = snapElement as CpHtmlElement;
        // snapElement.classList.add('snap')
        snapElement.classList.remove('design-activate')
        element.element.status = 'NONE'
    }
    for (let snapElement of added) {
        const element = snapElement as CpHtmlElement;
        // snapElement.classList.remove('snap')
        snapElement.classList.add('design-activate')
        element.element.status = 'HANDLE'
    }

    // console.log(removed)

    let nextChilds;
    if (isDragStartEnd || isClick) {
        nextChilds = groupManager.selectCompletedChilds(
            e.data.startTargets,
            added,
            removed
        )
    } else {
        nextChilds = groupManager.selectSameDepthChilds(
            e.data.startTargets,
            added,
            removed
        )
    }
    const targetList = nextChilds.targets().filter((v: CpHtmlElement) =>
        (!firstElement || (firstElement && v.element.runtimeOption.parent == firstElement.element.runtimeOption.parent)))
    // console.log(targetList)
    e.currentTarget.setSelectedTargets(targetList)
    firstElement = undefined
    // console.log(nextChilds.targets())
    setSelectedTargets(targetList)

    if (isDragStartEnd) {
        inputEvent.preventDefault();
        // @ts-ignore
        moveable.waitToChangeTarget().then(() => {
            updateRuleRect()
            moveable.dragStart(inputEvent)
        })
    }
};

function updateRuleRect() {
    setTimeout(() => {
        const rectInfo = moveable.getRect()
        // console.log('rectInfo', rectInfo)
        highlightRule.horizontal.x = rectInfo.left
        highlightRule.horizontal.width = rectInfo.width
        highlightRule.vertical.x = rectInfo.top
        highlightRule.vertical.width = rectInfo.height
    }, 0)
}

let options

export function initMoveable(_selecto, _highlightRule, _options) {
    // console.log(selecto)
    document.documentElement.style.setProperty('--direction-width', '20');
    document.documentElement.style.setProperty('--direction-height', '20');
    selecto = _selecto
    highlightRule = _highlightRule
    options = _options
    // elScrollbar = _elScrollbar


    moveable = new Moveable(
        document.querySelector(".design-content") as HTMLElement
        // document.querySelector("#app > section > main > div > div.display-flex.design-panel-container-height > div.design-panel.drag.user-select-none > div.display-flex > div.el-scrollbar.affix-container.design-panel-container-width > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default") as HTMLElement
        , {
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        // container: document.querySelector(".design-content") as HTMLElement,
        target: targets.value,
        bounds: bounds,
        draggable: true,
        resizable: true,
        scalable: true,

        // className: 'cp-design',
        rotatable: true,
        snappable: true,
        // throttleDrag: 1,
        // individualGroupable: true,
        // individualGroupableProps(element, index) {
        //     console.log(element, index)
        //     return {aa:123}
        // },
        // snapGap: true,
        snapRotationDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
        // , center: true, middle: true
        snapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),
        elementSnapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),

        // snapDirections: ({bottom: true}),
        // elementSnapDirections: ({bottom: true}),
        elementGuidelines: snapElementList.value,
        ables: [DimensionViewable, Editable],
        props: (props),
        // warpable: false,
        // Enabling pinchable lets you use events that
        // can be used in draggable, resizable, scalable, and rotateable.
        // pinchable: true, // ["resizable", "scalable", "rotatable"]
        // origin: true,
        // individualGroupable: false,
        keepRatio: false,
        // Resize, Scale Events at edges.
        edge: false,

        scrollable: false,
        scrollOptions: ({
            container: '.design-panel-container-width',
            threshold: 30,
            checkScrollEvent: true,
            throttleTime: 0
        })
        // throttleDrag: 0,
        // throttleResize: 0,
        // throttleScale: 0,
        // throttleRotate: 0,
    });
    // moveable.dragTarget

    selecto.on("dragStart", onSelectDragStart);
    selecto.on("select", onSelect);
    selecto.on("selectEnd", onSelectEnd);

    moveable.on('drag', onDrag)
    moveable.on('dragStart', onDragStart)
    moveable.on('dragEnd', onDragEnd)
    moveable.on('dragGroup', onDragGroup)
    moveable.on('rotateStart', onRotateStart)
    moveable.on('rotateEnd', onRotateEnd)
    moveable.on('rotate', rotate)
    moveable.on('rotateGroup', rotateGroup)
    moveable.on('resizeStart', onResizeStart)
    moveable.on('resize', resize)
    moveable.on('resizeGroup', resizeGroup)
    moveable.on('resizeEnd', onResizeEnd)
    moveable.on('beforeResize', onBeforeResize)
    moveable.on('beforeRotate', onBeforeRotate)
    moveable.on('round', round)
    moveable.on('roundGroup', roundGroup)
    moveable.on('bound', bound)
    moveable.on('render', onRender)
    moveable.on('renderGroup', onRenderGroup)
    moveable.on('changeTargets', changeTargets)
    moveable.on('scroll', onScroll)
}

function defaultMoveable() {
    moveable.bounds = bounds
    moveable.rotatable = true
    moveable.keepRatio = false
    moveable.draggable = true
    moveable.renderDirections = ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
}

// const MouseEnterLeaveAble = makeAble("enterLeave", {
//     mouseEnter(moveable) {
//         if (moveable.moveables) {
//             moveable.moveables.forEach(child => {
//                 child.state.target.style.backgroundColor = "#e55";
//             });
//         } else {
//             moveable.state.target.style.backgroundColor = "#e55";
//         }
//     },
//     mouseLeave(moveable) {
//         if (moveable.moveables) {
//             moveable.moveables.forEach(child => {
//                 child.state.target.style.backgroundColor = "";
//             });
//         } else {
//             moveable.state.target.style.backgroundColor = "";
//         }
//     }
// });
