<template>
  <div
      ref="dRef"
      :style="style"
      :class="[
      {
        [classNameActive]: data.enabled,
        [classNameDragging]: data.dragging,
        [classNameResizing]: data.resizing,
        [classNameDraggable]: draggable,
        [classNameResizable]: resizable,
        [classNameRotating]: data.rotating,
        [classNameRotatable]: rotatable
      },
      className
    ]"
      @mousedown="elementMouseDown"
      @touchstart="elementTouchDown"
  >
    <div
        v-for="(handle, index) in actualHandles"
        :key="index"
        :class="[classNameHandle, classNameHandle + '-' + handle]"
        :style="handleStyle(handle, index)"
        @mousedown.stop.prevent="handleDown(handle, $event)"
        @touchstart.stop.prevent="handleTouchDown(handle, $event)"
    >
      <slot :name="handle"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import {matchesSelectorToParentElements, getComputedSize, addEvent, removeEvent} from "./utils/dom";
import {computeWidth, computeHeight, restrictToBounds, snapToGrid, rotatedPoint, getAngle} from "./utils/fns";
import {computed, ref, reactive, watch, onBeforeUnmount} from "vue";
import {onMounted} from "vue-demi";
// const $emit = defineEmits(["activated",
//   "deactivated",
//   "update:active",
//   "rotating",
//   "dragging",
//   "resizing",
//   "refLineParams",
//   "resizestop",
//   "dragstop",
//   "rotatestop"])

