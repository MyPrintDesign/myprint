import {IObject} from "@daybrush/utils";

export interface BoundType {
    /**
     * If position is css, right and bottom are calculated as css right and css bottom of container.
     * @default "client"
     */
    position?: "client" | "css";
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}

export interface OnBound {
    bounds: {
        left: boolean;
        top: boolean;
        right: boolean;
        bottom: boolean;
    };
    innerBounds: {
        left: boolean;
        top: boolean;
        right: boolean;
        bottom: boolean;
    };
}

export interface OnResizeEnd extends OnEndEvent {
}

export interface OnRotateEnd extends OnEndEvent { }


export interface OnRotateStart extends OnEvent, OnTransformStartEvent {
    /**
     * You can set the start rotate value.
     */
    set: (rotate: number) => void;
    /**
     * Set a fixed direction to rotate.
     * @default target's transformOrigin
     */
    setFixedDirection: (fixedDirection: number[]) => void;
    /**
     * Set a fixed position to rotate.
     * @default target's transformOrigin
     */
    setFixedPosition: (fixedPosition: number[]) => void;
    /**
     * rotate causes a `dragStart` event.
     */
    dragStart: OnDragStart | false;
    /**
     * rotate causes a `resizeStart` event.
     */
    resizeStart: OnResizeStart | false;
}

export interface OnRotate extends OnEvent, OnTransformEvent {
    /**
     * The distance of rotation degree before transform is applied
     */
    beforeDist: number;
    /**
     * The delta of rotation degree before transform is applied
     */
    beforeDelta: number;
    /**
     * The now rotation degree before transform is applied
     * @deprecated
     */
    beforeRotate: number;
    /**
     * The now rotation degree before transform is applied
     */
    beforeRotation: number;
    /**
     * The distance of rotation degree
     */
    dist: number;
    /**
     * The delta of rotation degree
     */
    delta: number;
    /**
     * The now rotation degree
     * @deprecated
     */
    rotate: number;
    /**
     * The now rotation degree
     */
    rotation: number;
    /**
     * The distance of client rotation degree
     */
    absoluteDist: number;
    /**
     * The delta of client rotation degree
     */
    absoluteDelta: number;
    /**
     * The now client rotation degree
     * @deprecated
     */
    absoluteRotate: number;
    /**
     * The now client rotation degree
     */
    absoluteRotation: number;
    /**
     * Whether or not it is being pinched.
     */
    isPinch: boolean;
    /**
     * rotate causes a `resize` event.
     */
    resize?: OnResize;
}

export interface OnRotateGroup extends OnRotate {
    /**
     * The rotating targets
     */
    targets: Array<HTMLElement | SVGElement>;
    /**
     * Each `rotate` event on the targets
     */
    events: OnRotate[];
    /**
     * You can set the group's rotation.
     * @deprecated
     */
    set: (rotation: number) => any;
    /**
     * You can set the group's rotation.
     */
    setGroupRotation: (rotation: number) => any;
}

export interface OnRoundGroup extends OnRound {
    /**
     * moveable's targets
     */
    targets: Array<HTMLElement | SVGElement>;
    /**
     * moveable's child events
     */
    events: OnRound[];
}


export interface OnRoundStart extends OnEvent { }

/**
 * @typedef
 * @memberof Moveable.Roundable
 * @extends Moveable.OnEvent
 * @extends Moveable.CSSObject
 * @property - Offset width of target
 * @property - Offset height of target
 * @property - The delta of [x, y]
 * @property - The distance of [x, y]
 * @property - The target's moved border-radius's horizontal poses
 * @property - The target's moved border-radius's vertical poses
 * @property - The target's moved border-radius
 */
export interface OnRound extends OnEvent, CSSObject {
    width: number;
    height: number;
    delta: number[];
    dist: number[];
    horizontals: number[];
    verticals: number[];
    borderRadius: string;

}

/**
 * @typedef
 * @memberof Moveable.Roundable
 * @extends Moveable.OnEndEvent
 */
