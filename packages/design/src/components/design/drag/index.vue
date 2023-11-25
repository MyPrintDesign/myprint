<template>
  <div
      ref="dRef"
      :style="style"
      :class="[
      {
        'pointer-events': pointerEvent,
        [classNameActive]: ['SELECT', 'HANDLE'].includes(element.status),
        [classNameDragging]: datatmp.dragging,
        [classNameResizing]: datatmp.resizing,
        [classNameRotating]: datatmp.rotating
      },
      className
    ]"
      @mousedown.stop.prevent="elementMouseDown"
  >
    
    <slot></slot>
    
    <div class="select" :class="{realSelect: (['SELECT', 'HANDLE'].includes(element.status))}"
         :style="{width: valueUnit(element.width) , height: valueUnit(element.height)}"/>
    
    <template v-if="!element.lock && element.status == 'HANDLE'">
      <div class="rotate cursor-ew-rotate" v-if="handles.includes('rot')"
           @mousedown.stop.prevent="handleDown({id:'rot'}, $event)"></div>
      
      <div class="handle"
           :key="item.id" v-for="(item) in handleList"
           :class="rotateCursorStyle(item)"
           :style="{left : item.x, top : item.y,
           visibility: (item.width < 3 || item.height < 3) ?'hidden': 'visible',
         width: item.width + 'px',
         height: item.height + 'px'
         }"
           @mousedown.stop.prevent="handleDown(item, $event)"
      />
    </template>
    <el-icon
        @mousedown="click($event, ()=>mitt.emit('elementRemove', props.element))"
        v-if="!element.lock && ['SELECT_REMOVE', 'HANDLE'].includes(element.status)"
        :style="{left : (unit2px(element.width)+5)+'px', top : '-15px', cursor: ''}"
        class="remove">
      <CircleCloseFilled/>
    </el-icon>
    
    <div class="center" :class="{realSelect: (['SELECT', 'HANDLE'].includes(element.status))}"></div>
    
    <Teleport to="body">
      <div class="mouseTips" :style="{
        left: (mouseTips.x+20)+'px',
        top: (mouseTips.y+20)+'px',
      }" v-if="mouseTips.move">{{ mouseTips.data }}
      </div>
    </Teleport>
  
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus'
import {matchesSelectorToParentElements, addEvent, removeEvent, mouseEventType} from "@cp-print/design/utils/dom";
import {restrictToBounds, snapToGrid} from "@cp-print/design/utils/fns";
import {onMounted, computed, ref, reactive, watch, onBeforeUnmount, inject, PropType, CSSProperties} from "vue";
import {Element, Position} from "@cp-print/design/types/entity";
import {click, to} from "@cp-print/design/utils/utils";
import {unit2px, px2unit} from "@cp-print/design/utils/devicePixelRatio";
import {_default, _defaultNum} from "@cp-print/design/utils/numberUtil";
import {mittKey, panelKey} from "@cp-print/design/constants/keys";
import {
  computeTranslate,
  disableHandleList,
  getTranslate,
  valueUnit,
  rotatedPoint,
  getAngle, panelDivPosition, dragLimit, getMouseOffsetTop, getMouseOffsetBottom
} from "@cp-print/design/utils/elementUtil";
import {computedAlign} from "@cp-print/design/utils/alignUtil";
import {useConfigStore} from "@cp-print/design/stores/config";
import {handleConstants, cursorStyleArray, handleConstantsType} from "@cp-print/design/constants/common";
import {dragDataStore} from "@cp-print/design/stores/dragStore";
import {CircleCloseFilled} from "@element-plus/icons-vue";
import {ActionEnum, record, Snapshot} from "@cp-print/design/utils/historyUtil";

const {data: dragData} = dragDataStore()

const $emit = defineEmits(["activated",
  "deactivated",
  "update:active",
  "rotating",
  "dragging",
  "resizing",
  "refLineParams",
  "resizestop",
  "dragstop",
  "rotatestop"])

const panel = inject(panelKey)
const mitt = inject(mittKey)
const mouseTips = reactive({x: 0, y: 0, handle: null, move: false, data: null})

