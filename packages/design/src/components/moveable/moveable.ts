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
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {nextTick, reactive, Ref, ref} from "vue";
import {
    GroupManager
    // , TargetGroupsType
} from "@moveable/helper";
import {deepFlat, throttle} from "@daybrush/utils";
import {
    forElement,
    getCurrentPanel,
    // removeElement,
    setCurrentElement
} from "@cp-print/design/utils/elementUtil";
import {defaultElement} from "@cp-print/design/constants/common";
// import {arrayRemove} from "@cp-print/design/utils/arrays";
import Selecto, {OnDragStart as OnSelectDragStart, OnSelectEnd, OnSelect} from "selecto";
import Moveable from "moveable";
import {Container, CpElement, CpHtmlElement, elementType} from "@cp-print/design/types/entity";
// import {MoveableOptions} from "react-moveable";
let moveable: Moveable & MoveableOptions
let selecto: Selecto
let firstElement: CpHtmlElement | undefined;
const groupManager = new GroupManager([]);
let highlightRule: Record<'horizontal' | 'vertical', Container>
// 是否加载完成
let isChangeTargetLoadFinished = true

export const snapElementList: Ref<Array<ElementGuidelineValueOption | MoveableRefType<CpHtmlElement>>> = ref([".design-content"])
export const elementList: Array<CpHtmlElement> = reactive([])
export const selectElementList: Array<CpHtmlElement> = reactive([])
const bounds = {"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"} as BoundType;
const boundsTop = {"top": 0, "position": "css"} as BoundType;
const tipsStatus = ref<'drag' | "resize" | 'rotate' | undefined>();

const props = {dimensionViewable: true, editable: true}

export const targets = ref([]) as Ref<Array<CpHtmlElement>>
const noSelectList: Array<elementType> = ['PageFooter', 'PageHeader', 'Container']

export const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveableInner: MoveableManagerInterface, React: Renderer) {
        // console.log(React)
        const rect = moveableInner.getRect();
        let value
        switch (tipsStatus.value) {
            case "resize":
                value = `(${Math.round(rect.offsetWidth)}*${Math.round(rect.offsetHeight)})`
                break
            case "rotate":
                value = `${Math.round(rect.rotation)}°`
                break
            case "drag":
                value = `(${Math.round(rect.left)}, ${Math.round(rect.top)})`
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
                    console.log("删除")
                    // removeElement(moveableInner._dragTarget.element)
                    // arrayRemove(targets.value, moveableInner._dragTarget)
                    // for (let valueElement of targets.value) {
                    // }
                }
            })
        ]);
    }
}

export function updatePanel() {
    nextTick(() => {
        setTimeout(() => {
            elementList.length = 0
            selectElementList.length = 0
            forElement(getCurrentPanel(), v => {
                // console.log(v.runtimeOption.target)
                elementList.push(v.runtimeOption.target)
                if (!noSelectList.includes(v.type)) {
                    selectElementList.push(v.runtimeOption.target)
                }
            })
            // console.log(selecto.getSelectableElements() as Array<CpHtmlElement>)
            // console.log(elementList)
            // console.log(snapElementList)
            selecto.selectableTargets = selectElementList
            groupManager.set([], selectElementList);
        }, 100)
    })
}

export function moveableMove(x: number, y: number) {
    if (!isChangeTargetLoadFinished) {
        return
    }
    console.log(moveable.getTargets())
    // console.log(targets.value)
    moveable.request("draggable", {
        x: x,
        y: y
    }, true);
}