export interface OnRoundEnd extends OnEndEvent {
}

export interface OnResizeGroup extends OnResize {
    targets: Array<HTMLElement | SVGElement>;
    events: OnResize[];
}

export interface OnDragGroup extends OnDrag {
    targets: Array<HTMLElement | SVGElement>;
    events: OnDrag[];
}

export interface TransformObject extends CSSObject {
    /**
     * a target's next transform string value.
     */
    transform: string;
    /**
     * A transform obtained by the simultaneous occurrence of other events in the current event
     */
    afterTransform: string;
}

export interface OnTransformEvent extends TransformObject {
    /**
     * transform events causes a `drag` event. In some events, there may be no value.
     */
    drag: OnDrag;
}

export interface OnResize extends OnEvent, OnTransformEvent {
    /**
     * The direction of resize.
     */
    direction: number[];
    /**
     * a target's cssWidth
     */
    width: number;
    /**
     * a target's cssHeight
     */
    height: number;
    /**
     * a target's offset width as an integer with bounding width
     */
    offsetWidth: number;
    /**
     * a target's offset height as an integer with bounding height
     */
    offsetHeight: number;
    /**
     * a target's bounding width
     */
    boundingWidth: number;
    /**
     * a target's bounding height
     */
    boundingHeight: number;
    /**
     * The distance of [boundingWidth, boundingHeight]
     */
    dist: number[];
    /**
     * The delta of [boundingWidth, boundingHeight]
     */
    delta: number[];
    /**
     * First set (boundingWidth / boundingHeight) value
     */
    startRatio: number;
    /**
     * Whether or not it is being pinched.
     */
    isPinch: boolean;
}

export interface OnResizeStart extends OnEvent {
    /**
     * The direction of resize.
     */
    direction: number[];
    /**
     * First set (boundingWidth / boundingHeight) value
     */
    startRatio: number;
    /**
     * resize causes a `dragStart` event.
     */
    dragStart: OnDragStart | false;
    /**
     * You can set the css width, height value.
     */
    set: (size: number[]) => any;
    /**
     * You can set the css min offset width, min offset height value.
     * @default [minOffsetWidth, minOffsetHeight])
     */
    setMin: (minSize: Array<string | number>) => any;
    /**
     * You can set the css max offset width, max offset height value.
     * @default [maxOffsetWidth, maxOffsetHeight])
     */
    setMax: (maxSize: Array<string | number>) => any;
    /**
     * You can set the css origin
     * @default transformOrigin
     */
    setOrigin: (origin: Array<string | number>) => any;
    /**
     * Set a fixed direction to resize.
     * @default Opposite direction
     */
    setFixedDirection: (startDirecition: number[]) => any;
    /**
     * Set a fixed direction to resize.
     * @default Opposite position
     * @private
     */
    setFixedPosition: (startPosition: number[]) => any;
    /**
     * Set the ratio of width and height.
     * @default offsetWidth / offsetHeight
     */
    setRatio: (ratio: number) => any;
}


export interface OnBeforeResize extends OnEvent {
    /**
     * Set a fixed direction to resize.
     * If fixedDirection is set, the boundingWidth and boundingHeight values can be changed and can be reconfirmed as a return value.
     */
    setFixedDirection: (startDirecition: number[]) => number[];
    /**
     * Set a fixed position to resize.
     * If fixedPosition is set, the boundingWidth and boundingHeight values can be changed and can be reconfirmed as a return value.
     * @private
     */
    setFixedPosition: (startPosition: number[]) => number[];
    /**
     * fixedDirection set by resizeStart.
     */
    startFixedDirection: number[];
    /**
     * fixedPosition set by resizeStart.
     * @private
     */
    startFixedPosition: number[];
    /**
     * Set the bounding size to resizing.
     */
    setSize: (size: number[]) => void;
    /**
     * a target's bounding width before snap and throttle and format
     */
    boundingWidth: number;
    /**
     * a target's bounding height before snap and throttle and format
     */
    boundingHeight: number;
}