const dRef = ref()
const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)},
  className: {
    type: String,
    default: "vdr"
  },
  classNameDraggable: {
    type: String,
    default: "draggable"
  },
  classNameResizable: {
    type: String,
    default: "resizable"
  },
  classNameDragging: {
    type: String,
    default: "dragging"
  },
  classNameResizing: {
    type: String,
    default: "resizing"
  },
  // 新增组件处于旋转时的自定义类名
  classNameRotating: {
    type: String,
    default: "rotating"
  },
  classNameActive: {
    type: String,
    default: "active"
  },
  classNameHandle: {
    type: String,
    default: "handle"
  },
  preventDeactivation: {
    type: Boolean,
    default: false
  },
  
  // 新增 旋转 默认为false 不开启
  drag: {
    type: Boolean,
    default: true
  },
  minWidth: {
    type: Number,
    default: 0,
    validator: (val: number) => val >= 0
  },
  minHeight: {
    type: Number,
    default: 0,
    validator: (val: number) => val >= 0
  },
  maxWidth: {
    type: Number,
    default: Infinity,
    validator: (val: number) => val >= 0
  },
  maxHeight: {
    type: Number,
    default: Infinity,
    validator: (val: number) => val >= 0
  },
  z: {
    type: [String, Number],
    default: "auto",
    validator: (val: number) => (typeof val === "string" ? val === "auto" : val >= 0)
  },
  // 新增 旋转手柄 rot
  handles: {
    type: Array<handleConstantsType>,
    default: () => ["tl", "tm", "tr", "rm", "br", "bm", "bl", "lm", "rot"]
  },
  dragHandle: {
    type: String,
    default: null
  },
  dragCancel: {
    type: String,
    default: null
  },
  axis: {
    type: String,
    default: "both",
    validator: (val: string) => ["x", "y", "both"].includes(val)
  },
  grid: {
    type: Array<number>,
    default: () => [1, 1]
  },
  parent: {
    type: [Boolean, String],
    default: false
  },
  onDragStart: {
    type: Function,
    default: () => true
  },
  onDrag: {
    type: Function,
    default: () => true
  },
  onResizeStart: {
    type: Function,
    default: () => true
  },
  onResize: {
    type: Function,
    default: () => true
  },
  // 新增 回调事件
  onRotateStart: {
    type: Function,
    default: () => true
  },
  onRotate: {
    type: Function,
    default: () => true
  },
  // 冲突检测
  isConflictCheck: {
    type: Boolean,
    default: false
  },
  // 元素对齐
  snap: {
    type: Boolean,
    default: false
  },
  // 新增 是否对齐容器边界
  snapBorder: {
    type: Boolean,
    default: false
  },
  // 当调用对齐时，用来设置组件与组件之间的对齐距离，以像素为单位
  snapTolerance: {
    type: Number,
    default: 20,
    validator: function (val) {
      return typeof val === "number";
    }
  },
  // 缩放比例
  scaleRatio: {
    type: Number,
    default: 1,
    validator: val => typeof val === "number"
  },
  // handle是否缩放
  handleInfo: {
    type: Object,
    default: () => {
      return {
        size: 8,
        offset: -4,
        switch: true
      };
    }
  }
})

const mouseClickPosition = ref(
    {
      mouseX: 0,
      mouseY: 0,
      width: 0,
      height: 0,
    }
)
const containerBounds = ref({
  left: null,
  right: null,
  top: null,
  bottom: null
} as Position)
const datatmp = reactive({
  left: props.element.x,
  top: props.element.y,
  scale: 1,
  right: null,
  bottom: null,
  // 新增旋转角度
  width: null,
  height: null,
  widthTouched: false,
  heightTouched: false,
  // 纵横比变量
  aspectFactor: null,
  // 容器的大小
  parentWidth: null,
  parentHeight: null,
  // 设置最小和最大尺寸
  minW: props.minWidth,
  minH: props.minHeight,
  maxW: props.maxWidth,
  maxH: props.maxHeight,
  // 定义控制手柄
  resizing: false,
  dragging: false,
  // 新增 表明组件是否正处于旋转状态
  rotating: false,
  zIndex: props.z,
  // 新增 保存中心点位置，用于计算旋转的方向矢量
  lastCenterX: 0,
  lastCenterY: 0,
  // 父元素左上角的坐标值
  parentX: 0,
  parentY: 0
})
const disableHandleConstList = disableHandleList(props.element);
const {setCursor} = useConfigStore()

const handleList = reactive([])

