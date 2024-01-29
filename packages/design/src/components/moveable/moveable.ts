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
    MoveableInterface,
    MoveableManagerInterface, Renderer,
    MoveableOptions, BoundType, MoveableRefType, ElementGuidelineValueOption
} from './types'
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {nextTick, Ref, ref} from "vue";
import {GroupManager} from "@moveable/helper";
import {deepFlat, throttle} from "@daybrush/utils";
import {removeElement, setCurrentElement} from "@cp-print/design/utils/elementUtil";
import {defaultElement} from "@cp-print/design/constants/common";
import {arrayRemove} from "@cp-print/design/utils/arrays";
import Selecto from "selecto";
import {CpHtmlElement} from "@cp-print/design/types/entity";
// import {MoveableOptions} from "react-moveable";
let moveable: MoveableOptions
export const snapElementList: Ref<Array<ElementGuidelineValueOption | MoveableRefType<CpHtmlElement> | String>> = ref([".design-content"])
export const elementList:Ref<Array<CpHtmlElement>> = ref([])
let moveableRef: Ref<MoveableInterface>;
const bounds = {"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"} as BoundType;
export const tipsStatus = ref<'drag' | "resize" | 'rotate' | undefined>();
export const targets = ref([]) as Ref<Array<CpHtmlElement>>
const groupManager = new GroupManager([]);