export interface OnEndEvent extends OnEvent {
    lastEvent: any | undefined;
    isDrag: boolean;
    isDouble: boolean;
}

export interface CSSObject {
    /**
     * You can get the style you can get from the event.
     */
    style: Record<string, string>;
    /**
     * You can get it as a cssText that you can get from that event.
     */
    cssText: string;
}

/**
 * @typedef
 * @memberof Moveable.Draggable
 * @extends Moveable.OnEvent
 * @extends Moveable.CSSObject
 * @property - The delta of [left, top]
 * @property - The distance of [left, top]
 * @property - The position of [left, top]
 * @property - The delta of [translateX, translateY]
 * @property - The distance of [translateX, translateY]
 * @property - The position of [translateX, translateY]
 * @property - a target's transform
 * @property - a target's left
 * @property - a target's top
 * @property - a target's bottom
 * @property - a target's offset width
 * @property - a target's offset height
 * @property - a target's right
 * @property - Whether or not it is being pinched.
 */
export interface OnDrag extends OnEvent, CSSObject {
    beforeDelta: number[];
    beforeDist: number[];
    beforeTranslate: number[];
    delta: number[];
    dist: number[];
    translate: number[];
    transform: string;
    left: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    right: number;
    isPinch: boolean;
}
export interface OnDragEnd extends OnEndEvent {
}

export type Writable<T> = {
    -readonly [key in keyof T]: T[key];
};

export interface ScalableRequestParam extends AbleRequestParam {
    /**
     * Direction to scale
     * @default [1, 1]
     */
    direction?: number[];
    /**
     * Whether to force keepRatio to resize
     */
    keepRatio?: boolean;
    /**
     * delta number of width
     */
    deltaWidth?: number;
    /**
     * delta number of height
     */
    deltaHeight?: number;
    /**
     * whether to use with `snappable`
     */
    useSnap?: boolean;
}

export interface RotatableRequestParam extends AbleRequestParam {
    /**
     * delta number of rotation
     */
    deltaRotate?: number;
    /**
     * absolute number of moveable's rotation
     */
    rotate?: number;
}

export interface ResizableRequestParam extends AbleRequestParam {
    /**
     * Direction to resize
     * @default [1, 1]
     */
    direction?: number[];
    /**
     * Whether to force keepRatio to resize
     */
    keepRatio?: boolean;
    /**
     * delta number of width
     */
    deltaWidth?: number;
    /**
     * delta number of height
     */
    deltaHeight?: number;
    /**
     * offset number of width
     */
    offsetWidth?: number;
    /**
     * offset number of height
     */
    offsetHeight?: number;
    /**
     *
     */
    horizontal?: boolean;
    /**
     * whether to use with `snappable`
     */
    useSnap?: boolean;
}

export interface Requester<RequestParam extends {} = AbleRequestParam> {
    request(param: RequestParam): this;
    requestEnd(): this;
}

export interface Renderer {
    createElement(type: any, props?: any, ...children: any[]): any;
}

export interface RectInfo {
    /**
     * The coordinates of the vertex 1
     */
    pos1: number[];
    /**
     * The coordinates of the vertex 2
     */
    pos2: number[];
    /**
     * The coordinates of the vertex 3
     */
    pos3: number[];
    /**
     * The coordinates of the vertex 4
     */
    pos4: number[];
    /**
     * left position of the target relative to the container
     */
    left: number;
    /**
     * top position of the target relative to the container
     */
    top: number;
    /**
     * The width of moveable element
     */
    width: number;
    /**
     * The height of moveable element
     */
    height: number;
    /**
     * The offset width of the target
     */
    offsetWidth: number;
    /**
     * The offset height of the target
     */
    offsetHeight: number;
    /**
     * The absolute transform origin
     */
    origin: number[];
    /**
     * The absolute transform origin before transformation
     */
    beforeOrigin: number[];
    /**
     * The target transform origin
     */
    transformOrigin: number[];
    /**
     * you can get the absolute rotation value
     */
    rotation: number;
    /**
     * If you use a group, you can get child moveables' rect info
     */
    children?: RectInfo[];
}