function rotateCursorStyle(item) {
  const STEP = 45;
  const rotate = _default(props.element.option.rotate, 0) + STEP / 2;
  const deltaIndex = Math.floor(rotate / STEP);
  let index = handleList.find(v => v.id === item.id).index
  index = (index + deltaIndex) % 8;
  // console.log(item)
  return item.class + ' cursor-' + cursorStyleArray[index];
}

const style = computed(() => {
  const _style = {
    width: valueUnit(props.element.width),
    height: valueUnit(props.element.height),
    left: valueUnit(props.element.x),
    top: valueUnit(props.element.y),
    zIndex: datatmp.zIndex
  } as CSSProperties;
  
  datatmp.width = unit2px(props.element.width)
  datatmp.height = unit2px(props.element.height)
  
  // console.log(props.element.translateX)
  _style.transform = getTranslate(props.element)
  return _style
})

onMounted(() => {
  for (let handle of props.handles) {
    if (handle === 'rot') continue
    // console.log(handle)
    // console.log(mapStick2Index[handle])
    handleList.push(to(handleConstants[handle], {}))
  }
  
  updateHandle(props.element.width, props.element.height)
  
  // 监听取消操作
  // addEvent(document.documentElement, "mousedown", deselect);
  // addEvent(document.documentElement, "touchend touchcancel", deselect);
  //  窗口变化时，检查容器大小
  // addEvent(window, "resize", checkParentSize);
})

onBeforeUnmount(() => {
  // removeEvent(document.documentElement, "mousedown", deselect);
  removeEvent(document.documentElement, "mousemove", move);
  removeEvent(document.documentElement, "mouseup", handleUp);
  // removeEvent(window, "resize", checkParentSize);
})

function elementMouseDown(e) {
  elementDown(e);
}

// 元素按下
function elementDown(e) {
  if (e instanceof MouseEvent && e.which !== 1) {
    return;
  }
  const target = e.target || e.srcElement;
  if (!dRef.value.contains(target)) {
    return;
  }
  if (
      (props.dragHandle && !matchesSelectorToParentElements(target, props.dragHandle, dRef.value)) ||
      (props.dragCancel && matchesSelectorToParentElements(target, props.dragCancel, dRef.value))
  ) {
    datatmp.dragging = false;
    return;
  }
  rotatedPoint(props.element)
  
  //  按下鼠标表示保存当前状态
  mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
  mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
  containerBounds.value = calcDragLimits();
  
  // console.log(JSON.stringify(containerBounds))
  
  addEvent(document.documentElement, mouseEventType.MOVE, move);
  addEvent(document.documentElement, mouseEventType.UP, handleUp);
}


// 控制柄按下
function handleDown(handle, e) {
  if (e instanceof MouseEvent && e.which !== 1) {
    return false;
  }
  if (props.onResizeStart(handle, e) === false) {
    return false;
  }
  // 新增旋转手柄
  mouseTips.handle = handle.id
  
  let {left, top, width: width1, height: height1} = dRef.value.getBoundingClientRect();
  props.element.runtimeOption.left = left
  // console.log(props.element.runtimeOption.left)
  props.element.runtimeOption.top = top
  props.element.runtimeOption.width = width1
  props.element.runtimeOption.height = height1
  props.element.runtimeOption.centerX = window.pageXOffset + props.element.runtimeOption.left + props.element.runtimeOption.width / 2;
  props.element.runtimeOption.centerY = window.pageYOffset + props.element.runtimeOption.top + props.element.runtimeOption.height / 2;
  
  //  保存鼠标按下时的当前状态
  mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
  mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
  mouseClickPosition.value.width = props.element.width
  mouseClickPosition.value.height = props.element.height;
  // 计算边界
  // bounds.value = calcResizeLimits();
  containerBounds.value = calcDragLimits();
  
  // 添加事件
  addEvent(document.documentElement, mouseEventType.MOVE, move);
  addEvent(document.documentElement, mouseEventType.UP, handleUp);
  e.stopPropagation();
  return true
}