function updateLocation(e: OnDrag) {
    // console.log('location,x: ', e.translate[0], ' y: ', e.translate[1])
    const target = (e.target as CpHtmlElement)
    // const rect = e.moveable.getRect();
    // console.log(rect)
    // target.element.x = px2unit(rect.left)
    // target.element.y = px2unit(rect.top)
    // console.log(e.translate[0], target.element.runtimeOption.x!, e.translate[1], target.element.runtimeOption.y!)
    target.element.x = px2unit(target.element.runtimeOption.x! + e.translate[0])
    target.element.y = px2unit(target.element.runtimeOption.y! + e.translate[1])

    // target.element.x = px2unit(e.left + target.element.runtimeOption.x!)
    // target.element.y = px2unit(e.top+ target.element.runtimeOption.y!)
}

function updateRect(e: OnResize) {
    const target = (e.target as any)
    if (e.width < 70) {
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--direction-width', (e.width / 3.5) + '');
            // directionStyle.value["--width"] = e.width / 3.5
        });
    }
    if (e.height < 70) {
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--direction-height', (e.height / 3.5) + '');

            // directionStyle.value["--height"] =
        });
    }

    target.element.x = px2unit(target.element.runtimeOption.x! + e.drag.translate[0])
    target.element.y = px2unit(target.element.runtimeOption.y! + e.drag.translate[1])

    target.element.width = px2unit(e.width)
    target.element.height = px2unit(e.height)
}

function updateRotate(e: OnRotate) {
    // console.log('rotate,r: ', e.rotation)
    const target = (e.target as CpHtmlElement)
    // console.log(e.rotation)
    target.element.option.rotate = e.rotation % 360

}

const onRender = (e: any) => {
    // console.log(e)
    e.target.style.cssText += e.cssText;

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

function onDrag(e: OnDrag) {
    // console.log('onDrag', e)
    updateLocation(e)
    // e.target.style.transform = e.transform;
}

function onDragGroup(e: OnDragGroup) {
    // console.log('onDragGroup', e)
    for (let event of e.events) {
        updateLocation(event)
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
    // console.log('bound', e)
    // e.target.style.transform = e.transform;
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
    moveable.target = nextTargetes
    selecto.setSelectedTargets(deepFlat(nextTargetes));

    targets.value = nextTargetes;

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
        let customOptions = false
        if (targets.value.length == 1) {
            setCurrentElement(firstElementTarget.element)
            if (firstElementTarget.element.option.aspectRatio) {
                moveable.keepRatio = true

                customOptions = true
            }

            if (firstElementTarget.element.type == 'PageFooter') {
                // ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
                moveable.renderDirections = ["n"]
                moveable.draggable = false
                moveable.rotatable = false
                moveable.bounds = boundsTop

                customOptions = true
            } else if (firstElementTarget.element.type == 'Container') {
                moveable.rotatable = false
                customOptions = true
            }
        }

        if (!customOptions) {
            defaultMoveable()

        }
        const parent = firstElementTarget.element.runtimeOption.parent! as CpElement;
        if (parent.type == 'PageFooter' || parent.type == 'Container') {
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
    console.log(targetList)
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

export function initMoveable(_selecto, _highlightRule) {
    // console.log(selecto)
    document.documentElement.style.setProperty('--direction-width', '20');
    document.documentElement.style.setProperty('--direction-height', '20');

    selecto = _selecto
    highlightRule = _highlightRule
    moveable = new Moveable(document.querySelector(".design-content") as HTMLElement, {
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        // container: document.querySelector(".design-content") as HTMLElement,
        target: targets.value,
        bounds: bounds,
        draggable: true,
        resizable: true,
        scalable: true,
        rotatable: true,
        snappable: true,
        throttleDrag: 1,
        // individualGroupable: true,
        // individualGroupableProps(element, index) {
        //     console.log(element, index)
        //     return {aa:123}
        // },
        snapGap: true,
        snapRotationDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
        snapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),
        elementSnapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),
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
        // throttleDrag: 0,
        // throttleResize: 0,
        // throttleScale: 0,
        // throttleRotate: 0,
    });

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
}

function defaultMoveable() {
    moveable.bounds = bounds
    moveable.rotatable = true
    moveable.draggable = true
    moveable.renderDirections = ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
}