export type PersistRectData = Omit<Partial<RectInfo>, "children"> & {
    children?: Array<Partial<RectInfo>>;
};


export interface PaddingBox {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}

export interface PaddingOptions {
    /**
     * Add padding around the target to increase the drag area.
     * @default null
     */
    padding?: PaddingBox | number;
}

export interface OriginOptions {
    /**
     * Whether or not the origin control box will be visible or not.
     * @default true
     */
    origin?: boolean;
    /**
     * Sets the transform origin based on the svg target. If not set, it is set as the transform origin based on the owner of svg.
     * @since 0.47.0
     * @default ""
     */
    svgOrigin?: string;
}

export interface MoveableRefObject<T extends Element = HTMLElement | SVGElement> {
    current: T | undefined | null;
}

export type MoveableRefType<T extends Element = HTMLElement | SVGElement>
    = string | (() => T) | MoveableRefObject<T> | T | null | undefined;

export interface MoveablePosition {
    left: number;
    top: number;
    right: number;
    bottom: number;
    origin: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    direction: 1 | -1;
}

export interface MoveableClientRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    clientLeft?: number;
    clientTop?: number;
    clientWidth?: number;
    clientHeight?: number;
    scrollWidth?: number;
    scrollHeight?: number;
    overflow?: boolean;
}

export interface MatrixInfo {
    type: "offset" | "target" | "zoom";
    target: SVGElement | HTMLElement;
    matrix?: number[];
    origin?: number[];
    zoom?: number;
}

export interface ElementSizes {
    svg: boolean;
    offsetWidth: number;
    offsetHeight: number;
    clientWidth: number;
    clientHeight: number;
    inlineCSSWidth: number;
    inlineCSSHeight: number;
    cssWidth: number;
    cssHeight: number;
    contentWidth: number;
    contentHeight: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    minOffsetWidth: number;
    minOffsetHeight: number;
    maxOffsetWidth: number;
    maxOffsetHeight: number;
}

export interface MoveableElementMatrixInfo {
    hasZoom: boolean;
    hasFixed: boolean;
    originalRootMatrix: number[];
    rootMatrix: number[];
    beforeMatrix: number[];
    offsetMatrix: number[];
    allMatrix: number[];
    targetMatrix: number[];
    transformOrigin: number[];
    targetOrigin: number[];
    is3d: boolean;
    targetTransform: string;
    inlineTransform: string;
    offsetContainer: HTMLElement | null;
    offsetRootContainer: HTMLElement | null;
    matrixes: MatrixInfo[];
}

export interface MoveableElementInfo extends MoveableElementMatrixInfo, MoveablePosition, ElementSizes {
    width: number;
    height: number;
    rotation: number;
}


export interface MoveableTargetInfo extends MoveableElementInfo {
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rootContainerClientRect: MoveableClientRect;
    beforeDirection: 1 | -1;
    beforeOrigin: number[];
    offsetDelta: number[],
    originalBeforeOrigin: number[];
    target: HTMLElement | SVGElement | null | undefined;
    style: Partial<Writable<CSSStyleDeclaration>>;
}

export type MoveableManagerState<T = {}> = {
    container: SVGElement | HTMLElement | null | undefined;
    disableNativeEvent: boolean;
    // gestos: Record<string, Gesto | CustomGesto | null>;
    renderLines: number[][][];
    renderPoses: number[][];
    posDelta: number[];
    style: Partial<Writable<CSSStyleDeclaration>>;
    isPersisted?: boolean;
} & MoveableTargetInfo & T;


export interface DragAreaOptions {
    /**
     * Instead of firing an event on the target, we add it to the moveable control element. You can use click and clickGroup events.
     * @default if group, true, else fals
     */
    dragArea?: boolean;
    /**
     * Set `pointerEvents: none;` css to pass events in dragArea.
     * @default false
     */
    passDragArea?: boolean;
}