// 计算调整大小范围
function calcResizeLimits() {
  let minW = datatmp.minW;
  let minH = datatmp.minH;
  let maxW = datatmp.maxW;
  let maxH = datatmp.maxH;
  const [gridX, gridY] = props.grid;
  // 获取矩形信息
  const width = datatmp.width;
  const height = datatmp.height;
  const left = datatmp.left;
  const top = datatmp.top;
  const right = datatmp.right;
  const bottom = datatmp.bottom;
  // 对齐网格
  maxW = maxW - (maxW % gridX);
  maxH = maxH - (maxH % gridY);
  const limits = {
    minLeft: null,
    maxLeft: null,
    minTop: null,
    maxTop: null,
    minRight: null,
    maxRight: null,
    minBottom: null,
    maxBottom: null
  };
  // 边界限制
  if (props.parent) {
    limits.minLeft = left;
    limits.maxLeft = left + Math.floor((width - minW) / gridX);
    limits.minTop = top;
    limits.maxTop = top + Math.floor((height - minH) / gridY);
    limits.minRight = right;
    limits.maxRight = right + Math.floor((width - minW) / gridX);
    limits.minBottom = bottom;
    limits.maxBottom = bottom + Math.floor((height - minH) / gridY);
    if (maxW) {
      limits.minLeft = Math.max(limits.minLeft, datatmp.parentWidth - right - maxW);
      limits.minRight = Math.max(limits.minRight, datatmp.parentWidth - left - maxW);
    }
    if (maxH) {
      limits.minTop = Math.max(limits.minTop, datatmp.parentHeight - bottom - maxH);
      limits.minBottom = Math.max(limits.minBottom, datatmp.parentHeight - top - maxH);
    }
  } else {
    limits.minLeft = null;
    limits.maxLeft = left + Math.floor(width - minW);
    limits.minTop = null;
    limits.maxTop = top + Math.floor(height - minH);
    limits.minRight = null;
    limits.maxRight = right + Math.floor(width - minW);
    limits.minBottom = null;
    limits.maxBottom = bottom + Math.floor(height - minH);
    if (maxW) {
      limits.minLeft = -(right + maxW);
      limits.minRight = -(left + maxW);
    }
    if (maxH) {
      limits.minTop = -(bottom + maxH);
      limits.minBottom = -(top + maxH);
    }
    if (props.element.option.aspectRatio && maxW && maxH) {
      limits.minLeft = Math.min(limits.minLeft, -(right + maxW));
      limits.minTop = Math.min(limits.minTop, -(maxH + bottom));
      limits.minRight = Math.min(limits.minRight, -left - maxW);
      limits.minBottom = Math.min(limits.minBottom, -top - maxH);
    }
  }
  return limits;
}

// 移动
function move(e) {
  mouseTips.move = true
  if (mouseTips.handle == null) {
    if (!props.drag) {
      return
    }
    if (props.onDragStart != null) {
      props.onDragStart()
    }
    handleDrag(e);
    mouseTips.data = `(${(props.element.x + props.element.translateX).toFixed(0)}, ${(props.element.y + props.element.translateX).toFixed(0)})`;
  } else if (mouseTips.handle == 'rot') {
    setCursor('cursor-ew-rotate')
    handleRotate(e);
    mouseTips.data = props.element.option.rotate + '°';
  } else {
    setCursor(rotateCursorStyle(handleConstants[mouseTips.handle]))
    handleResize(e);
    mouseTips.data = `(${props.element.width.toFixed(0)}*${props.element.height.toFixed(0)})`;
  }
  mouseTips.x = e.pageX
  mouseTips.y = e.pageY
  e.stopPropagation();
  mitt.emit('elementMove', props.element)
  return true;
}