const events = {
  mouse: {
    start: "mousedown",
    move: "mousemove",
    stop: "mouseup"
  },
  touch: {
    start: "touchstart",
    move: "touchmove",
    stop: "touchend"
  }
};
// 禁止用户选取
const userSelectNone = {
  userSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  MsUserSelect: "none"
};
// 用户选中自动
const userSelectAuto = {
  userSelect: "auto",
  MozUserSelect: "auto",
  WebkitUserSelect: "auto",
  MsUserSelect: "auto"
};
const dRef = ref()
const props = defineProps({
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
  // 新增开启旋转时的自定义类名
  classNameRotatable: {
    type: String,
    default: "rotatable"
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
  disableUserSelect: {
    type: Boolean,
    default: true
  },
  enableNativeDrag: {
    type: Boolean,
    default: false
  },
  preventDeactivation: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  draggable: {
    type: Boolean,
    default: true
  },
  resizable: {
    type: Boolean,
    default: true
  },
  // 新增 旋转 默认为false 不开启
  rotatable: {
    type: Boolean,
    default: false
  },
  // 锁定宽高比
  lockAspectRatio: {
    type: Boolean,
    default: false
  },
  // 新增 外部传入纵横比 w/h
  outsideAspectRatio: {
    type: [Number, String],
    default: 0
  },
  w: {
    type: [Number, String],
    default: 200,
    validator: val => {
      if (typeof val === "number") {
        return val > 0;
      }
      return val === "auto";
    }
  },
  h: {
    type: [Number, String],
    default: 200,
    validator: val => {
      if (typeof val === "number") {
        return val > 0;
      }
      return val === "auto";
    }
  },
  minWidth: {
    type: Number,
    default: 0,
    validator: val => val >= 0
  },
  minHeight: {
    type: Number,
    default: 0,
    validator: val => val >= 0
  },
  maxWidth: {
    type: Number,
    default: Infinity,
    validator: val => val >= 0
  },
  maxHeight: {
    type: Number,
    default: Infinity,
    validator: val => val >= 0
  },
  x: {
    type: [String, Number],
    default: 0
  },
  y: {
    type: [String, Number],
    default: 0
  },
  z: {
    type: [String, Number],
    default: "auto",
    validator: val => (typeof val === "string" ? val === "auto" : val >= 0)
  },
  // 新增 初始旋转角度
  r: {
    type: [String, Number],
    default: 0
  },
  // 新增 旋转手柄 rot
  handles: {
    type: Array,
    default: () => ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "rot"],
    validator: val => {
      const s = new Set(["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "rot"]);
      return new Set(val.filter(h => s.has(h))).size === val.length;
    }
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
    validator: val => ["x", "y", "both"].includes(val)
  },
  grid: {
    type: Array,
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
    default: 5,
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

let eventsFor = events.mouse;
const mouseClickPosition = ref({})
const bounds = ref({})
const data = reactive({
  left: props.x,
  top: props.y,
  scale: 1,
  right: null,
  bottom: null,
  // 新增旋转角度
  rotate: props.r,
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
  handle: null,
  enabled: props.active,
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

const handleStyle = computed(() => {
  return stick => {
    if (!props.handleInfo.switch) return {display: data.enabled ? "block" : "none"};
    // 新增 当没有开启旋转的时候，旋转手柄不显示
    if (stick === "rot" && !props.rotatable) return {display: "none"};
    if (stick !== "rot" && !props.resizable) return {display: "none"};
    const size = (props.handleInfo.size / props.scaleRatio).toFixed(2);
    const offset = (props.handleInfo.offset / props.scaleRatio).toFixed(2);
    const center = (size / 2).toFixed(2);
    const styleMap = {
      tl: {
        top: `${offset}px`,
        left: `${offset}px`
      },
      tm: {
        top: `${offset}px`,
        left: `calc(50% - ${center}px)`
      },
      tr: {
        top: `${offset}px`,
        right: `${offset}px`
      },
      mr: {
        top: `calc(50% - ${center}px)`,
        right: `${offset}px`
      },
      br: {
        bottom: `${offset}px`,
        right: `${offset}px`
      },
      bm: {
        bottom: `${offset}px`,
        right: `calc(50% - ${center}px)`
      },
      bl: {
        bottom: `${offset}px`,
        left: `${offset}px`
      },
      ml: {
        top: `calc(50% - ${center}px)`,
        left: `${offset}px`
      },
      rot: {
        top: `-${size * 3}px`,
        left: `50%`
      }
    };
    const stickStyle = {
      width: styleMap[stick].width || `${size}px`,
      height: styleMap[stick].height || `${size}px`,
      top: styleMap[stick].top,
      left: styleMap[stick].left,
      right: styleMap[stick].right,
      bottom: styleMap[stick].bottom
    };
    const mapStick2Index = {
      tl: 0,
      tm: 1,
      tr: 2,
      mr: 3,
      br: 4,
      bm: 5,
      bl: 6,
      ml: 7,
      rot: 8
    };
    // 新增 让控制手柄的鼠标样式跟随旋转角度变化
    if (stick !== "rot") {
      const cursorStyleArray = [
        "nw-resize",
        "n-resize",
        "ne-resize",
        "e-resize",
        "se-resize",
        "s-resize",
        "sw-resize",
        "w-resize"
      ];
      const STEP = 45;
      const rotate = data.rotate + STEP / 2;
      const deltaIndex = Math.floor(rotate / STEP);
      let index = (mapStick2Index[stick] + deltaIndex) % 8;
      stickStyle.cursor = cursorStyleArray[index];
    }
    stickStyle.display = data.enabled ? "block" : "none";
    return stickStyle;
  };
},)
const style = computed(() => {
  return {
    transform: `translate(${data.left}px, ${data.top}px) rotate(${data.rotate}deg)`,
    width: computedWidth.value,
    height: computedHeight.value,
    zIndex: data.zIndex,
    fontSize: props.handleInfo.size * 2 + "px",
    ...(data.dragging && props.disableUserSelect ? userSelectNone : userSelectAuto)
  };
})
// 控制柄显示与否
const actualHandles = computed(() => {
  if (!props.resizable && !props.rotatable) return [];
  return props.handles;
})
//  根据left right 算出元素的宽度
const computedWidth = computed(() => {
  if (props.w === "auto") {
    if (!data.widthTouched) {
      return "auto";
    }
  }
  return data.width + "px";
})

// 根据top bottom 算出元素的宽度
const computedHeight = computed(() => {
  if (props.h === "auto") {
    if (!data.heightTouched) {
      return "auto";
    }
  }
  return data.height + "px";
})

onMounted(() => {
  if (!props.enableNativeDrag) {
    dRef.value.ondragstart = () => false;
  }
  console.log(dRef.value)
  const [parentWidth, parentHeight] = getParentSize();
  data.parentWidth = parentWidth;
  data.parentHeight = parentHeight;
  const [width, height] = getComputedSize(dRef.value);
  props.aspectFactor = (props.w !== "auto" ? props.w : width) / (props.h !== "auto" ? props.h : height);
  if (props.outsideAspectRatio) {
    props.aspectFactor = props.outsideAspectRatio;
  }
  data.width = props.w !== "auto" ? props.w : width;
  data.height = props.h !== "auto" ? props.h : height;
  data.right = data.parentWidth - data.width - data.left;
  data.bottom = data.parentHeight - data.height - data.top;
  
  // 绑定data-*属性
  settingAttribute();
  // 监听取消操作
  addEvent(document.documentElement, "mousedown", deselect);
  addEvent(document.documentElement, "touchend touchcancel", deselect);
  //  窗口变化时，检查容器大小
  addEvent(window, "resize", checkParentSize);
})

onBeforeUnmount(() => {
  removeEvent(document.documentElement, "mousedown", deselect);
  removeEvent(document.documentElement, "touchstart", handleUp);
  removeEvent(document.documentElement, "mousemove", move);
  removeEvent(document.documentElement, "touchmove", move);
  removeEvent(document.documentElement, "mouseup", handleUp);
  removeEvent(document.documentElement, "touchend touchcancel", deselect);
  removeEvent(window, "resize", checkParentSize);
})

function init() {
  // eslint-disable-next-line 无效的prop：minWidth不能大于maxWidth
  if (props.maxWidth && props.minWidth > props.maxWidth)
    console.warn("[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth");
  // eslint-disable-next-line 无效prop：minHeight不能大于maxHeight'
  if (props.maxWidth && props.minHeight > props.maxHeight)
    console.warn("[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight");
  data.lastCenterX = 0;
  data.lastCenterY = 0;
  data.TL = {};
  data.TR = {};
  data.BL = {};
  data.BR = {};
  resetBoundsAndMouseState();
}

init()

// 重置边界和鼠标状态
function resetBoundsAndMouseState() {
  mouseClickPosition.value = {
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };
  bounds.value = {
    minLeft: null,
    maxLeft: null,
    minRight: null,
    maxRight: null,
    minTop: null,
    maxTop: null,
    minBottom: null,
    maxBottom: null
  };
}

// 检查父元素大小
function checkParentSize() {
  if (props.parent) {
    const [newParentWidth, newParentHeight] = getParentSize();
    // 修复父元素改变大小后，组件resizing时活动异常
    data.right = newParentWidth - data.width - data.left;
    data.bottom = newParentHeight - data.height - data.top;
    data.parentWidth = newParentWidth;
    data.parentHeight = newParentHeight;
  }
}

// 更新获取父元素宽高
function updateParentSize() {
  const [parentWidth, parentHeight] = getParentSize();
  data.parentWidth = parentWidth;
  data.parentHeight = parentHeight;
}

// 获取父元素大小
function getParentSize() {
  if (props.parent === true) {
    const style = window.getComputedStyle(dRef.value.parentNode, null);
    const rect = dRef.value.parentNode.getBoundingClientRect();
    data.parentX = rect.x;
    data.parentY = rect.y;
    return [
      Math.round(parseFloat(style.getPropertyValue("width"), 10)),
      Math.round(parseFloat(style.getPropertyValue("height"), 10))
    ];
  }
  if (typeof props.parent === "string") {
    const parentNode = document.querySelector(props.parent);
    if (!(parentNode instanceof HTMLElement)) {
      throw new Error(`The selector ${props.parent} does not match any element`);
    }
    return [parentNode.offsetWidth, parentNode.offsetHeight];
  }
  return [null, null];
}

// 元素触摸按下
function elementTouchDown(e) {
  eventsFor = events.touch;
  elementDown(e);
}

function elementMouseDown(e) {
  eventsFor = events.mouse;
  elementDown(e);
}

// 元素按下
function elementDown(e) {
  if (e instanceof MouseEvent && e.which !== 1) {
    return;
  }
  const target = e.target || e.srcElement;
  if (dRef.value.contains(target)) {
    if (props.onDragStart(e) === false) {
      return;
    }
    if (
        (props.dragHandle && !matchesSelectorToParentElements(target, props.dragHandle, dRef.value)) ||
        (props.dragCancel && matchesSelectorToParentElements(target, props.dragCancel, dRef.value))
    ) {
      data.dragging = false;
      return;
    }
    if (!data.enabled) {
      data.enabled = true;
      // $emit("activated");
      // $emit("update:active", true);
    }
    if (props.draggable) {
      data.dragging = true;
    }
    // console.log(data.dragging)
    //  按下鼠标表示保存当前状态
    mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
    mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
    mouseClickPosition.value.left = data.left;
    mouseClickPosition.value.right = data.right;
    mouseClickPosition.value.top = data.top;
    mouseClickPosition.value.bottom = data.bottom;
    mouseClickPosition.value.width = data.width;
    mouseClickPosition.value.height = data.height;
    if (props.parent) {
      bounds.value = calcDragLimits();
    }
    addEvent(document.documentElement, eventsFor.move, move);
    addEvent(document.documentElement, eventsFor.stop, handleUp);
  }
}

// 计算移动范围
function calcDragLimits() {
  // 开启旋转时，不在进行边界限制
  if (props.rotatable) {
    return {
      minLeft: -data.width / 2,
      maxLeft: data.parentWidth - data.width / 2,
      minRight: data.width / 2,
      maxRight: data.parentWidth + data.width / 2,
      minTop: -data.height / 2,
      maxTop: data.parentHeight - data.height / 2,
      minBottom: data.height / 2,
      maxBottom: data.parentHeight + data.height / 2
    };
  } else {
    return {
      minLeft: data.left % props.grid[0],
      maxLeft: Math.floor((data.parentWidth - data.width - data.left) / props.grid[0]) * props.grid[0] + data.left,
      minRight: data.right % props.grid[0],
      maxRight: Math.floor((data.parentWidth - data.width - data.right) / props.grid[0]) * props.grid[0] + data.right,
      minTop: data.top % props.grid[1],
      maxTop: Math.floor((data.parentHeight - data.height - data.top) / props.grid[1]) * props.grid[1] + data.top,
      minBottom: data.bottom % props.grid[1],
      maxBottom:
          Math.floor((data.parentHeight - data.height - data.bottom) / props.grid[1]) * props.grid[1] + data.bottom
    };
  }
}

// 取消选择
function deselect(e) {
  const target = e.target || e.srcElement;
  const regex = new RegExp(props.className + "-([trmbl]{2})", "");
  if (!dRef.value.contains(target) && !regex.test(target.className)) {
    if (data.enabled && !props.preventDeactivation) {
      data.enabled = false;
      // $emit("deactivated");
      // $emit("update:active", false);
    }
    removeEvent(document.documentElement, eventsFor.move, move);
  }
  resetBoundsAndMouseState();
}

// 控制柄触摸按下
function handleTouchDown(handle, e) {
  eventsFor = events.touch;
  handleDown(handle, e);
}

// 控制柄按下
function handleDown(handle, e) {
  if (e instanceof MouseEvent && e.which !== 1) {
    return false;
  }
  if (props.onResizeStart(handle, e) === false) {
    return false;
  }
  if (e.stopPropagation) e.stopPropagation();
  data.handle = handle;
  // 新增旋转手柄
  if (data.handle === "rot") {
    data.rotating = true;
  } else {
    data.resizing = true;
  }
  // 新增保存矩形信息
  // 获取父元素的位置大小信息
  let {top, left, width, height} = dRef.value.getBoundingClientRect();
  // 保存旋转中心的绝对坐标
  data.lastCenterX = window.pageXOffset + left + width / 2;
  data.lastCenterY = window.pageYOffset + top + height / 2;
  // 保存四个顶点的坐标
  let oleft = data.left;
  let otop = data.top;
  let owidth = data.width;
  let oheight = data.height;
  let centerX = oleft + owidth / 2;
  let centerY = otop + oheight / 2;
  let rotate = data.rotate;
  // 获取旋转后的坐标
  data.TL = rotatedPoint(centerX, centerY, oleft, otop, rotate);
  data.TR = rotatedPoint(centerX, centerY, oleft + owidth, otop, rotate);
  data.BL = rotatedPoint(centerX, centerY, oleft, otop + oheight, rotate);
  data.BR = rotatedPoint(centerX, centerY, oleft + owidth, otop + oheight, rotate);
  //  保存鼠标按下时的当前状态
  mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
  mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
  mouseClickPosition.value.left = data.left;
  mouseClickPosition.value.right = data.right;
  mouseClickPosition.value.top = data.top;
  mouseClickPosition.value.bottom = data.bottom;
  mouseClickPosition.value.width = data.width;
  mouseClickPosition.value.height = data.height;
  // 计算边界
  bounds.value = calcResizeLimits();
  // 添加事件
  addEvent(document.documentElement, eventsFor.move, move);
  addEvent(document.documentElement, eventsFor.stop, handleUp);
}

// 计算调整大小范围
function calcResizeLimits() {
  let minW = data.minW;
  let minH = data.minH;
  let maxW = data.maxW;
  let maxH = data.maxH;
  const [gridX, gridY] = props.grid;
  // 获取矩形信息
  const width = data.width;
  const height = data.height;
  const left = data.left;
  const top = data.top;
  const right = data.right;
  const bottom = data.bottom;
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
      limits.minLeft = Math.max(limits.minLeft, data.parentWidth - right - maxW);
      limits.minRight = Math.max(limits.minRight, data.parentWidth - left - maxW);
    }
    if (maxH) {
      limits.minTop = Math.max(limits.minTop, data.parentHeight - bottom - maxH);
      limits.minBottom = Math.max(limits.minBottom, data.parentHeight - top - maxH);
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
    if (props.lockAspectRatio && maxW && maxH) {
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
  if (data.resizing) {
    handleResize(e);
  } else if (data.dragging) {
    handleDrag(e);
  } else if (data.rotating) {
    handleRotate(e);
  }
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
  const x = mouseX - data.lastCenterX;
  const y = mouseY - data.lastCenterY;
  data.rotate = (getAngle(x, y) + 90) % 360;
  // $emit("rotating", data.rotate);
  // 元素移动
}

// 元素移动
async function handleDrag(e) {
  const axis = props.axis;
  const grid = props.grid;
  // const bounds = bounds.value;
  // const mouseClickPosition = mouseClickPosition.value;
  // 水平移动
  const tmpDeltaX =
      axis && axis !== "y" ? mouseClickPosition.value.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0;
  // 垂直移动
  const tmpDeltaY =
      axis && axis !== "x" ? mouseClickPosition.value.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0;
  const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, props.scaleRatio);
  const left = restrictToBounds(mouseClickPosition.value.left - deltaX, bounds.value.minLeft, bounds.value.maxLeft);
  const top = restrictToBounds(mouseClickPosition.value.top - deltaY, bounds.value.minTop, bounds.value.maxTop);
  if (props.onDrag(left, top) === false) {
    return;
  }
  const right = restrictToBounds(mouseClickPosition.value.right + deltaX, bounds.value.minRight, bounds.value.maxRight);
  const bottom = restrictToBounds(mouseClickPosition.value.bottom + deltaY, bounds.value.minBottom, bounds.value.maxBottom);
  data.left = left;
  data.top = top;
  data.right = right;
  data.bottom = bottom;
  // console.log(axis, {...mouseClickPosition.value} ,e.pageY, tmpDeltaY)
  
  await snapCheck();
  // $emit("dragging", data.left, data.top);
}

// 外部传参改动x
function moveHorizontally(val) {
  const [deltaX, _] = snapToGrid(props.grid, val, data.top, data.scale);
  const left = restrictToBounds(deltaX, bounds.value.minLeft, bounds.value.maxLeft);
  data.left = left;
  data.right = data.parentWidth - data.width - left;
}

// 外部传参改动y
function moveVertically(val) {
  const [_, deltaY] = snapToGrid(props.grid, data.left, val, data.scale);
  const top = restrictToBounds(deltaY, bounds.value.minTop, bounds.value.maxTop);
  data.top = top;
  data.bottom = data.parentHeight - data.height - top;
}

// 控制柄移动
function handleResize(e) {
  const handle = data.handle;
  const scaleRatio = props.scaleRatio;
  const {TL, TR, BL, BR} = data;
  let {x: mouseX, y: mouseY} = getMouseCoordinate(e);
  // 在非旋转且有父容器限制的时候，直接限制mouse参与计算的坐标值
  if (!props.rotatable && props.parent) {
    mouseX = restrictToBounds(mouseX, data.parentX, data.parentX + data.parentWidth * scaleRatio);
    mouseY = restrictToBounds(mouseY, data.parentY, data.parentY + data.parentHeight * scaleRatio);
  }
  // 获取鼠标移动的坐标差
  let deltaX = mouseX - mouseClickPosition.value.mouseX;
  let deltaY = mouseY - mouseClickPosition.value.mouseY;
  // 考虑放缩
  deltaX = deltaX / scaleRatio;
  deltaY = deltaY / scaleRatio;
  let diffX, diffY, scale, scaleB, scaleC, newX, newY, newW, newH;
  let Fixed = {}; // 固定点
  let BX = {}; // 高度边选点
  let CX = {}; //  宽度边选点
  let Va = {}; // 固定点到鼠标 向量
  let Vb = {}; // 固定点到投影边  向量
  let Vc = {}; // 另一边投影
  let Vw = {}; // 宽度向量
  let Vh = {}; // 高度向量
  // 拖动中点
  if (handle.includes("m")) {
    switch (handle) {
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
      case "ml":
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
      case "mr":
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
    switch (handle) {
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
  data.left = newX - newW / 2;
  data.top = newY - newH / 2;
  
  // 父元素限制
  if (props.parent) {
    newW = restrictToBounds(newW, 0, data.parentWidth);
    newH = restrictToBounds(newH, 0, data.parentHeight);
  }
  // 纵横比限制
  if (props.lockAspectRatio) {
    console.log(props.lockAspectRatio, props.aspectFactor);
    if (newW / newH > props.aspectFactor) {
      newW = newH * props.aspectFactor;
    } else {
      newH = newW / props.aspectFactor;
    }
  }
  data.width = newW;
  data.height = newH;
  // $emit("resizing", data.left, data.top, data.width, data.height);
}

function changeWidth(val) {
  const [newWidth, _] = snapToGrid(props.grid, val, 0, data.scale);
  // const right = restrictToBounds(
  //   data.parentWidth - newWidth - data.left,
  //   bounds.value.minRight,
  //   bounds.value.maxRight
  // );
  const right = data.parentWidth - newWidth - data.left;
  let bottom = data.bottom;
  if (props.lockAspectRatio) {
    bottom = data.bottom - (data.right - right) / props.aspectFactor;
  }
  const width = computeWidth(data.parentWidth, data.left, right);
  const height = computeHeight(data.parentHeight, data.top, bottom);
  data.right = right;
  data.bottom = bottom;
  data.width = width;
  data.height = height;
}

function changeHeight(val) {
  const [_, newHeight] = snapToGrid(props.grid, 0, val, data.scale);
  // const bottom = restrictToBounds(
  //   data.parentHeight - newHeight - data.top,
  //   bounds.value.minBottom,
  //   bounds.value.maxBottom
  // );
  const bottom = data.parentHeight - newHeight - data.top;
  let right = data.right;
  if (props.lockAspectRatio) {
    right = data.right - (data.bottom - bottom) * props.aspectFactor;
  }
  const width = computeWidth(data.parentWidth, data.left, right);
  const height = computeHeight(data.parentHeight, data.top, bottom);
  data.right = right;
  data.bottom = bottom;
  data.width = width;
  data.height = height;
}

// 从控制柄松开
async function handleUp(e) {
  data.handle = null;
  // 初始化辅助线数据
  const temArr = new Array(3).fill({
    display: false,
    position: "",
    origin: "",
    lineLength: ""
  });
  const refLine = {vLine: [], hLine: []};
  for (const i in refLine) {
    refLine[i] = JSON.parse(JSON.stringify(temArr));
  }
  // 保存 鼠标松开的坐标
  const {x: mouseX, y: mouseY} = getMouseCoordinate(e);
  // lastMouseX = mouseX;
  // lastMouseY = mouseY;
  if (data.resizing) {
    data.resizing = false;
    await conflictCheck();
    // $emit("refLineParams", refLine);
    // $emit("resizestop", data.left, data.top, data.width, data.height);
  }
  if (data.dragging) {
    data.dragging = false;
    await conflictCheck();
    // $emit("refLineParams", refLine);
    // $emit("dragstop", data.left, data.top);
  }
  if (data.rotating) {
    data.rotating = false;
    // $emit("rotatestop", data.rotate);
  }
  resetBoundsAndMouseState();
  removeEvent(document.documentElement, eventsFor.move, move);
}

// 新增方法 ↓↓↓
// 设置属性
function settingAttribute() {
  // 设置冲突检测
  dRef.value.setAttribute("data-is-check", `${props.isConflictCheck}`);
  // 设置对齐元素
  dRef.value.setAttribute("data-is-snap", `${props.maxH}`);
}

// 冲突检测
function conflictCheck() {
  const top = data.top;
  const left = data.left;
  const width = data.width;
  const height = data.height;
  if (props.isConflictCheck) {
    const nodes = dRef.value.parentNode.childNodes; // 获取当前父节点下所有子节点
    for (const item of nodes) {
      if (
          item.className !== undefined &&
          !item.className.split(" ").includes(props.classNameActive) &&
          item.getAttribute("data-is-check") !== null &&
          item.getAttribute("data-is-check") !== "false"
      ) {
        const tw = item.offsetWidth;
        const th = item.offsetHeight;
        // 正则获取left与right
        const [tl, tt] = formatTransformVal(item.style.transform);
        // 左上角与右下角重叠
        const tfAndBr =
            (top >= tt && left >= tl && tt + th > top && tl + tw > left) ||
            (top <= tt && left < tl && top + height > tt && left + width > tl);
        // 右上角与左下角重叠
        const brAndTf =
            (left <= tl && top >= tt && left + width > tl && top < tt + th) ||
            (top < tt && left > tl && top + height > tt && left < tl + tw);
        // 下边与上边重叠
        const bAndT =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left > tl + tw);
        // 上边与下边重叠（宽度不一样）
        const tAndB =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left > tl + tw);
        // 左边与右边重叠
        const lAndR =
            (left >= tl && top >= tt && left < tl + tw && top < tt + th) ||
            (top > tt && left <= tl && left + width > tl && top < tt + th);
        // 左边与右边重叠（高度不一样）
        const rAndL =
            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||
            (top >= tt && left <= tl && top < tt + th && left + width > tl);
        // 如果冲突，就将回退到移动前的位置
        if (tfAndBr || brAndTf || bAndT || tAndB || lAndR || rAndL) {
          data.top = mouseClickPosition.value.top;
          data.left = mouseClickPosition.value.left;
          data.width = mouseClickPosition.value.width;
          data.height = mouseClickPosition.value.height;
        }
      }
    }
  }
}

// 检测对齐元素
async function snapCheck() {
  if (props.maxH) {
    // 保存当前元素的四个属性
    let width = data.width;
    let height = data.height;
    let activeLeft = data.left;
    let activeRight = data.left + width;
    let activeTop = data.top;
    let activeBottom = data.top + height;
    // 初始化辅助线数据
    const temArr = new Array(3).fill({
      display: false,
      position: "",
      origin: "",
      lineLength: ""
    });
    const refLine = {vLine: [], hLine: []};
    for (const i in refLine) {
      refLine[i] = JSON.parse(JSON.stringify(temArr));
    }
    const tem = {
      value: {x: [[], [], []], y: [[], [], []]},
      display: [],
      position: []
    };
    // 获取当前父节点下所有子节点
    const nodes = dRef.value.parentNode.childNodes;
    //  当允许多个同时激活时，获取总体的属性
    const {groupWidth, groupHeight, groupLeft, groupTop, bln} = await getActiveAll(nodes);
    if (!bln) {
      width = groupWidth;
      height = groupHeight;
      activeLeft = groupLeft;
      activeRight = groupLeft + groupWidth;
      activeTop = groupTop;
      activeBottom = groupTop + groupHeight;
    }
    // 遍历获取其他元素的属性
    for (const item of nodes) {
      if (
          item.className !== undefined &&
          !item.className.split(" ").includes(props.classNameActive) &&
          item.getAttribute("data-is-snap") !== null &&
          item.getAttribute("data-is-snap") !== "false"
      ) {
        // 获取位置，角度
        const [l, t, rotate] = formatTransformVal(item.style.transform);
        if ((rotate - data.rotate) % 90 === 0) {
          // 获取宽高
          const w = item.offsetWidth;
          const h = item.offsetHeight;
          // 计算得到right和bottom
          const r = l + w; // 对齐目标right
          const b = t + h; // 对齐目标的bottom
          const hc = Math.abs(activeTop + height / 2 - (t + h / 2)) <= props.snapTolerance; // 水平中线
          const vc = Math.abs(activeLeft + width / 2 - (l + w / 2)) <= props.snapTolerance; // 垂直中线
          const ts = Math.abs(t - activeBottom) <= props.snapTolerance; // 从上到下
          const TS = Math.abs(b - activeBottom) <= props.snapTolerance; // 从上到下
          const bs = Math.abs(t - activeTop) <= props.snapTolerance; // 从下到上 上边共线
          const BS = Math.abs(b - activeTop) <= props.snapTolerance; // 从下到上
          const ls = Math.abs(l - activeRight) <= props.snapTolerance; // 外左
          const LS = Math.abs(r - activeRight) <= props.snapTolerance; // 外左
          const rs = Math.abs(l - activeLeft) <= props.snapTolerance; // 外右
          const RS = Math.abs(r - activeLeft) <= props.snapTolerance; // 外右
          tem.display = [ts, TS, bs, BS, hc, hc, ls, LS, rs, RS, vc, vc];
          tem.position = [t, b, t, b, t + h / 2, t + h / 2, l, r, l, r, l + w / 2, l + w / 2];
          // 单个可激活元素与其他元素对齐
          if (bln) {
            if (ts) {
              data.top = t - height;
              data.bottom = data.parentHeight - data.top - height;
              tem.value.y[0].push(l, r, activeLeft, activeRight);
            }
            if (bs) {
              data.top = t;
              data.bottom = data.parentHeight - data.top - height;
              tem.value.y[0].push(l, r, activeLeft, activeRight);
            }
            if (TS) {
              data.top = b - height;
              data.bottom = data.parentHeight - data.top - height;
              tem.value.y[1].push(l, r, activeLeft, activeRight);
            }
            if (BS) {
              data.top = b;
              data.bottom = data.parentHeight - data.top - height;
              tem.value.y[1].push(l, r, activeLeft, activeRight);
            }
            if (ls) {
              data.left = l - width;
              data.right = data.parentWidth - data.left - width;
              tem.value.x[0].push(t, b, activeTop, activeBottom);
            }
            if (rs) {
              data.left = l;
              data.right = data.parentWidth - data.left - width;
              tem.value.x[0].push(t, b, activeTop, activeBottom);
            }
            if (LS) {
              data.left = r - width;
              data.right = data.parentWidth - data.left - width;
              tem.value.x[1].push(t, b, activeTop, activeBottom);
            }
            if (RS) {
              data.left = r;
              data.right = data.parentWidth - data.left - width;
              tem.value.x[1].push(t, b, activeTop, activeBottom);
            }
            if (hc) {
              data.top = t + h / 2 - height / 2;
              data.bottom = data.parentHeight - data.top - height;
              tem.value.y[2].push(l, r, activeLeft, activeRight);
            }
            if (vc) {
              data.left = l + w / 2 - width / 2;
              data.right = data.parentWidth - data.left - width;
              tem.value.x[2].push(t, b, activeTop, activeBottom);
            }
            // 和容器贴边
            if (props.snapBorder) {
              if (Math.abs(data.left - 0) <= props.snapTolerance) {
                data.left = 0;
                data.right = data.parentWidth - data.left - width;
              }
              if (Math.abs(data.right - 0) <= props.snapTolerance) {
                data.right = 0;
                data.left = data.parentWidth - data.width - data.right;
              }
              if (Math.abs(data.top - 0) <= props.snapTolerance) {
                data.top = 0;
                data.bottom = data.parentHeight - data.top - height;
              }
              if (Math.abs(data.bottom - 0) <= props.snapTolerance) {
                data.bottom = 0;
                data.top = data.parentHeight - data.bottom - height;
              }
            }
          }
          // 再次进行边界处理
          let bounds = bounds.value;
          data.left = restrictToBounds(data.left, bounds.minLeft, bounds.maxLeft);
          data.top = restrictToBounds(data.top, bounds.minTop, bounds.maxTop);
          data.right = restrictToBounds(data.right, bounds.minRight, bounds.maxRight);
          data.bottom = restrictToBounds(data.bottom, bounds.minBottom, bounds.maxBottom);
          // 辅助线坐标与是否显示(display)对应的数组,易于循环遍历
          const arrTem = [0, 1, 0, 1, 2, 2, 0, 1, 0, 1, 2, 2];
          for (let i = 0; i <= arrTem.length; i++) {
            // 前6为Y辅助线,后6为X辅助线
            const xory = i < 6 ? "y" : "x";
            const horv = i < 6 ? "hLine" : "vLine";
            if (tem.display[i]) {
              const {origin, length} = calcLineValues(tem.value[xory][arrTem[i]]);
              refLine[horv][arrTem[i]].display = tem.display[i];
              refLine[horv][arrTem[i]].position = tem.position[i] + "px";
              refLine[horv][arrTem[i]].origin = origin;
              refLine[horv][arrTem[i]].lineLength = length;
            }
          }
        }
      }
    }
    // $emit("refLineParams", refLine);
  }
}

// 计算参考线
function calcLineValues(arr) {
  const length = Math.max(...arr) - Math.min(...arr) + "px";
  const origin = Math.min(...arr) + "px";
  return {length, origin};
}

async function getActiveAll(nodes) {
  const activeAll = [];
  const XArray = [];
  const YArray = [];
  let groupWidth = 0;
  let groupHeight = 0;
  let groupLeft = 0;
  let groupTop = 0;
  for (const item of nodes) {
    // 修复判断条件 split(' ')
    if (item.className !== undefined && item.className.split(" ").includes(props.classNameActive)) {
      activeAll.push(item);
    }
  }
  const AllLength = activeAll.length;
  if (AllLength > 1) {
    for (const i of activeAll) {
      const l = i.offsetLeft;
      const r = l + i.offsetWidth;
      const t = i.offsetTop;
      const b = t + i.offsetHeight;
      XArray.push(l, r);
      YArray.push(t, b);
    }
    groupWidth = Math.max(...XArray) - Math.min(...XArray);
    groupHeight = Math.max(...YArray) - Math.min(...YArray);
    groupLeft = Math.min(...XArray);
    groupTop = Math.min(...YArray);
  }
  const bln = AllLength === 1;
  return {groupWidth, groupHeight, groupLeft, groupTop, bln};
}

// 修复 正则获取left与top  string.match(/[\d|\.]+/g)
function formatTransformVal(string) {
  let [left, top, rotate = 0] = string.match(/[\d|\.]+/g);
  if (top === undefined) top = 0;
  return [Number(left), Number(top), rotate];
}


watch(() => props.active, (val) => {
  data.enabled = val;
  if (val) {
    updateParentSize();
    // $emit("activated");
  } else {
    // $emit("deactivated");
  }
})
watch(() => props.x, (val) => {
  if (data.resizing || data.dragging) {
    return;
  }
  if (props.parent) {
    bounds.value = calcDragLimits();
  }
  moveHorizontally(val);
})
watch(() => props.y, (val) => {
  if (data.resizing || data.dragging) {
    return;
  }
  if (props.parent) {
    bounds.value = calcDragLimits();
  }
  moveVertically(val);
})
watch(() => props.z, (val) => {
  if (val >= 0 || val === "auto") {
    data.zIndex = val;
  }
})
// 新增 监听外部传入参数  旋转角度
watch(() => props.r, (val) => {
  if (val >= 0) {
    data.rotate = val % 360;
  }
})
// 锁定纵横比
watch(() => props.lockAspectRatio, (val) => {
  if (val) {
    if (props.outsideAspectRatio) {
      props.aspectFactor = props.outsideAspectRatio;
    } else {
      props.aspectFactor = data.width / data.height;
    }
  } else {
    props.aspectFactor = undefined;
  }
})
// 自定义纵横比
watch(() => props.outsideAspectRatio, (val) => {
  if (val) {
    props.aspectFactor = val;
  }
})
watch(() => props.minWidth, (val) => {
  if (val > 0 && val <= data.width) {
    data.minW = val;
  }
})
watch(() => props.minHeight, (val) => {
  if (val > 0 && val <= data.height) {
    data.minH = val;
  }
})
watch(() => props.maxWidth, (val) => {
  data.maxW = val;
})
watch(() => props.maxHeight, (val) => {
  data.maxH = val;
})
watch(() => props.w, (val) => {
  if (data.resizing || data.dragging) {
    return;
  }
  if (props.parent) {
    bounds.value = calcResizeLimits();
  }
  changeWidth(val);
})
watch(() => props.h, (val) => {
  if (data.resizing || data.dragging) {
    return;
  }
  if (props.parent) {
    bounds.value = calcResizeLimits();
  }
  changeHeight(val);
})
</script>

<style scoped>
.vdr {
  touch-action: none;
  position: absolute;
  box-sizing: border-box;
  border: 1px dashed;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  background: #ffffff;
  border: 1px solid #333;
}

.handle-tl {
  cursor: nw-resize;
}

.handle-tm {
  cursor: n-resize;
}

.handle-tr {
  cursor: ne-resize;
}

.handle-ml {
  cursor: w-resize;
}

.handle-mr {
  cursor: e-resize;
}

.handle-bl {
  cursor: sw-resize;
}

.handle-bm {
  cursor: s-resize;
}

.handle-br {
  cursor: se-resize;
}

/* 新增 旋转控制柄 */
.handle-rot {
  transform: translateX(-50%);
  cursor: grab;
  display: inline-block;
  box-sizing: border-box;
  border: none;
  text-indent: -9999px;
  vertical-align: middle;
}

.handle-rot:before,
.handle-rot:after {
  content: "";
  box-sizing: inherit;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.handle-rot:before {
  width: 1em;
  height: 1em;
  border: 2px solid #333;
  border-right-color: transparent;
  border-radius: 50%;
}

.handle-rot:after {
  width: 0px;
  height: 0px;
  border: 0.25em solid #333;
  border-left-color: transparent;
  border-top-color: transparent;
  left: 100%;
  top: 10%;
}
</style>