export interface DefaultOptions {
    /**
     * The target(s) to indicate Moveable Control Box.
     * @default null
     */
    target?: SVGElement | HTMLElement | null;
    /**
     * The external target(s) to drag Moveable target(s)
     * @default target
     */
    dragTarget?: MoveableRefType | null;
    /**
     * If dragTarget is set directly, taget itself cannot be dragged.
     * Whether to drag the target as well.
     * @default false
     */
    dragTargetSelf?: boolean;
    /**
     * Container area where drag works
     * @default window
     */
    dragContainer?: null | Window | MoveableRefType<HTMLElement>;
    /**
     * A container into which Moveables are inserted.
     * Set it only when used within the slot of Web Components or when the container is different.
     * @default parentElement
     */
    container?: SVGElement | HTMLElement | null;
    /**
     * Whether to warp itself to the container itself. Don't set it.
     * @private
     * @default false
     */
    warpSelf?: boolean;
    /**
     * Moveable Root Container (No Transformed Container)
     * @default parentElement
     * @story options--options-root-container
     */
    rootContainer?: MoveableRefType<HTMLElement>;
    /**
     * If you want to set the dragging information to the viewer, refer to the following.
     * @default null
     * @story options--options-view-container
     */
    viewContainer?: MoveableRefType<HTMLElement>;
    /**
     * Whether the target size is detected and updated whenever it changes.
     * It is more effective when used together with `useMutationObserver`.
     * @default false
     * @story options--options-resize-observer
     */
    useResizeObserver?: boolean;
    /**
     * Whether the target size, pos in inline style is detected and updated whenever it changes.
     * It is more effective when used together with `useResizeObserver`.
     * @default false
     * @story options--options-mutation-observer
     */
    useMutationObserver?: boolean;
    /**
     * Zooms in the elements of a moveable.
     * @default 1
     */
    zoom?: number;
    /**
     * The default transformOrigin of the target can be set in advance.
     * @default ""
     */
    transformOrigin?: Array<string | number> | string | "";
    /**
     * You can add your custom able.
     * @default []
     */
    ables?: Able[];
    /**
     * You can specify the className of the moveable controlbox.
     * @default ""
     */
    className?: string;
    /**
     * Minimum distance to pinch.
     * @default 20
     */
    pinchThreshold?: number;
    /**
     * Whether the container containing the target becomes a pinch.
     * @default true
     */
    pinchOutside?: boolean;
    /**
     * Lets generate events of ables at the same time. (like Resizable, Scalable)
     * @default false
     */
    triggerAblesSimultaneously?: boolean;
    /**
     * Checks whether this is an element to input text or contentEditable, and prevents dragging.
     * @default false
     */
    checkInput?: boolean;
    /**
     * add nonce property to style for CSP.
     * @deprecated
     * @default ""
     */
    cspNonce?: string;
    /**
     * You can set the translateZ value of moveable.
     * @default 50
     */
    translateZ?: number | string;
    /**
     * Whether to hide the line corresponding to the rect of the target.
     * @default false
     */
    hideDefaultLines?: boolean;
    /**
     * Whether to prevent bubbling of events like mousedown, touchstart, etc.
     * @default false
     */
    stopPropagation?: boolean;
    /**
     * Whether to call preventDefault on touchstart or mousedown
     * @since 0.44.0
     * @default true
     */
    preventDefault?: boolean;
    /**
     * Whether to prevent dragging using the right mouse button
     * @default true
     */
    preventRightClick?: boolean;
    /**
     * Whether to prevent dragging using the wheel (middle) mouse button
     * @default true
     */
    preventWheelClick?: boolean;
    /**
     * Prevent click event on drag. (mousemove, touchmove)
     * @default true
     */
    preventClickEventOnDrag?: boolean;
    /**
     * Whether to drag the focused input
     * If `checkInput` is true, this option is not applied.
     * @since 0.47.0
     * @story options--options-drag-focused-input
     * @default false
     */
    dragFocusedInput?: boolean;
    /**
     * Prevent click event on dragStart. (mousedown, touchstart)
     * @default false
     */
    preventClickDefault?: boolean;
    /**
     * You can use props in object format or custom props.
     * @default empty object
     */
    props?: Record<string, any>;
    /**
     * Data for first render
     * @default null
     */
    persistData?: PersistRectData | null;
    /**
     * Whether to accurately show the position of a movable control box
     * Because getBoundingClientRect is used, css zoom, transform: rotate between container and rootContainer cannot be used.
     * group is not supported.
     * @default false
     */
    useAccuratePosition?: boolean;
    /**
     * By adding padding to the line, you can increase the area of the line that can be clicked and dragged.
     * @since 0.43.0
     * @story options--options-line-padding
     * @default 0
     */
    linePadding?: number;
    /**
     * By adding padding to the control, you can increase the area of the control that can be clicked and dragged.
     * Either `rotateAroundControls` or `displayAroundControls` can be used.
     * @since 0.44.0
     * @story options--options-control-padding
     * @default 0
     */
    controlPadding?: number;
    /**
     * @private
     * single => group로 변환과정에 도형 유지를 위한 첫 렌더링 state
     */
    firstRenderState?: MoveableManagerState | null;
    /**
     * @private
     */
    requestStyles?: string[];
    /**
     * If you are using React 18's concurrent mode, use `flushSync` for UI sync.
     * @default empty function
     * @example
     * ```jsx
     * import { flushSync } from "react-dom";
     *
     * <Moveable flushSync={flushSync} />
     * ```
     */
    flushSync?: (callback: () => void) => void;
}