export const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveable: MoveableManagerInterface, React: Renderer) {
        // console.log(moveable)
        // console.log(React)
        const rect = moveable.getRect();
        // console.log(moveable.events)
        let value = ''
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
    render(moveable: MoveableManagerInterface & {
        _dragTarget: any
    }, React: Renderer) {
        // console.log(moveable)
        const rect = moveable.getRect();
        const {pos2} = moveable.state;
        const EditableViewer = moveable.useCSS("div", `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .custom-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: black;
            font-weight: bold;
        }
            `);
        return React.createElement(EditableViewer, {
            key: "editable-viewer",
            className: "moveable-editable",
            style: {
                transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`
            }
        }, [
            React.createElement("button", {
                className: "custom-button cp-ss",
                onClick: () => {
                    // alert("+");

                    removeElement(moveable._dragTarget.element)
                    arrayRemove(targets.value, moveable._dragTarget)
                    // for (let valueElement of targets.value) {
                    // }
                }
            }, [
                "+"
            ])
        ]);
    }
}

export function updatePanel() {
    nextTick(() => {
        elementList.value = selecto.getSelectableElements() as Array<CpHtmlElement>;
        // console.log(elements)
        // console.log(snapElementList)
        groupManager.set([], elementList.value);
    })
}

export function setMoveable(_moveable: Ref<MoveableInterface>) {
    moveableRef = _moveable
    moveable = moveableRef.value['$_moveable']
    moveable.bounds = bounds
    // console.log(moveable)
}

function updateLocation(e: OnDrag) {
    // console.log('location,x: ', e.translate[0], ' y: ', e.translate[1])
    const target = (e.target as CpHtmlElement)
    // const rect = e.moveable.getRect();
    // console.log(rect)
    // target.element.x = px2unit(rect.left)
    // target.element.y = px2unit(rect.top)
    console.log(e.translate[0], target.element.runtimeOption.x!, e.translate[1], target.element.runtimeOption.y!)
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

export const onRender = (e: any) => {
    // console.log(e)
    e.target.style.cssText += e.cssText;
};

export const onRenderGroup = (e: any) => {
    // console.log(e)
    // console.log(e)
    e.events.forEach((ev: any) => {
        ev.target.style.cssText += ev.cssText;
    });
};

// export function onDragStart(_e: OnDragStart) {
//     // console.log('onDrag', e)
//     // updateLocation(e)
//     // e.target.style.transform = e.transform;
// }
//
export function onDragEnd(_e: OnDragEnd) {
    tipsStatus.value = undefined
    // console.log('onDrag', e)
    // updateLocation(e)
    // e.target.style.transform = e.transform;
}

export function onDrag(e: OnDrag) {
    // console.log('onDrag', e)
    updateLocation(e)
    // e.target.style.transform = e.transform;
}

export function onDragGroup(e: OnDragGroup) {
    console.log('onDragGroup', e)
    for (let event of e.events) {
        updateLocation(event)
    }
    // e.target.style.transform = e.transform;
}

export const onBeforeRotate = (e: any) => {
    e.setRotation(throttle(e.rotation, 1));
};

export function rotate(e: OnRotate) {
    // console.log('rotate', e)
    updateRotate(e)
    // e.target.style.transform = e.transform;
}

export function onRotateStart(_e: OnRotateStart) {
    tipsStatus.value = 'rotate'
    // console.log('rotate', e)
    // updateRotate(e)
    // e.target.style.transform = e.transform;
}

export function onRotateEnd(_e: OnRotateEnd) {
    tipsStatus.value = undefined
    // console.log('rotate', e)
    // updateRotate(e)
    // e.target.style.transform = e.transform;
}

export function rotateGroup(e: OnRotateGroup) {
    // console.log('rotateGroup', e)
    for (let event of e.events) {
        updateRotate(event)
    }
    // e.target.style.transform = e.transform;
}

export function resize(e: OnResize) {
    console.log('resize', e)
    // e.target.element.runtimeOption.width = e.width
    // e.target.element.runtimeOption.height =e.height
    // e.target.style.cssText += "width: "+ e.width+"px; height:"+ e.height+"px";
    updateRect(e)
    // e.target.style.transform = e.transform;
}

export function onResizeEnd(_e: OnResizeEnd) {
    // console.log('onResizeEnd', e)
    tipsStatus.value = undefined
}

export function onResizeStart(_e: OnResizeStart) {
    // console.log('onResizeStart', _e)
    tipsStatus.value = 'resize'
}

export function onBeforeResize(_e: OnBeforeResize) {
    // console.log('onBeforeResize', _e)
}

export function resizeGroup(e: OnResizeGroup) {
    // console.log('resizeGroup', e)
    for (let event of e.events) {
        updateRect(event)
    }
    // e.target.style.transform = e.transform;
}

export function round(_e: OnRound) {
    // console.log('round', e)
    // e.target.style.transform = e.transform;
}

export function roundGroup(_e: OnRoundGroup) {
    // console.log('roundGroup', e)
    // e.target.style.transform = e.transform;
}

export function bound(e: OnBound) {
    console.log('round', e)
    // e.target.style.transform = e.transform;
}

export const setSelectedTargets = (nextTargetes: any) => {
    selecto.setSelectedTargets(deepFlat(nextTargetes));
    targets.value = nextTargetes;
    setCurrentElement(defaultElement)

    // console.log(targets.value)
    if (targets.value.length == 1) {
        setCurrentElement(targets.value[0].element)
    }
    if (targets.value.length > 0) {
        if (targets.value[0].element.type == 'PageFooter') {
            // ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
            moveable.renderDirections = ["n"]
            moveable.draggable = false
            moveable.rotatable = false
            moveable.bounds = null
        } else {
            moveable.bounds = bounds
            moveable.rotatable = true
            moveable.draggable = true
            moveable.renderDirections = ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
        }

        if (targets.value[0].element.runtimeOption.parent!.type == 'PageFooter') {
            moveable.snapContainer = '.container'
        } else {
            moveable.snapContainer = null

        }
    }

    snapElementList.value.length = 1
    for (let element of elementList.value) {
        if (element.classList.contains("snap")) {
            snapElementList.value.push({element: element})
        }
    }
}


export const onDragStart = (_e: OnDragStart) => {
    tipsStatus.value = 'drag'
    // const moveable = moveableRef.value;
    // const target = e.inputEvent.target;
    // // console.log(targets.value)
    // const flatted = deepFlat(targets.value!);
    // if (target.tagName === "BUTTON" || moveable!.isMoveableElement(target)
    //     || flatted.some(t => t === target || t.contains(target))
    // ) {
    //     e.stop();
    // }
    // e.data.startTargets = targets.value;
}
export const onSelectDragStart = (e: any) => {
    const moveable = moveableRef.value;
    const target = e.inputEvent.target;
    // console.log(targets.value)
    const flatted = deepFlat(targets.value!);
    // console.log(moveable!.isMoveableElement(target))
    if (target.tagName === "BUTTON" || moveable!.isMoveableElement(target)
        || flatted.some(t => t === target || t.contains(target))
    ) {
        // console.log(123)
        e.stop();
    }
    // console.log(targets.value)
    e.data.startTargets = targets.value;
}

export const onSelect = (e: any) => {
    const {startAdded, startRemoved, isDragStartEnd} = e;
    if (isDragStartEnd) {
        return;
    }
    // console.log(e.data.startTargets, startAdded, startRemoved)
    const nextChilds = groupManager.selectSameDepthChilds(
        e.data.startTargets,
        startAdded,
        startRemoved
    );
    // console.log(nextChilds.targets())
    setSelectedTargets(nextChilds.targets());
};
export const onSelectEnd = (e: any) => {
    const {
        isDragStartEnd,
        isClick,
        added,
        removed,
        inputEvent,
    } = e;

    // console.log(e)

    for (let snapElement of removed) {
        snapElement.classList.add('snap')
    }
    for (let snapElement of added) {
        snapElement.classList.remove('snap')
    }

    // console.log(removed)

    const moveable = moveableRef.value;
    if (isDragStartEnd) {
        inputEvent.preventDefault();
        moveable.waitToChangeTarget().then(() => {
            moveable.dragStart(inputEvent);
        });
    }
    let nextChilds;
    if (isDragStartEnd || isClick) {
        nextChilds = groupManager.selectCompletedChilds(
            e.data.startTargets,
            added,
            removed
        );
    } else {
        nextChilds = groupManager.selectSameDepthChilds(
            e.data.startTargets,
            added,
            removed
        );
    }
    e.currentTarget.setSelectedTargets(nextChilds.flatten());
    // console.log(nextChilds.targets())
    setSelectedTargets(nextChilds.targets());
};
let selecto: Selecto

export function initSelect() {
    selecto = new Selecto({
        // The container to add a selection element
        container: document.querySelector('.affix-container') as HTMLElement,
        // Selecto's root container (No transformed container. (default: null)
        rootContainer: null,
        // The area to drag selection element (default: container)
        // dragContainer: Element,
        // Targets to select. You can register a queryselector or an Element.
        selectableTargets: [".design-select", document.querySelector(".design-select") as HTMLElement],
        // Whether to select by click (default: true)
        selectByClick: true,
        // Whether to select from the target inside (default: true)
        selectFromInside: false,
        // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
        // continueSelect: false,
        // Determines which key to continue selecting the next target via keydown and keyup.
        // toggleContinueSelect: "shift",
        // The container for keydown and keyup events
        // keyContainer: window,
        // The rate at which the target overlaps the drag area to be selected. (default: 100)
        hitRate: 0,
        ratio: 0,
    });

    selecto.on("dragStart", onSelectDragStart);
    selecto.on("select", onSelect);
    selecto.on("selectEnd", onSelectEnd);
}