// 获取鼠标或者触摸点的坐标
function getMouseCoordinate(e) {
  if (e.type.indexOf("touch") !== -1) {
    return {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
  } else {
    return {
      x: e.pageX || e.clientX + document.documentElement.scrollLeft,
      y: e.pageY || e.clientY + document.documentElement.scrollTop
    };
  }
}

function handleRotate(e) {
  // 获取方向向量，得到旋转角度
  const {x: mouseX, y: mouseY} = getMouseCoordinate(e);
  const x = mouseX - props.element.runtimeOption.centerX;
  const y = mouseY - props.element.runtimeOption.centerY;
  props.element.option.rotate = (getAngle(x, y) + 90) % 360;
  
  $emit("rotating", props.element.option.rotate);
  // 元素移动
}

// 元素移动
async function handleDrag(e) {
  const axis = props.axis;
  const grid = props.grid;
  // 水平移动
  const tmpDeltaX =
      axis && axis !== "y" ? mouseClickPosition.value.mouseX - (e.pageX) : 0;
  // 垂直移动
  const tmpDeltaY =
      axis && axis !== "x" ? mouseClickPosition.value.mouseY - (e.pageY) : 0;
  // const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, props.scaleRatio);
  const left = restrictToBounds(-px2unit(tmpDeltaX), containerBounds.value.left, containerBounds.value.right);
  const top = restrictToBounds(-px2unit(tmpDeltaY), containerBounds.value.top, containerBounds.value.bottom);
  // console.log(left)
  // const right = restrictToBounds(-px2mm(deltaX), bounds.value.minRight, bounds.value.maxRight);
  // const bottom = restrictToBounds(-px2mm(deltaY), bounds.value.minBottom, bounds.value.maxBottom);
  
  // console.log(left)
  
  // datatmp.left = mm2px(props.element.translateX + props.element.x)
  // datatmp.top = mm2px(props.element.translateY + props.element.y)
  props.element.translateX = left
  props.element.translateY = top
  // datatmp.right = right;
  // datatmp.bottom = bottom;
  
  if (configStore.settingDesign.autoAlign) {
    computedAlign(props.element, ref([]), panel.elementList)
  }
  // $emit("dragging", datatmp.left, datatmp.top);
}

const configStore = useConfigStore()

// 计算移动范围
function calcDragLimits(): Position {
  return dragLimit(props.element)
}

// 控制柄移动
function handleResize(e) {
  const scaleRatio = props.scaleRatio;
  const {TL, TR, BL, BR} = props.element.runtimeOption;
  let {x: mouseX, y: mouseY} = getMouseCoordinate(e);
  
  // console.log(mouseX)
  // 在非旋转且有父容器限制的时候，直接限制mouse参与计算的坐标值
  // mouseX = restrictToBounds(mouseX, 0, mm2px(panel.width));
  // mouseY = restrictToBounds(mouseY, 0, mm2px(panel.height));
  // console.log(mouseX, panelDivPosition.left, panelDivPosition.right)
  mouseX = restrictToBounds(mouseX, panelDivPosition.left, panelDivPosition.right);
  const top = getMouseOffsetTop(panel, props.element)
  const bottom = getMouseOffsetBottom(panel, props.element)
  // console.log(mm2px(panel.pageHeader?.height))
  mouseY = restrictToBounds(mouseY, top, bottom);
  
  // todo 宽高比例可能要在这里改
  // console.log(mouseY)
  
  // 获取鼠标移动的坐标差
  let deltaX = px2unit(mouseX - mouseClickPosition.value.mouseX);
  let deltaY = px2unit(mouseY - mouseClickPosition.value.mouseY);
  
  if (props.element.option.aspectRatio) {
    // console.log(deltaX, props.element.option.aspectRatio)
    deltaY = deltaX / props.element.option.aspectRatio;
  }
  // console.log(deltaX, containerBounds.value.left)
  // console.log(deltaX, containerBounds.value.left)
  
  // 考虑放缩
  deltaX = deltaX / scaleRatio;
  deltaY = deltaY / scaleRatio;
  let diffX, diffY, scale, scaleB, scaleC, newX, newY, newW, newH;
  let Fixed = {} as Position; // 固定点
  let BX = {} as Position; // 高度边选点
  let CX = {} as Position; //  宽度边选点
  let Va = {} as Position; // 固定点到鼠标 向量
  let Vb = {} as Position; // 固定点到投影边  向量
  let Vc = {} as Position; // 另一边投影
  let Vw = {} as Position; // 宽度向量
  let Vh = {} as Position; // 高度向量
  // 拖动中点
  if (mouseTips.handle.includes("m")) {
    switch (mouseTips.handle) {
      case "tm":
        diffX = deltaX + (TL.x + TR.x) / 2;
        diffY = deltaY + (TL.y + TR.y) / 2;
        Fixed = BL;
        BX = TL;
        CX = BR;
        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};
        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};
        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));
        Vw = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};
        Vh = {x: Vb.x * scale, y: Vb.y * scale};
        break;
      case "bm":
        diffX = deltaX + (BL.x + BR.x) / 2;
        diffY = deltaY + (BL.y + BR.y) / 2;
        Fixed = TL;
        BX = BL;
        CX = TR;
        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};
        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};
        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));
        Vw = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};
        Vh = {x: Vb.x * scale, y: Vb.y * scale};
        break;
      case "lm":
        diffX = deltaX + (TL.x + BL.x) / 2;
        diffY = deltaY + (TL.y + BL.y) / 2;
        Fixed = BR;
        BX = BL;
        CX = TR;
        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};
        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};
        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));
        Vh = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};
        Vw = {x: Vb.x * scale, y: Vb.y * scale};
        break;
      case "rm":
        diffX = deltaX + (TR.x + TR.x) / 2;
        diffY = deltaY + (TR.y + TR.y) / 2;
        Fixed = BL;
        BX = BR;
        CX = TL;
        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};
        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};
        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));
        Vh = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};
        Vw = {x: Vb.x * scale, y: Vb.y * scale};
        break;
      default:
        break;
    }
    // 反推宽高
    newX = Fixed.x + (Vw.x + Vh.x) / 2;
    newY = Fixed.y + (Vw.y + Vh.y) / 2;
    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2));
    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2));
  } else {
    // 拖动顶点
    switch (mouseTips.handle) {
      case "tl":
        diffX = deltaX + TL.x;
        diffY = deltaY + TL.y;
        Fixed = BR;
        BX = BL; // 高度 TL BL
        CX = TR; // 宽度 TL TR
        break;
      case "tr":
        diffX = deltaX + TR.x;
        diffY = deltaY + TR.y;
        Fixed = BL;
        BX = BR;
        CX = TL;
        break;
      case "bl":
        diffX = deltaX + BL.x;
        diffY = deltaY + BL.y;
        Fixed = TR;
        BX = TL;
        CX = BR;
        break;
      case "br":
        diffX = deltaX + BR.x;
        diffY = deltaY + BR.y;
        Fixed = TL;
        BX = TR;
        CX = BL;
        break;
      default:
        break;
    }
    
    Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};
    Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};
    Vc = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};
    scaleB = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));
    scaleC = (Va.x * Vc.x + Va.y * Vc.y) / (Math.pow(Vc.x, 2) + Math.pow(Vc.y, 2));
    Vw = {x: Vb.x * scaleB, y: Vb.y * scaleB};
    Vh = {x: Vc.x * scaleC, y: Vc.y * scaleC};
    // 反推宽高
    newX = Fixed.x + (Vw.x + Vh.x) / 2;
    newY = Fixed.y + (Vw.y + Vh.y) / 2;
    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2));
    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2));
  }
  
  
  props.element.translateX = newX - newW / 2 - props.element.x;
  props.element.translateY = newY - newH / 2 - props.element.y;
  
  // console.log(panel.height - (props.element.y))
  // newW = restrictToBounds(newW, 0, panel.width - (props.element.x));
  // newH = restrictToBounds(newH, 0, panel.height - (props.element.y));
  
  props.element.width = newW;
  props.element.height = newH;
}