export interface MoveableDefaultOptions
    extends DefaultOptions, DragAreaOptions, OriginOptions, PaddingOptions {
}

export type MoveableManagerProps<T = {}> = {
    cssStyled: any;
    customStyledMap: Record<string, any>;
    wrapperMoveable?: MoveableManagerInterface | null;
    isWrapperMounted?: boolean;
    parentMoveable?: MoveableManagerInterface | null;
    parentPosition?: number[] | null;
    groupable?: boolean;
} & MoveableDefaultOptions & (unknown extends T ? IObject<any> : T);

/**
 * @typedef
 * @memberof Moveable
 * @property - top position
 * @property - left position
 * @property - target's width
 * @property - target's height
 */
export interface HitRect {
    top: number;
    left: number;
    width?: number;
    height?: number;
}

export interface DraggableRequestParam extends AbleRequestParam {
    /**
     * x position
     */
    x?: number;
    /**
     * y position
     */
    y?: number;
    /**
     * X number to move
     */
    deltaX?: number;
    /**
     * Y number to move
     */
    deltaY?: number;
    /**
     * whether to use with `snappable`
     */
    useSnap?: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 */
export interface AbleRequestParam {
    /**
     * Run the request instantly. (requestStart, request, requestEnd happen at the same time)
     */
    isInstant?: boolean;
    [key: string]: any;
}
export interface AbleRequesters {
    draggable: DraggableRequestParam;
    resizable: ResizableRequestParam;
    scalable: ScalableRequestParam;
    rotatable: RotatableRequestParam;
    [key: string]: AbleRequestParam;
}

export interface Able<
    Props extends IObject<any> = IObject<any>,
    Events extends IObject<any> = IObject<any>
> {
    name: string;
    props?: readonly (keyof Props)[];
    events?: readonly (keyof Events)[];
    // Whether to always include in able. It is recommended to use always in frameworks other than react
    always?: boolean;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    css?: string[];
    /**
     * You can request style. Specify the name of the style in camel case.
     * You can check it with `moveable.state.style`
     * @exmaple
     * ["borderRadius", "top", "left"]
     */
    requestStyle?(): string[];
    /**
     * If you use group, you can request child style. Specify the name of the style in camel case.
     * You can check it with `moveable.state.style`
     * @exmaple
     * ["borderRadius", "top", "left"]
     */
    requestChildStyle?(): string[];
    /**
     * You can specify the class name to be added to the Moveable control box.
     */
    className?(moveable: any): string;
    /**
     * You can specify the class name to be added to the Moveable View Container
     */
    viewClassName?(moveable: any): string;
    /**
     * Check how related to drag
     */
    dragRelation?: "strong" | "weak" | undefined | null | false,
    /**
     * Fired when the event is cleared
     */
    unset?(moveable: any): any;
    /**
     * Renders the React DOM structure for the able.
     */
    render?(moveable: any, renderer: Renderer): any;

    // Operates when a drag event occurs for the single target.
    dragStart?(moveable: any, e: any): any;
    drag?(moveable: any, e: any): any;
    dragEnd?(moveable: any, e: any): any;
    dragAfter?(moveable: any, e: any): any;

    // Operates when a pinch event occurs for the single target.
    // pinchStart?(moveable: any, e: GestoTypes.OnPinchStart): any;
    // pinch?(moveable: any, e: GestoTypes.OnPinch): any;
    // pinchEnd?(moveable: any, e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragControl
    dragControlCondition?(moveable: any, e: any): boolean;
    // Operates when a drag event occurs for the moveable control and single target.
    dragControlStart?(moveable: any, e: any): any;
    dragControl?(moveable: any, e: any): any;
    dragControlEnd?(moveable: any, e: any): any;
    dragControlAfter?(moveable: any, e: any): any;

    // Condition that occurs dragGroup
    dragGroupCondition?(moveable: any, e: any): boolean;
    // Operates when a drag event occurs for the multi target.
    dragGroupStart?(moveable: any, e: any): any;
    dragGroup?(moveable: any, e: any): any;
    dragGroupEnd?(moveable: any, e: any): any;

    // Operates when a pinch event occurs for the multi target.
    // pinchGroupStart?(moveable: any, e: GestoTypes.OnPinchStart): any;
    // pinchGroup?(moveable: any, e: GestoTypes.OnPinch): any;
    // pinchGroupEnd?(moveable: any, e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragGroupControl
    dragGroupControlCondition?(moveable: any, e: any): boolean;

    // Operates when a drag event occurs for the moveable control and multi target.
    dragGroupControlStart?(moveable: any, e: any): any;
    dragGroupControl?(moveable: any, e: any): any;
    dragGroupControlEnd?(moveable: any, e: any): any;

    // mouse enter event
    mouseEnter?(moveable: any, e: any): any;
    // mouse leave event
    mouseLeave?(moveable: any, e: any): any;

    // mouse enter event for group
    mouseGroupEnter?(moveable: any, e: any): any;
    // mouse leave event for group
    mouseGroupLeave?(moveable: any, e: any): any;


    // Execute the operation of able for external request
    request?(moveable: any): AbleRequester;
}

export interface AbleRequester {
    isControl: boolean;
    requestStart(param: IObject<any>): IObject<any>;
    request(param: IObject<any>): IObject<any>;
    requestEnd(): IObject<any>;
}

export interface MoveableInterface {
    getManager(): MoveableManagerInterface<any, any>;
    getRect(): RectInfo;
    getAble<T extends Able>(ableName: string): T | undefined;
    isMoveableElement(target: Element): boolean;
    /**
     * If the location or size of the target is changed, call the `.updateRect()` method.
     * Use the `useResizeObserver` and `useMutationObserver` props to update automatically.
     */
    updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState?: boolean): void;
    /**
     * @deprecated
     * Use `.updateRect()` method
     */
    updateTarget(): void;
    /**
     * Request able through a method rather than an event.
     * At the moment of execution, requestStart is executed,
     * and then request and requestEnd can be executed through Requester.
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html#request Draggable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html#request Resizable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html#request Scalable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html#request Rotatable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.OriginDraggable.html#request OriginDraggable Requester}
     * @param - ableName
     * @param - request to be able params.
     * @param - If isInstant is true, request and requestEnd are executed immediately.
     * @return - Able Requester. If there is no request in able, nothing will work.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("draggable", { deltaX: 10, deltaY: 10 }, true);
     *
     * // Start move
     * const requester = moveable.request("draggable");
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.requestEnd();
     */
    request<
        RequestParam extends AbleRequesters[Name],
        Name extends string = string,
    >(ableName: Name, params?: RequestParam, isInstant?: boolean): Requester<RequestParam>;
    /**
     * moveable is the top level that manages targets
     * `Single`: MoveableManager instance
     * `Group`: MoveableGroup instance
     * `IndividualGroup`: MoveableIndividaulGroup instance
     * Returns leaf target MoveableManagers.
     */
    getMoveables(): MoveableManagerInterface[];
    /**
     * Returns the element of the control box.
     */
    getControlBoxElement(): HTMLElement;
    /**
     * Target element to be dragged in moveable
     */
    getDragElement(): HTMLElement | SVGElement | null | undefined;
    destroy(): void;
    dragStart(e: MouseEvent | TouchEvent, target?: EventTarget | null): void;
    isInside(clientX: number, clientY: number): boolean;
    isDragging(ableName?: string): boolean;
    hitTest(el: Element | HitRect): number;
    setState(state: any, callback?: () => any): any;
    waitToChangeTarget(): Promise<void>;
    forceUpdate(callback?: () => any): any;
    updateSelectors(): void;
    getTargets(): Array<HTMLElement | SVGElement>;
    stopDrag(type?: "target" | "control"): void;
}


