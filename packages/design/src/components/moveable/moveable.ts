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
    // MoveableInterface,
    MoveableManagerInterface, Renderer,
    MoveableOptions,
    BoundType, MoveableRefType, ElementGuidelineValueOption
} from './types'
import {px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {nextTick, Ref, ref} from "vue";
import {GroupManager} from "@moveable/helper";
import {deepFlat, throttle} from "@daybrush/utils";
import {removeElement, setCurrentElement} from "@cp-print/design/utils/elementUtil";
import {defaultElement} from "@cp-print/design/constants/common";
import {arrayRemove} from "@cp-print/design/utils/arrays";
import Selecto, {OnDragStart as OnSelectDragStart, OnSelectEnd, OnSelect} from "selecto";
import Moveable from "moveable";
import {CpHtmlElement} from "@cp-print/design/types/entity";
// import {MoveableOptions} from "react-moveable";
let moveable: Moveable & MoveableOptions
let selecto: Selecto

export const snapElementList: Ref<Array<ElementGuidelineValueOption | MoveableRefType<CpHtmlElement>>> = ref([".design-content"])
export const elementList: Ref<Array<CpHtmlElement>> = ref([])
const bounds = {"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"} as BoundType;
export const tipsStatus = ref<'drag' | "resize" | 'rotate' | undefined>();
export const targets = ref([]) as Ref<Array<CpHtmlElement>>
const groupManager = new GroupManager([]);

export const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveableInner: MoveableManagerInterface, React: Renderer) {
        // console.log(React)
        const rect = moveableInner.getRect();
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

        const ss = React.createElement("div", {
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
        // console.log(ss)
        return ss
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

                    removeElement(moveableInner._dragTarget.element)
                    arrayRemove(targets.value, moveableInner._dragTarget)
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
};

const onRenderGroup = (e: any) => {
    // console.log(e)
    // console.log(e)
    e.events.forEach((ev: any) => {
        ev.target.style.cssText += ev.cssText;
    });
};

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
    console.log('onDragGroup', e)
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
    console.log('resize', e)
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

function bound(e: OnBound) {
    console.log('round', e)
    // e.target.style.transform = e.transform;
}

export const setSelectedTargets = (nextTargetes: any) => {
    console.log(nextTargetes)
    selecto.setSelectedTargets(deepFlat(nextTargetes));
    targets.value = nextTargetes;
    moveable.target = nextTargetes
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
    // moveable.elementGuidelines = snapElementList.value
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
        console.log(123)
        e.stop();
    }

    if (e.currentTarget.getSelectedTargets().length == 1) {
        console.log(333)
        const currentSelect = e.currentTarget.getSelectedTargets()[0] as CpHtmlElement
        if (currentSelect.element.type != 'PageFooter') {
            stop()
        }
    }

    console.log(e)
    // console.log(targets.value)
    // e.data.startTargets = targets.value;
    e.data.startTargets = targets.value;
}

const onSelect = (e: OnSelect) => {
    const {startAdded, startRemoved, isDragStartEnd} = e;
    if (isDragStartEnd) {
        return;
    }
    console.log(e.data.startTargets, startAdded, startRemoved)
    const nextChilds = groupManager.selectSameDepthChilds(
        e.data.startTargets,
        startAdded,
        startRemoved
    );
    const targetList = nextChilds.targets().filter((v: CpHtmlElement) => v.element.type != 'PageFooter')
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
    } = e;
    console.log('select-end')
    // console.log(e)
    for (let snapElement of removed) {
        snapElement.classList.add('snap')
    }
    for (let snapElement of added) {
        snapElement.classList.remove('snap')
    }

    // console.log(removed)
    if (isDragStartEnd) {
        inputEvent.preventDefault();
        // @ts-ignore
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
    const targetList = nextChilds.targets().filter((v: CpHtmlElement) => v.element.type != 'PageFooter')

    e.currentTarget.setSelectedTargets(targetList);
    // console.log(nextChilds.targets())
    setSelectedTargets(targetList);
};

export function initMoveable() {

    document.documentElement.style.setProperty('--direction-width', '20');
    document.documentElement.style.setProperty('--direction-height', '20');

    selecto = new Selecto({
        // The container to add a selection element
        container: document.querySelector('.affix-container') as HTMLElement,
        // Selecto's root container (No transformed container. (default: null)
        rootContainer: null,
        // The area to drag selection element (default: container)
        // dragContainer: Element,
        // Targets to select. You can register a queryselector or an Element.
        selectableTargets: [".design-select"],
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

    moveable = new Moveable(document.querySelector(".design-content") as HTMLElement, {
        target: targets.value,
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        // container: document.querySelector(".design-content") as HTMLElement,
        elementGuidelines: snapElementList.value,
        bounds: bounds,
        draggable: true,
        resizable: true,
        scalable: true,
        rotatable: true,
        snappable: true,
        // individualGroupable: true,
        // individualGroupableProps(element, index) {
        //     console.log(element, index)
        //     return {aa:123}
        // },
        snapGap: true,
        snapRotationDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
        ables: [DimensionViewable, Editable],
        props: ({dimensionViewable: tipsStatus != null, editable: true}),
        snapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),
        elementSnapDirections: ({top: true, left: true, bottom: true, right: true, center: true, middle: true}),
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
}