// 从控制柄松开
async function handleUp(_e) {
  // 初始化辅助线数据
  setCursor(null)
  
  // 保存 鼠标松开的坐标
  removeEvent(document.documentElement, mouseEventType.MOVE, move);
  removeEvent(document.documentElement, mouseEventType.UP, handleUp);
  
  // rotatedPoint(props.element)
  // 是否是移动还是
  // console.log(mouseTips.handle)
  const handle = mouseTips.handle
  mouseTips.move = false
  mouseTips.handle = null
  
  if (!props.element.translateX && !props.element.translateY) {
    mitt.emit('elementClick', props.element)
    return
  }
  
  if (handle == null) {
    record(<Snapshot>{element: props.element, action: ActionEnum.MOVE})
  } else if (handle == 'rot') {
    record(<Snapshot>{element: props.element, action: ActionEnum.ROTATE})
  } else {
    record(<Snapshot>{element: props.element, action: ActionEnum.RESIZE})
  }
  
  mitt.emit('elementUp')
  
  // computeTranslate(props.element)
  
}

function updateHandle(width: number, height: number) {
  const horizontal = {width: 20, height: 3}
  const vertical = {width: 3, height: 20}
  const block = {width: 20, height: 20}
  const tmpHeight = unit2px(height)
  const tmpWidth = unit2px(width)
  
  if (tmpHeight < 60) {
    block.height = tmpHeight - 41
    block.width = tmpHeight - 41
    if (tmpHeight < 30) {
      if (["DottedHorizontalLine", "HorizontalLine"].includes(props.element.type)) {
        vertical.height = Math.min(20, tmpHeight)
      } else {
        vertical.height = tmpHeight - 11
      }
    }
  }
  
  if (tmpWidth < 60) {
    block.height = tmpWidth - 41
    block.width = tmpWidth - 41
    if (tmpWidth < 30) {
      if (["DottedVerticalLine", "VerticalLine"].includes(props.element.type)) {
        horizontal.width = Math.min(20, tmpWidth)
      } else {
        horizontal.width = tmpWidth - 11
      }
    }
  }
  
  for (let i = 0; i < handleList.length; i++) {
    let han = handleList[i]
    if (!han) {
      continue
    }
    if (!disableHandleConstList?.includes(han.id)) {
      let tmp = block
      switch (han.id) {
        case 'tm':
          tmp = horizontal
          han.x = `calc(50% - ${tmp.width / 2}px)`
          break
        case 'lm':
          tmp = vertical
          han.y = `calc(50% - ${tmp.height / 2}px)`
          break
        case 'bm':
          tmp = horizontal
          han.x = `calc(50% - ${tmp.width / 2}px)`
          break
        case 'rm':
          tmp = vertical
          han.y = `calc(50% - ${tmp.height / 2}px)`
          break
      }
      
      han.width = tmp.width
      han.height = tmp.height
      
      if (han.id.indexOf('m') <= 0) {
        han.width = Math.max(han.width, 3)
        han.height = Math.max(han.height, 3)
      }
    }
  }
}