export interface MoveableManagerInterface<T = {}, U = {}> extends MoveableInterface {
    moveables?: MoveableManagerInterface[];
    props: MoveableManagerProps<T>;
    state: MoveableManagerState<U>;
    renderState: Record<string, any>;
    rotation: number;
    scale: number[];
    enabledAbles: Able[];
    controlAbles: Able[];
    targetAbles: Able[];
    areaElement: HTMLElement;
    controlBox: HTMLElement,
    isUnmounted: boolean;
    useCSS(tag: string, css: string): any;
    getContainer(): HTMLElement | SVGElement;
    getRotation(): number;
    getState(): MoveableManagerState<U>;
    triggerEvent(name: string, params: IObject<any>, isManager?: boolean): any;
}

export interface OnTransformStartEvent {
    /**
     * Set your original transform.
     * `transformIndex` is the sequence of functions used in the event.
     * If you use `setTransform`, you don't need to use `set` function.
     * @default transform of target's inline style
     */
    setTransform(transform: string | string[], transformIndex?: number): void;
    /**
     * `transformIndex` is the sequence of functions used in the event.
     * @default index with that property in transform or last
     */
    setTransformIndex(transformIndex: number): void;
}

export interface OnEvent {
    /**
     * The Moveable instance
     */
    currentTarget: MoveableManagerInterface<Record<string, any>, Record<string, any>>;
    /**
     * The Moveable instance
     */
    moveable: MoveableManagerInterface<Record<string, any>, Record<string, any>>;
    /**
     * The Moveable's target
     */
    target: HTMLElement | SVGElement;
    /**
     * The horizontal coordinate within the application's client area at which the event occurred.
     */
    clientX: number;
    /**
     * The vertical coordinate within the application's client area at which the event occurred.
     */
    clientY: number;
    /**
     * Whether this is the first drag in the drag event
     */
    isFirstDrag: number;
    /**
     * Objects that can send information to the following events.
     */
    datas: IObject<any>;
    /**
     * The mouse or touch input event that is invoking the moveable event
     */
    inputEvent: any;
    /**
     * Stop the currently working able.
     */
    stopAble(): void;
    /**
     * Calling `stopDrag` in a drag-related event ends the drag.
     */
    stopDrag(): void;
    /**
     * Whether the event did not occur externally
     */
    isTrusted: boolean;

}

export interface OnDragStart extends OnEvent, OnTransformStartEvent {
    /**
     * You can set the start translate value.
     */
    set: (translate: number[]) => void;
}