const pointerEvent = computed(() => {
  return dragData.dragIng && !['PageHeader', 'PageFooter'].includes(props.element.type)
})

watch([() => props.element.width, () => props.element.height], ([width, height]) => {
  updateHandle(width, height)
  
}, {immediate: true})

watch(() => props.minWidth, (val) => {
  if (val > 0 && val <= datatmp.width) {
    datatmp.minW = val;
  }
})
watch(() => props.minHeight, (val) => {
  if (val > 0 && val <= datatmp.height) {
    datatmp.minH = val;
  }
})
watch(() => props.maxWidth, (val) => {
  datatmp.maxW = val;
})
watch(() => props.maxHeight, (val) => {
  datatmp.maxH = val;
})
</script>

<style lang="scss" scoped>
.vdr {
  touch-action: none;
  position: absolute;
  box-sizing: border-box;
}

.drag {
  position: absolute;
}

.bg {
  cursor: move;
  top: 0;
  position: absolute;
}

.select {
  top: 0;
  position: absolute;
  border: dashed 1px var(--drag-h-color);
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.2;
}

.realSelect {
  opacity: 1 !important;
}

.handle {
  background: var(--drag-h-color);
  position: absolute;
}

.remove {
  font-size: 18px;
  color: var(--red-color);
  position: absolute;
}

.bg-none {
  background: none;
}

.t {
  box-sizing: border-box;
  top: -1px;
  border-top: solid 3px var(--drag-h-color);
}

.l {
  box-sizing: border-box;
  left: -1px;
  border-left: solid 3px var(--drag-h-color);
}

.r {
  box-sizing: border-box;
  right: -1px;
  border-right: solid 3px var(--drag-h-color);
}

.b {
  box-sizing: border-box;
  bottom: -1px;
  border-bottom: solid 3px var(--drag-h-color);
}

.mouseTips {
  position: absolute;
  padding-left: 4px;
  padding-right: 4px;
  color: white;
  background: var(--drag-h-color);
  border-radius: 5px;
}

.center {
  left: 50%;
  top: 50%;
  position: absolute;
  opacity: 0.2;
}

.center:before {
  content: ' ';
  width: 1px;
  height: 6px;
  position: absolute;
  background: var(--drag-h-color);
  left: 0;
  top: -3px;
  transform: translateX(-50%);
}

.center:after {
  content: ' ';
  width: 6px;
  height: 1px;
  position: absolute;
  background: var(--drag-h-color);
  left: -3px;
  top: 0;
  transform: translateY(-50%);
}

.rotate {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--drag-h-color);
}

.rotate:after {
  content: ' ';
  height: 12px;
  width: 1px;
  border-right: var(--drag-h-color) dashed 1px;
  position: absolute;
  left: 2px;
  top: 6px;
}
</style>
