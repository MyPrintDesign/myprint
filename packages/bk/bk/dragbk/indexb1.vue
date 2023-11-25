<!--<template>-->
<!--  <div-->
<!--      ref="dRef"-->
<!--      :style="style"-->
<!--      :class="[-->
<!--      {-->
<!--        [classNameActive]: datatmp.enabled,-->
<!--        [classNameDragging]: datatmp.dragging,-->
<!--        [classNameResizing]: datatmp.resizing,-->
<!--        [classNameDraggable]: draggable,-->
<!--        [classNameResizable]: resizable,-->
<!--        [classNameRotating]: datatmp.rotating,-->
<!--        [classNameRotatable]: rotatable-->
<!--      },-->
<!--      className-->
<!--    ]"-->
<!--      @mousedown.stop.prevent="elementMouseDown"-->
<!--      @touchstart.stop.prevent="elementTouchDown"-->
<!--  >-->
<!--    <slot></slot>-->

<!--    <template v-if="!data.lock && data.status == 'HANDLE'">-->
<!--      <div class="rotate" @mousedown.stop.prevent="handleDown({id:'rot'}, $event)"></div>-->

<!--      <div class="handle"-->
<!--           :key="item.id" v-for="(item) in handleList"-->
<!--           :class="item.class"-->
<!--           :style="{left : valueUnit(item.x), top : valueUnit(item.y), cursor: item.cursor,-->
<!--         width: item.width + 'px',-->
<!--         height: item.height + 'px'-->
<!--         }"-->
<!--           @mousedown.stop.prevent="handleDown(item, $event)"-->
<!--      />-->
<!--    </template>-->


<!--    <svg v-if="!data.lock && ['SELECT_REMOVE', 'HANDLE'].includes(data.status)"-->
<!--         :style="{left : valueUnit(data.width), top : valueUnit(-5), cursor: ''}"-->
<!--         class="remove"-->
<!--         viewBox="0 0 1024 1024"-->
<!--         @mousedown="click($event, ()=>mitt.emit('elementRemove', props.data))">-->
<!--      <path-->
<!--          d="M512 464.266L337.054 289.28a33.753 33.753 0 1 0-47.735 47.734L464.226 512 289.241 686.946a33.753 33.753 0 1 0 47.734 47.735L512 559.774l174.946 174.985a33.753 33.753 0 1 0 47.735-47.734L559.774 512l174.985-174.946a33.753 33.753 0 1 0-47.734-47.735L512 464.226z"-->
<!--          fill="#ffffff"/>-->
<!--    </svg>-->
<!--    <div class="center"></div>-->

<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import {matchesSelectorToParentElements, getComputedSize, addEvent, removeEvent} from "../../utils/dom";-->
<!--import {computeWidth, computeHeight, restrictToBounds, snapToGrid, rotatedPoint, getAngle} from "../../utils/fns";-->
<!--import {onMounted, computed, ref, reactive, watch, onBeforeUnmount, inject} from "vue";-->
<!--import {CSSProperties} from "@vue/runtime-dom";-->
<!--import {PropType} from "vue/dist/vue";-->
<!--import {Element} from "@/types/entity";-->
<!--import {click, mm2px, px2mm} from "@/utils/utils";-->
<!--import {mittKey, panelKey} from "@/constants/keys";-->
<!--import {computeTranslate, disableHandleList, getTranslate, valueUnit} from "@/utils/elementUtil";-->

<!--const $emit = defineEmits(["activated",-->
<!--  "deactivated",-->
<!--  "update:active",-->
<!--  "rotating",-->
<!--  "dragging",-->
<!--  "resizing",-->
<!--  "refLineParams",-->
<!--  "resizestop",-->
<!--  "dragstop",-->
<!--  "rotatestop"])-->

<!--const panel = inject(panelKey)-->
<!--const mitt = inject(mittKey)-->

<!--const events = {-->
<!--  mouse: {-->
<!--    start: "mousedown",-->
<!--    move: "mousemove",-->
<!--    stop: "mouseup"-->
<!--  },-->
<!--  touch: {-->
<!--    start: "touchstart",-->
<!--    move: "touchmove",-->
<!--    stop: "touchend"-->
<!--  }-->
<!--};-->
<!--// 禁止用户选取-->
<!--const userSelectNone = {-->
<!--  userSelect: "none",-->
<!--  MozUserSelect: "none",-->
<!--  WebkitUserSelect: "none",-->
<!--  MsUserSelect: "none"-->
<!--};-->
<!--// 用户选中自动-->
<!--const userSelectAuto = {-->
<!--  userSelect: "auto",-->
<!--  MozUserSelect: "auto",-->
<!--  WebkitUserSelect: "auto",-->
<!--  MsUserSelect: "auto"-->
<!--};-->
<!--const dRef = ref()-->
<!--const props = defineProps({-->
<!--  data: {type: Object as PropType<Element>, default: () => ({} as Element)},-->
<!--  className: {-->
<!--    type: String,-->
<!--    default: "vdr"-->
<!--  },-->
<!--  classNameDraggable: {-->
<!--    type: String,-->
<!--    default: "draggable"-->
<!--  },-->
<!--  classNameResizable: {-->
<!--    type: String,-->
<!--    default: "resizable"-->
<!--  },-->
<!--  // 新增开启旋转时的自定义类名-->
<!--  classNameRotatable: {-->
<!--    type: String,-->
<!--    default: "rotatable"-->
<!--  },-->
<!--  classNameDragging: {-->
<!--    type: String,-->
<!--    default: "dragging"-->
<!--  },-->
<!--  classNameResizing: {-->
<!--    type: String,-->
<!--    default: "resizing"-->
<!--  },-->
<!--  // 新增组件处于旋转时的自定义类名-->
<!--  classNameRotating: {-->
<!--    type: String,-->
<!--    default: "rotating"-->
<!--  },-->
<!--  classNameActive: {-->
<!--    type: String,-->
<!--    default: "active"-->
<!--  },-->
<!--  classNameHandle: {-->
<!--    type: String,-->
<!--    default: "handle"-->
<!--  },-->
<!--  disableUserSelect: {-->
<!--    type: Boolean,-->
<!--    default: true-->
<!--  },-->
<!--  enableNativeDrag: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  preventDeactivation: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  active: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  draggable: {-->
<!--    type: Boolean,-->
<!--    default: true-->
<!--  },-->
<!--  resizable: {-->
<!--    type: Boolean,-->
<!--    default: true-->
<!--  },-->
<!--  // 新增 旋转 默认为false 不开启-->
<!--  rotatable: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  // 锁定宽高比-->
<!--  lockAspectRatio: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  // 新增 外部传入纵横比 w/h-->
<!--  outsideAspectRatio: {-->
<!--    type: [Number, String],-->
<!--    default: 0-->
<!--  },-->
<!--  w: {-->
<!--    type: [Number, String],-->
<!--    default: 200,-->
<!--    validator: val => {-->
<!--      if (typeof val === "number") {-->
<!--        return val > 0;-->
<!--      }-->
<!--      return val === "auto";-->
<!--    }-->
<!--  },-->
<!--  h: {-->
<!--    type: [Number, String],-->
<!--    default: 200,-->
<!--    validator: val => {-->
<!--      if (typeof val === "number") {-->
<!--        return val > 0;-->
<!--      }-->
<!--      return val === "auto";-->
<!--    }-->
<!--  },-->
<!--  minWidth: {-->
<!--    type: Number,-->
<!--    default: 0,-->
<!--    validator: (val: number) => val >= 0-->
<!--  },-->
<!--  minHeight: {-->
<!--    type: Number,-->
<!--    default: 0,-->
<!--    validator: (val: number) => val >= 0-->
<!--  },-->
<!--  maxWidth: {-->
<!--    type: Number,-->
<!--    default: Infinity,-->
<!--    validator: (val: number) => val >= 0-->
<!--  },-->
<!--  maxHeight: {-->
<!--    type: Number,-->
<!--    default: Infinity,-->
<!--    validator: (val: number) => val >= 0-->
<!--  },-->
<!--  z: {-->
<!--    type: [String, Number],-->
<!--    default: "auto",-->
<!--    validator: (val: number) => (typeof val === "string" ? val === "auto" : val >= 0)-->
<!--  },-->
<!--  // 新增 初始旋转角度-->
<!--  r: {-->
<!--    type: [String, Number],-->
<!--    default: 0-->
<!--  },-->
<!--  // 新增 旋转手柄 rot-->
<!--  handles: {-->
<!--    type: Array,-->
<!--    default: () => ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "rot"],-->
<!--    validator: (val: Array<string>) => {-->
<!--      const s = new Set(["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "rot"]);-->
<!--      return new Set(val.filter(h => s.has(h))).size === val.length;-->
<!--    }-->
<!--  },-->
<!--  dragHandle: {-->
<!--    type: String,-->
<!--    default: null-->
<!--  },-->
<!--  dragCancel: {-->
<!--    type: String,-->
<!--    default: null-->
<!--  },-->
<!--  axis: {-->
<!--    type: String,-->
<!--    default: "both",-->
<!--    validator: (val: string) => ["x", "y", "both"].includes(val)-->
<!--  },-->
<!--  grid: {-->
<!--    type: Array<number>,-->
<!--    default: () => [1, 1]-->
<!--  },-->
<!--  parent: {-->
<!--    type: [Boolean, String],-->
<!--    default: false-->
<!--  },-->
<!--  onDragStart: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  onDrag: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  onResizeStart: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  onResize: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  // 新增 回调事件-->
<!--  onRotateStart: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  onRotate: {-->
<!--    type: Function,-->
<!--    default: () => true-->
<!--  },-->
<!--  // 冲突检测-->
<!--  isConflictCheck: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  // 元素对齐-->
<!--  snap: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  // 新增 是否对齐容器边界-->
<!--  snapBorder: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  // 当调用对齐时，用来设置组件与组件之间的对齐距离，以像素为单位-->
<!--  snapTolerance: {-->
<!--    type: Number,-->
<!--    default: 5,-->
<!--    validator: function (val) {-->
<!--      return typeof val === "number";-->
<!--    }-->
<!--  },-->
<!--  // 缩放比例-->
<!--  scaleRatio: {-->
<!--    type: Number,-->
<!--    default: 1,-->
<!--    validator: val => typeof val === "number"-->
<!--  },-->
<!--  // handle是否缩放-->
<!--  handleInfo: {-->
<!--    type: Object,-->
<!--    default: () => {-->
<!--      return {-->
<!--        size: 8,-->
<!--        offset: -4,-->
<!--        switch: true-->
<!--      };-->
<!--    }-->
<!--  }-->
<!--})-->

<!--let eventsFor = events.mouse;-->
<!--const mouseClickPosition = ref(-->
<!--    {-->
<!--      left: 0,-->
<!--      right: 0,-->
<!--      top: 0,-->
<!--      bottom: 0,-->
<!--      width: 0,-->
<!--      height: 0,-->
<!--      mouseX: 0,-->
<!--      mouseY: 0,-->
<!--      x: 0,-->
<!--      y: 0,-->
<!--      w: 0,-->
<!--      h: 0-->
<!--    }-->
<!--)-->
<!--const bounds = ref({-->
<!--  minLeft: null,-->
<!--  maxLeft: null,-->
<!--  minRight: null,-->
<!--  maxRight: null,-->
<!--  minTop: null,-->
<!--  maxTop: null,-->
<!--  minBottom: null,-->
<!--  maxBottom: null-->
<!--})-->
<!--const datatmp = reactive({-->
<!--  left: props.data.x,-->
<!--  top: props.data.y,-->
<!--  scale: 1,-->
<!--  right: null,-->
<!--  bottom: null,-->
<!--  // 新增旋转角度-->
<!--  width: null,-->
<!--  height: null,-->
<!--  widthTouched: false,-->
<!--  heightTouched: false,-->
<!--  // 纵横比变量-->
<!--  aspectFactor: null,-->
<!--  // 容器的大小-->
<!--  parentWidth: null,-->
<!--  parentHeight: null,-->
<!--  // 设置最小和最大尺寸-->
<!--  minW: props.minWidth,-->
<!--  minH: props.minHeight,-->
<!--  maxW: props.maxWidth,-->
<!--  maxH: props.maxHeight,-->
<!--  // 定义控制手柄-->
<!--  handle: null,-->
<!--  enabled: props.active,-->
<!--  resizing: false,-->
<!--  dragging: false,-->
<!--  // 新增 表明组件是否正处于旋转状态-->
<!--  rotating: false,-->
<!--  zIndex: props.z,-->
<!--  // 新增 保存中心点位置，用于计算旋转的方向矢量-->
<!--  lastCenterX: 0,-->
<!--  lastCenterY: 0,-->
<!--  // 父元素左上角的坐标值-->
<!--  parentX: 0,-->
<!--  parentY: 0,-->
<!--  TL: null,-->
<!--  TR: null,-->
<!--  BL: null,-->
<!--  BR: null-->
<!--})-->
<!--const disableHandleConstList = disableHandleList(props.data);-->

<!--const handleList = computed(() => {-->
<!--  let list = []-->
<!--  const horizontal = {width: 20, height: 3}-->
<!--  const vertical = {width: 3, height: 20}-->
<!--  const block = {width: 20, height: 20}-->
<!--  const tmpHeight = mm2px(props.data.height)-->
<!--  const tmpWidth = mm2px(props.data.width)-->

<!--  if (tmpHeight < 70) {-->
<!--    block.height = tmpHeight - 51-->
<!--    block.width = tmpHeight - 51-->
<!--    if (tmpHeight < 40) {-->
<!--      vertical.height = tmpHeight - 21-->
<!--    }-->
<!--  }-->
<!--  if (tmpWidth < 70) {-->
<!--    block.height = tmpWidth - 51-->
<!--    block.width = tmpWidth - 51-->
<!--    if (tmpWidth < 40) {-->
<!--      horizontal.width = tmpWidth - 21-->
<!--    }-->
<!--  }-->

<!--  // 左上-->
<!--  if (!disableHandleConstList?.includes('tl') && !props.data.option.aspectRatio) {-->
<!--    list.push({-->
<!--      id: "tl", cursor: 'nwse-resize', ...block, class: 'bg-none l t'-->
<!--    })-->
<!--  }-->
<!--  // 中上-->
<!--  if (!disableHandleConstList?.includes('tm')) {-->
<!--    list.push({-->
<!--      id: "tm", cursor: 'ns-resize', x: props.data?.width / 2 - px2mm(horizontal.width) / 2,-->
<!--      ...horizontal, class: 't'-->
<!--    })-->
<!--  }-->
<!--  // 右上-->
<!--  if (!disableHandleConstList?.includes('tr') && !props.data.option.aspectRatio) {-->
<!--    list.push({-->
<!--      id: "tr", cursor: 'nesw-resize',-->
<!--      ...block, class: 'bg-none r t'-->
<!--    })-->
<!--  }-->
<!--  // 左中-->
<!--  if (!disableHandleConstList?.includes('lm')) {-->
<!--    list.push({-->
<!--      id: "ml", cursor: 'ew-resize', y: props.data?.height / 2 - px2mm(vertical.height) / 2,-->
<!--      ...vertical, class: 'l'-->
<!--    })-->
<!--  }-->
<!--  // 右中-->
<!--  if (!disableHandleConstList?.includes('rm')) {-->
<!--    list.push({-->
<!--      id: "mr", cursor: 'ew-resize', y: props.data?.height / 2 - px2mm(vertical.height) / 2,-->
<!--      ...vertical, class: 'r'-->
<!--    })-->
<!--  }-->
<!--  // 左下-->
<!--  if (!disableHandleConstList?.includes('bl') && !props.data.option.aspectRatio) {-->
<!--    list.push({-->
<!--      id: "bl", cursor: 'nesw-resize',-->
<!--      ...block, class: 'bg-none l b'-->
<!--    })-->
<!--  }-->
<!--  // 下中-->
<!--  if (!disableHandleConstList?.includes('bm')) {-->
<!--    list.push({-->
<!--      id: "bm", cursor: 'ns-resize', x: props.data?.width / 2 - px2mm(horizontal.width) / 2,-->
<!--      ...horizontal, class: 'b'-->
<!--    })-->
<!--  }-->
<!--  // 右下-->
<!--  if (!disableHandleConstList?.includes('br') && !props.data.option.aspectRatio) {-->
<!--    list.push({-->
<!--      id: "br", cursor: 'nwse-resize',-->
<!--      ...block, class: 'bg-none r b'-->
<!--    })-->
<!--  }-->
<!--  return list-->
<!--})-->


<!--const handleStyle = computed(() => {-->
<!--  return stick => {-->
<!--    if (!props.handleInfo.switch) return {display: datatmp.enabled ? "block" : "none"};-->
<!--    // 新增 当没有开启旋转的时候，旋转手柄不显示-->
<!--    if (stick === "rot" && !props.rotatable) return {display: "none"};-->
<!--    if (stick !== "rot" && !props.resizable) return {display: "none"};-->
<!--    const size = (props.handleInfo.size / props.scaleRatio).toFixed(2);-->
<!--    const offset = (props.handleInfo.offset / props.scaleRatio).toFixed(2);-->
<!--    const center = (Number(size) / 2).toFixed(2);-->
<!--    const styleMap = {-->
<!--      tl: {-->
<!--        top: `${offset}px`,-->
<!--        left: `${offset}px`-->
<!--      },-->
<!--      tm: {-->
<!--        top: `${offset}px`,-->
<!--        left: `calc(50% - ${center}px)`-->
<!--      },-->
<!--      tr: {-->
<!--        top: `${offset}px`,-->
<!--        right: `${offset}px`-->
<!--      },-->
<!--      mr: {-->
<!--        top: `calc(50% - ${center}px)`,-->
<!--        right: `${offset}px`-->
<!--      },-->
<!--      br: {-->
<!--        bottom: `${offset}px`,-->
<!--        right: `${offset}px`-->
<!--      },-->
<!--      bm: {-->
<!--        bottom: `${offset}px`,-->
<!--        right: `calc(50% - ${center}px)`-->
<!--      },-->
<!--      bl: {-->
<!--        bottom: `${offset}px`,-->
<!--        left: `${offset}px`-->
<!--      },-->
<!--      ml: {-->
<!--        top: `calc(50% - ${center}px)`,-->
<!--        left: `${offset}px`-->
<!--      },-->
<!--      rot: {-->
<!--        top: `-${Number(size) * 3}px`,-->
<!--        left: `50%`-->
<!--      }-->
<!--    };-->
<!--    const stickStyle = {-->
<!--      width: styleMap[stick].width || `${size}px`,-->
<!--      height: styleMap[stick].height || `${size}px`,-->
<!--      top: styleMap[stick].top,-->
<!--      left: styleMap[stick].left,-->
<!--      right: styleMap[stick].right,-->
<!--      bottom: styleMap[stick].bottom,-->
<!--      cursor: null,-->
<!--      display: null-->
<!--    };-->
<!--    const mapStick2Index = {-->
<!--      tl: 0,-->
<!--      tm: 1,-->
<!--      tr: 2,-->
<!--      mr: 3,-->
<!--      br: 4,-->
<!--      bm: 5,-->
<!--      bl: 6,-->
<!--      ml: 7,-->
<!--      rot: 8-->
<!--    };-->
<!--    // 新增 让控制手柄的鼠标样式跟随旋转角度变化-->
<!--    if (stick !== "rot") {-->
<!--      const cursorStyleArray = [-->
<!--        "nw-resize",-->
<!--        "n-resize",-->
<!--        "ne-resize",-->
<!--        "e-resize",-->
<!--        "se-resize",-->
<!--        "s-resize",-->
<!--        "sw-resize",-->
<!--        "w-resize"-->
<!--      ];-->
<!--      const STEP = 45;-->
<!--      console.log(props.data.option.rotate)-->
<!--      const rotate = props.data.option.rotate + STEP / 2;-->
<!--      const deltaIndex = Math.floor(rotate / STEP);-->
<!--      let index = (mapStick2Index[stick] + deltaIndex) % 8;-->
<!--      stickStyle.cursor = cursorStyleArray[index];-->
<!--    }-->
<!--    stickStyle.display = datatmp.enabled ? "block" : "none";-->
<!--    return stickStyle;-->
<!--  };-->
<!--},)-->
<!--const style = computed(() => {-->
<!--  const s = {-->
<!--    // transform: `translate(${valueUnit(props.data.translateX)}, ${valueUnit(props.data.translateY)}) rotate(${props.data.option.rotate}deg)`,-->
<!--    width: valueUnit(props.data.width),-->
<!--    height: valueUnit(props.data.height),-->
<!--    left: valueUnit(props.data.x),-->
<!--    top: valueUnit(props.data.y),-->
<!--    zIndex: datatmp.zIndex,-->
<!--    fontSize: props.handleInfo.size * 2 + "px",-->
<!--    ...(datatmp.dragging && props.disableUserSelect ? userSelectNone : userSelectAuto)-->
<!--  } as CSSProperties;-->

<!--  // console.log(props.data.translateX)-->
<!--  s.transform = getTranslate(props.data)-->
<!--  return s-->

<!--})-->
<!--// 控制柄显示与否-->
<!--const actualHandles = computed(() => {-->
<!--  if (!props.resizable && !props.rotatable) return [];-->
<!--  return props.handles;-->
<!--})-->
<!--//  根据left right 算出元素的宽度-->
<!--const computedWidth = computed(() => {-->
<!--  if (props.w === "auto") {-->
<!--    if (!datatmp.widthTouched) {-->
<!--      return "auto";-->
<!--    }-->
<!--  }-->
<!--  return datatmp.width;-->
<!--})-->

<!--// 根据top bottom 算出元素的宽度-->
<!--const computedHeight = computed(() => {-->
<!--  if (props.h === "auto") {-->
<!--    if (!datatmp.heightTouched) {-->
<!--      return "auto";-->
<!--    }-->
<!--  }-->
<!--  return datatmp.height;-->
<!--})-->

<!--onMounted(() => {-->
<!--  if (!props.enableNativeDrag) {-->
<!--    dRef.value.ondragstart = () => false;-->
<!--  }-->
<!--  console.log(dRef.value)-->
<!--  const [parentWidth, parentHeight] = getParentSize();-->
<!--  datatmp.parentWidth = parentWidth;-->
<!--  datatmp.parentHeight = parentHeight;-->
<!--  const [width, height] = getComputedSize(dRef.value);-->
<!--  datatmp.aspectFactor = (props.w !== "auto" ? props.w : width) / (props.h !== "auto" ? props.h : height);-->
<!--  if (props.outsideAspectRatio) {-->
<!--    datatmp.aspectFactor = props.outsideAspectRatio;-->
<!--  }-->
<!--  datatmp.width = props.w !== "auto" ? props.w : width;-->
<!--  datatmp.height = props.h !== "auto" ? props.h : height;-->
<!--  datatmp.right = datatmp.parentWidth - datatmp.width - datatmp.left;-->
<!--  datatmp.bottom = datatmp.parentHeight - datatmp.height - datatmp.top;-->

<!--  // 绑定data-*属性-->
<!--  settingAttribute();-->
<!--  // 监听取消操作-->
<!--  addEvent(document.documentElement, "mousedown", deselect);-->
<!--  addEvent(document.documentElement, "touchend touchcancel", deselect);-->
<!--  //  窗口变化时，检查容器大小-->
<!--  addEvent(window, "resize", checkParentSize);-->
<!--})-->

<!--onBeforeUnmount(() => {-->
<!--  removeEvent(document.documentElement, "mousedown", deselect);-->
<!--  removeEvent(document.documentElement, "touchstart", handleUp);-->
<!--  removeEvent(document.documentElement, "mousemove", move);-->
<!--  removeEvent(document.documentElement, "touchmove", move);-->
<!--  removeEvent(document.documentElement, "mouseup", handleUp);-->
<!--  removeEvent(document.documentElement, "touchend touchcancel", deselect);-->
<!--  removeEvent(window, "resize", checkParentSize);-->
<!--})-->

<!--function init() {-->
<!--  // eslint-disable-next-line 无效的prop：minWidth不能大于maxWidth-->
<!--  if (props.maxWidth && props.minWidth > props.maxWidth)-->
<!--    console.warn("[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth");-->
<!--  // eslint-disable-next-line 无效prop：minHeight不能大于maxHeight'-->
<!--  if (props.maxWidth && props.minHeight > props.maxHeight)-->
<!--    console.warn("[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight");-->
<!--  datatmp.lastCenterX = 0;-->
<!--  datatmp.lastCenterY = 0;-->
<!--  datatmp.TL = {};-->
<!--  datatmp.TR = {};-->
<!--  datatmp.BL = {};-->
<!--  datatmp.BR = {};-->
<!--  resetBoundsAndMouseState();-->
<!--}-->

<!--init()-->

<!--// 重置边界和鼠标状态-->
<!--function resetBoundsAndMouseState() {-->
<!--  mouseClickPosition.value = {-->
<!--    left: 0,-->
<!--    right: 0,-->
<!--    top: 0,-->
<!--    bottom: 0,-->
<!--    width: 0,-->
<!--    height: 0,-->
<!--    mouseX: 0,-->
<!--    mouseY: 0,-->
<!--    x: 0,-->
<!--    y: 0,-->
<!--    w: 0,-->
<!--    h: 0-->
<!--  };-->
<!--  bounds.value = {-->
<!--    minLeft: null,-->
<!--    maxLeft: null,-->
<!--    minRight: null,-->
<!--    maxRight: null,-->
<!--    minTop: null,-->
<!--    maxTop: null,-->
<!--    minBottom: null,-->
<!--    maxBottom: null-->
<!--  };-->
<!--}-->

<!--// 检查父元素大小-->
<!--function checkParentSize() {-->
<!--  if (props.parent) {-->
<!--    const [newParentWidth, newParentHeight] = getParentSize();-->
<!--    // 修复父元素改变大小后，组件resizing时活动异常-->
<!--    datatmp.right = newParentWidth - datatmp.width - datatmp.left;-->
<!--    datatmp.bottom = newParentHeight - datatmp.height - datatmp.top;-->
<!--    datatmp.parentWidth = newParentWidth;-->
<!--    datatmp.parentHeight = newParentHeight;-->
<!--  }-->
<!--}-->

<!--// 更新获取父元素宽高-->
<!--function updateParentSize() {-->
<!--  const [parentWidth, parentHeight] = getParentSize();-->
<!--  datatmp.parentWidth = parentWidth;-->
<!--  datatmp.parentHeight = parentHeight;-->
<!--}-->

<!--// 获取父元素大小-->
<!--function getParentSize() {-->
<!--  if (props.parent === true) {-->
<!--    const style = window.getComputedStyle(dRef.value.parentNode, null);-->
<!--    const rect = dRef.value.parentNode.getBoundingClientRect();-->
<!--    datatmp.parentX = rect.x;-->
<!--    datatmp.parentY = rect.y;-->
<!--    return [-->
<!--      Math.round(parseFloat(style.getPropertyValue("width"), 10)),-->
<!--      Math.round(parseFloat(style.getPropertyValue("height"), 10))-->
<!--    ];-->
<!--  }-->
<!--  if (typeof props.parent === "string") {-->
<!--    const parentNode = document.querySelector(props.parent);-->
<!--    if (!(parentNode instanceof HTMLElement)) {-->
<!--      throw new Error(`The selector ${props.parent} does not match any element`);-->
<!--    }-->
<!--    return [parentNode.offsetWidth, parentNode.offsetHeight];-->
<!--  }-->
<!--  return [null, null];-->
<!--}-->

<!--// 元素触摸按下-->
<!--function elementTouchDown(e) {-->
<!--  eventsFor = events.touch;-->
<!--  elementDown(e);-->
<!--}-->

<!--function elementMouseDown(e) {-->
<!--  eventsFor = events.mouse;-->
<!--  elementDown(e);-->
<!--}-->

<!--// 元素按下-->
<!--function elementDown(e) {-->
<!--  if (e instanceof MouseEvent && e.which !== 1) {-->
<!--    return;-->
<!--  }-->
<!--  const target = e.target || e.srcElement;-->
<!--  if (dRef.value.contains(target)) {-->
<!--    if (props.onDragStart(e) === false) {-->
<!--      return;-->
<!--    }-->
<!--    if (-->
<!--        (props.dragHandle && !matchesSelectorToParentElements(target, props.dragHandle, dRef.value)) ||-->
<!--        (props.dragCancel && matchesSelectorToParentElements(target, props.dragCancel, dRef.value))-->
<!--    ) {-->
<!--      datatmp.dragging = false;-->
<!--      return;-->
<!--    }-->
<!--    if (!datatmp.enabled) {-->
<!--      datatmp.enabled = true;-->
<!--      $emit("activated");-->
<!--      $emit("update:active", true);-->
<!--    }-->
<!--    if (props.draggable) {-->
<!--      datatmp.dragging = true;-->
<!--    }-->
<!--    // console.log(data.dragging)-->
<!--    //  按下鼠标表示保存当前状态-->
<!--    mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;-->
<!--    mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;-->
<!--    mouseClickPosition.value.left = datatmp.left;-->
<!--    mouseClickPosition.value.right = datatmp.right;-->
<!--    mouseClickPosition.value.top = datatmp.top;-->
<!--    mouseClickPosition.value.bottom = datatmp.bottom;-->
<!--    mouseClickPosition.value.width = datatmp.width;-->
<!--    mouseClickPosition.value.height = datatmp.height;-->
<!--    if (props.parent) {-->
<!--      bounds.value = calcDragLimits();-->
<!--    }-->
<!--    addEvent(document.documentElement, eventsFor.move, move);-->
<!--    addEvent(document.documentElement, eventsFor.stop, handleUp);-->
<!--  }-->
<!--}-->

<!--// 计算移动范围-->
<!--function calcDragLimits() {-->
<!--  // 开启旋转时，不在进行边界限制-->
<!--  if (props.rotatable) {-->
<!--    return {-->
<!--      minLeft: -datatmp.width / 2,-->
<!--      maxLeft: datatmp.parentWidth - datatmp.width / 2,-->
<!--      minRight: datatmp.width / 2,-->
<!--      maxRight: datatmp.parentWidth + datatmp.width / 2,-->
<!--      minTop: -datatmp.height / 2,-->
<!--      maxTop: datatmp.parentHeight - datatmp.height / 2,-->
<!--      minBottom: datatmp.height / 2,-->
<!--      maxBottom: datatmp.parentHeight + datatmp.height / 2-->
<!--    };-->
<!--  } else {-->
<!--    return {-->
<!--      minLeft: datatmp.left % props.grid[0],-->
<!--      maxLeft: Math.floor((datatmp.parentWidth - datatmp.width - datatmp.left) / props.grid[0]) * props.grid[0] + datatmp.left,-->
<!--      minRight: datatmp.right % props.grid[0],-->
<!--      maxRight: Math.floor((datatmp.parentWidth - datatmp.width - datatmp.right) / props.grid[0]) * props.grid[0] + datatmp.right,-->
<!--      minTop: datatmp.top % props.grid[1],-->
<!--      maxTop: Math.floor((datatmp.parentHeight - datatmp.height - datatmp.top) / props.grid[1]) * props.grid[1] + datatmp.top,-->
<!--      minBottom: datatmp.bottom % props.grid[1],-->
<!--      maxBottom:-->
<!--          Math.floor((datatmp.parentHeight - datatmp.height - datatmp.bottom) / props.grid[1]) * props.grid[1] + datatmp.bottom-->
<!--    };-->
<!--  }-->
<!--}-->

<!--// 取消选择-->
<!--function deselect(e) {-->
<!--  const target = e.target || e.srcElement;-->
<!--  const regex = new RegExp(props.className + "-([trmbl]{2})", "");-->
<!--  if (!dRef.value.contains(target) && !regex.test(target.className)) {-->
<!--    if (datatmp.enabled && !props.preventDeactivation) {-->
<!--      datatmp.enabled = false;-->
<!--      $emit("deactivated");-->
<!--      $emit("update:active", false);-->
<!--    }-->
<!--    removeEvent(document.documentElement, eventsFor.move, move);-->
<!--  }-->
<!--  resetBoundsAndMouseState();-->
<!--}-->

<!--// 控制柄触摸按下-->
<!--function handleTouchDown(handle, e) {-->
<!--  eventsFor = events.touch;-->
<!--  handleDown(handle, e);-->
<!--}-->

<!--// 控制柄按下-->
<!--function handleDown(handle, e) {-->
<!--  if (e instanceof MouseEvent && e.which !== 1) {-->
<!--    return false;-->
<!--  }-->
<!--  if (props.onResizeStart(handle, e) === false) {-->
<!--    return false;-->
<!--  }-->
<!--  datatmp.handle = handle;-->
<!--  // 新增旋转手柄-->
<!--  if (datatmp.handle.id === "rot") {-->
<!--    datatmp.rotating = true;-->
<!--  } else {-->
<!--    datatmp.resizing = true;-->
<!--  }-->
<!--  // 新增保存矩形信息-->
<!--  // 获取父元素的位置大小信息-->
<!--  let {x, y, width, height} = props.data;-->
<!--  let {left, top, width: width1, height: height1} = dRef.value.getBoundingClientRect();-->
<!--  // 保存旋转中心的绝对坐标-->
<!--  // console.log(window.pageXOffset )-->
<!--  console.log(left)-->
<!--  datatmp.lastCenterX = window.pageXOffset + left + width1 / 2;-->
<!--  datatmp.lastCenterY = window.pageYOffset + top + height1 / 2;-->
<!--  // 保存四个顶点的坐标-->
<!--  let oleft = x;-->
<!--  let otop = y;-->
<!--  let owidth = width;-->
<!--  let oheight = height;-->
<!--  let centerX = oleft + owidth / 2;-->
<!--  let centerY = otop + oheight / 2;-->
<!--  let rotate = props.data.option.rotate;-->
<!--  // 获取旋转后的坐标-->
<!--  datatmp.TL = rotatedPoint(centerX, centerY, oleft, otop, rotate);-->
<!--  datatmp.TR = rotatedPoint(centerX, centerY, oleft + owidth, otop, rotate);-->
<!--  datatmp.BL = rotatedPoint(centerX, centerY, oleft, otop + oheight, rotate);-->
<!--  datatmp.BR = rotatedPoint(centerX, centerY, oleft + owidth, otop + oheight, rotate);-->
<!--  //  保存鼠标按下时的当前状态-->
<!--  mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX;-->
<!--  mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY;-->
<!--  mouseClickPosition.value.left = x;-->
<!--  mouseClickPosition.value.right = x + width;-->
<!--  mouseClickPosition.value.top = y;-->
<!--  mouseClickPosition.value.bottom = y + height;-->
<!--  mouseClickPosition.value.width = width;-->
<!--  mouseClickPosition.value.height = height;-->
<!--  // 计算边界-->
<!--  bounds.value = calcResizeLimits();-->
<!--  // 添加事件-->
<!--  addEvent(document.documentElement, eventsFor.move, move);-->
<!--  addEvent(document.documentElement, eventsFor.stop, handleUp);-->
<!--  e.stopPropagation();-->

<!--  return true-->
<!--}-->

<!--// 计算调整大小范围-->
<!--function calcResizeLimits() {-->
<!--  let minW = datatmp.minW;-->
<!--  let minH = datatmp.minH;-->
<!--  let maxW = datatmp.maxW;-->
<!--  let maxH = datatmp.maxH;-->
<!--  const [gridX, gridY] = props.grid;-->
<!--  // 获取矩形信息-->
<!--  const width = datatmp.width;-->
<!--  const height = datatmp.height;-->
<!--  const left = datatmp.left;-->
<!--  const top = datatmp.top;-->
<!--  const right = datatmp.right;-->
<!--  const bottom = datatmp.bottom;-->
<!--  // 对齐网格-->
<!--  maxW = maxW - (maxW % gridX);-->
<!--  maxH = maxH - (maxH % gridY);-->
<!--  const limits = {-->
<!--    minLeft: null,-->
<!--    maxLeft: null,-->
<!--    minTop: null,-->
<!--    maxTop: null,-->
<!--    minRight: null,-->
<!--    maxRight: null,-->
<!--    minBottom: null,-->
<!--    maxBottom: null-->
<!--  };-->
<!--  // 边界限制-->
<!--  if (props.parent) {-->
<!--    limits.minLeft = left;-->
<!--    limits.maxLeft = left + Math.floor((width - minW) / gridX);-->
<!--    limits.minTop = top;-->
<!--    limits.maxTop = top + Math.floor((height - minH) / gridY);-->
<!--    limits.minRight = right;-->
<!--    limits.maxRight = right + Math.floor((width - minW) / gridX);-->
<!--    limits.minBottom = bottom;-->
<!--    limits.maxBottom = bottom + Math.floor((height - minH) / gridY);-->
<!--    if (maxW) {-->
<!--      limits.minLeft = Math.max(limits.minLeft, datatmp.parentWidth - right - maxW);-->
<!--      limits.minRight = Math.max(limits.minRight, datatmp.parentWidth - left - maxW);-->
<!--    }-->
<!--    if (maxH) {-->
<!--      limits.minTop = Math.max(limits.minTop, datatmp.parentHeight - bottom - maxH);-->
<!--      limits.minBottom = Math.max(limits.minBottom, datatmp.parentHeight - top - maxH);-->
<!--    }-->
<!--  } else {-->
<!--    limits.minLeft = null;-->
<!--    limits.maxLeft = left + Math.floor(width - minW);-->
<!--    limits.minTop = null;-->
<!--    limits.maxTop = top + Math.floor(height - minH);-->
<!--    limits.minRight = null;-->
<!--    limits.maxRight = right + Math.floor(width - minW);-->
<!--    limits.minBottom = null;-->
<!--    limits.maxBottom = bottom + Math.floor(height - minH);-->
<!--    if (maxW) {-->
<!--      limits.minLeft = -(right + maxW);-->
<!--      limits.minRight = -(left + maxW);-->
<!--    }-->
<!--    if (maxH) {-->
<!--      limits.minTop = -(bottom + maxH);-->
<!--      limits.minBottom = -(top + maxH);-->
<!--    }-->
<!--    if (props.lockAspectRatio && maxW && maxH) {-->
<!--      limits.minLeft = Math.min(limits.minLeft, -(right + maxW));-->
<!--      limits.minTop = Math.min(limits.minTop, -(maxH + bottom));-->
<!--      limits.minRight = Math.min(limits.minRight, -left - maxW);-->
<!--      limits.minBottom = Math.min(limits.minBottom, -top - maxH);-->
<!--    }-->
<!--  }-->
<!--  return limits;-->
<!--}-->

<!--// 移动-->
<!--function move(e) {-->
<!--  if (datatmp.resizing) {-->
<!--    handleResize(e);-->
<!--  } else if (datatmp.dragging) {-->
<!--    handleDrag(e);-->
<!--  } else if (datatmp.rotating) {-->
<!--    handleRotate(e);-->
<!--  }-->
<!--  e.stopPropagation();-->
<!--  return true;-->
<!--}-->

<!--// 获取鼠标或者触摸点的坐标-->
<!--function getMouseCoordinate(e) {-->
<!--  if (e.type.indexOf("touch") !== -1) {-->
<!--    return {-->
<!--      x: e.changedTouches[0].clientX,-->
<!--      y: e.changedTouches[0].clientY-->
<!--    };-->
<!--  } else {-->
<!--    return {-->
<!--      x: e.pageX || e.clientX + document.documentElement.scrollLeft,-->
<!--      y: e.pageY || e.clientY + document.documentElement.scrollTop-->
<!--    };-->
<!--  }-->
<!--}-->

<!--function handleRotate(e) {-->
<!--  // 获取方向向量，得到旋转角度-->
<!--  const {x: mouseX, y: mouseY} = getMouseCoordinate(e);-->
<!--  const x = mouseX - datatmp.lastCenterX;-->
<!--  const y = mouseY - datatmp.lastCenterY;-->
<!--  // console.log(mouseX, x, datatmp.lastCenterX)-->
<!--  props.data.option.rotate = (getAngle(x, y) + 90) % 360;-->
<!--  console.log(datatmp.lastCenterX)-->
<!--  $emit("rotating", props.data.option.rotate);-->
<!--  // 元素移动-->
<!--}-->

<!--// 元素移动-->
<!--async function handleDrag(e) {-->
<!--  const axis = props.axis;-->
<!--  const grid = props.grid;-->
<!--  // const bounds = bounds.value;-->
<!--  // const mouseClickPosition = mouseClickPosition.value;-->
<!--  // 水平移动-->
<!--  const tmpDeltaX =-->
<!--      axis && axis !== "y" ? mouseClickPosition.value.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0;-->
<!--  // 垂直移动-->
<!--  const tmpDeltaY =-->
<!--      axis && axis !== "x" ? mouseClickPosition.value.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0;-->
<!--  const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, props.scaleRatio);-->
<!--  const left = restrictToBounds(-px2mm(deltaX), bounds.value.minLeft, bounds.value.maxLeft);-->
<!--  const top = restrictToBounds(-px2mm(deltaY), bounds.value.minTop, bounds.value.maxTop);-->
<!--  if (props.onDrag(left, top) === false) {-->
<!--    return;-->
<!--  }-->
<!--  const right = restrictToBounds(-px2mm(deltaX), bounds.value.minRight, bounds.value.maxRight);-->
<!--  const bottom = restrictToBounds(-px2mm(deltaY), bounds.value.minBottom, bounds.value.maxBottom);-->
<!--  // data.left = left;-->
<!--  // data.top = top;-->
<!--  props.data.translateX = left-->
<!--  props.data.translateY = top-->
<!--  datatmp.right = right;-->
<!--  datatmp.bottom = bottom;-->
<!--  // console.log(axis, {...mouseClickPosition.value} ,e.pageY, tmpDeltaY)-->

<!--  await snapCheck();-->
<!--  $emit("dragging", datatmp.left, datatmp.top);-->
<!--}-->

<!--// 外部传参改动x-->
<!--function moveHorizontally(val) {-->
<!--  const [deltaX, _] = snapToGrid(props.grid, val, datatmp.top, datatmp.scale);-->
<!--  const left = restrictToBounds(deltaX, bounds.value.minLeft, bounds.value.maxLeft);-->
<!--  datatmp.left = left;-->
<!--  datatmp.right = datatmp.parentWidth - datatmp.width - left;-->
<!--}-->

<!--// 外部传参改动y-->
<!--function moveVertically(val) {-->
<!--  const [_, deltaY] = snapToGrid(props.grid, datatmp.left, val, datatmp.scale);-->
<!--  const top = restrictToBounds(deltaY, bounds.value.minTop, bounds.value.maxTop);-->
<!--  datatmp.top = top;-->
<!--  datatmp.bottom = datatmp.parentHeight - datatmp.height - top;-->
<!--}-->

<!--// 控制柄移动-->
<!--function handleResize(e) {-->
<!--  const handle = datatmp.handle;-->
<!--  const scaleRatio = props.scaleRatio;-->
<!--  const {TL, TR, BL, BR} = datatmp;-->
<!--  let {x: mouseX, y: mouseY} = getMouseCoordinate(e);-->
<!--  // 在非旋转且有父容器限制的时候，直接限制mouse参与计算的坐标值-->
<!--  if (!props.rotatable && props.parent) {-->
<!--    mouseX = restrictToBounds(mouseX, datatmp.parentX, datatmp.parentX + datatmp.parentWidth * scaleRatio);-->
<!--    mouseY = restrictToBounds(mouseY, datatmp.parentY, datatmp.parentY + datatmp.parentHeight * scaleRatio);-->
<!--  }-->
<!--  // 获取鼠标移动的坐标差-->
<!--  let deltaX = px2mm(mouseX - mouseClickPosition.value.mouseX);-->
<!--  let deltaY = px2mm(mouseY - mouseClickPosition.value.mouseY);-->
<!--  // 考虑放缩-->
<!--  deltaX = deltaX / scaleRatio;-->
<!--  deltaY = deltaY / scaleRatio;-->
<!--  let diffX, diffY, scale, scaleB, scaleC, newX, newY, newW, newH;-->
<!--  let Fixed = {}; // 固定点-->
<!--  let BX = {}; // 高度边选点-->
<!--  let CX = {}; //  宽度边选点-->
<!--  let Va = {}; // 固定点到鼠标 向量-->
<!--  let Vb = {}; // 固定点到投影边  向量-->
<!--  let Vc = {}; // 另一边投影-->
<!--  let Vw = {}; // 宽度向量-->
<!--  let Vh = {}; // 高度向量-->
<!--  // 拖动中点-->
<!--  if (handle.id.includes("m")) {-->
<!--    switch (handle.id) {-->
<!--      case "tm":-->
<!--        diffX = deltaX + (TL.x + TR.x) / 2;-->
<!--        diffY = deltaY + (TL.y + TR.y) / 2;-->
<!--        Fixed = BL;-->
<!--        BX = TL;-->
<!--        CX = BR;-->
<!--        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};-->
<!--        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};-->
<!--        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));-->
<!--        Vw = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};-->
<!--        Vh = {x: Vb.x * scale, y: Vb.y * scale};-->
<!--        break;-->
<!--      case "bm":-->
<!--        diffX = deltaX + (BL.x + BR.x) / 2;-->
<!--        diffY = deltaY + (BL.y + BR.y) / 2;-->
<!--        Fixed = TL;-->
<!--        BX = BL;-->
<!--        CX = TR;-->
<!--        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};-->
<!--        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};-->
<!--        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));-->
<!--        Vw = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};-->
<!--        Vh = {x: Vb.x * scale, y: Vb.y * scale};-->
<!--        break;-->
<!--      case "ml":-->
<!--        diffX = deltaX + (TL.x + BL.x) / 2;-->
<!--        diffY = deltaY + (TL.y + BL.y) / 2;-->
<!--        Fixed = BR;-->
<!--        BX = BL;-->
<!--        CX = TR;-->
<!--        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};-->
<!--        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};-->
<!--        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));-->
<!--        Vh = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};-->
<!--        Vw = {x: Vb.x * scale, y: Vb.y * scale};-->
<!--        break;-->
<!--      case "mr":-->
<!--        diffX = deltaX + (TR.x + TR.x) / 2;-->
<!--        diffY = deltaY + (TR.y + TR.y) / 2;-->
<!--        Fixed = BL;-->
<!--        BX = BR;-->
<!--        CX = TL;-->
<!--        Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};-->
<!--        Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};-->
<!--        scale = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));-->
<!--        Vh = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};-->
<!--        Vw = {x: Vb.x * scale, y: Vb.y * scale};-->
<!--        break;-->
<!--      default:-->
<!--        break;-->
<!--    }-->
<!--    // 反推宽高-->
<!--    newX = Fixed.x + (Vw.x + Vh.x) / 2;-->
<!--    newY = Fixed.y + (Vw.y + Vh.y) / 2;-->
<!--    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2));-->
<!--    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2));-->
<!--  } else {-->
<!--    // 拖动顶点-->
<!--    switch (handle.id) {-->
<!--      case "tl":-->
<!--        diffX = deltaX + TL.x;-->
<!--        diffY = deltaY + TL.y;-->
<!--        Fixed = BR;-->
<!--        BX = BL; // 高度 TL BL-->
<!--        CX = TR; // 宽度 TL TR-->
<!--        break;-->
<!--      case "tr":-->
<!--        diffX = deltaX + TR.x;-->
<!--        diffY = deltaY + TR.y;-->
<!--        Fixed = BL;-->
<!--        BX = BR;-->
<!--        CX = TL;-->
<!--        break;-->
<!--      case "bl":-->
<!--        diffX = deltaX + BL.x;-->
<!--        diffY = deltaY + BL.y;-->
<!--        Fixed = TR;-->
<!--        BX = TL;-->
<!--        CX = BR;-->
<!--        break;-->
<!--      case "br":-->
<!--        diffX = deltaX + BR.x;-->
<!--        diffY = deltaY + BR.y;-->
<!--        Fixed = TL;-->
<!--        BX = TR;-->
<!--        CX = BL;-->
<!--        break;-->
<!--      default:-->
<!--        break;-->
<!--    }-->
<!--    Va = {x: diffX - Fixed.x, y: diffY - Fixed.y};-->
<!--    Vb = {x: BX.x - Fixed.x, y: BX.y - Fixed.y};-->
<!--    Vc = {x: CX.x - Fixed.x, y: CX.y - Fixed.y};-->
<!--    scaleB = (Va.x * Vb.x + Va.y * Vb.y) / (Math.pow(Vb.x, 2) + Math.pow(Vb.y, 2));-->
<!--    scaleC = (Va.x * Vc.x + Va.y * Vc.y) / (Math.pow(Vc.x, 2) + Math.pow(Vc.y, 2));-->
<!--    Vw = {x: Vb.x * scaleB, y: Vb.y * scaleB};-->
<!--    Vh = {x: Vc.x * scaleC, y: Vc.y * scaleC};-->
<!--    // 反推宽高-->
<!--    newX = Fixed.x + (Vw.x + Vh.x) / 2;-->
<!--    newY = Fixed.y + (Vw.y + Vh.y) / 2;-->
<!--    newW = Math.sqrt(Math.pow(Vw.x, 2) + Math.pow(Vw.y, 2));-->
<!--    newH = Math.sqrt(Math.pow(Vh.x, 2) + Math.pow(Vh.y, 2));-->
<!--  }-->
<!--  props.data.translateX = newX - newW / 2 - props.data.x;-->
<!--  props.data.translateY = newY - newH / 2 - props.data.y;-->

<!--  // 父元素限制-->
<!--  if (props.parent) {-->
<!--    newW = restrictToBounds(newW, 0, datatmp.parentWidth);-->
<!--    newH = restrictToBounds(newH, 0, datatmp.parentHeight);-->
<!--  }-->
<!--  // 纵横比限制-->
<!--  if (props.lockAspectRatio) {-->
<!--    // console.log(props.lockAspectRatio, data.aspectFactor);-->
<!--    if (newW / newH > datatmp.aspectFactor) {-->
<!--      newW = newH * datatmp.aspectFactor;-->
<!--    } else {-->
<!--      newH = newW / datatmp.aspectFactor;-->
<!--    }-->
<!--  }-->

<!--  props.data.width = newW;-->
<!--  props.data.height = newH;-->
<!--  $emit("resizing", datatmp.left, datatmp.top, datatmp.width, datatmp.height);-->
<!--}-->

<!--function changeWidth(val) {-->
<!--  const [newWidth, _] = snapToGrid(props.grid, val, 0, datatmp.scale);-->
<!--  // const right = restrictToBounds(-->
<!--  //   data.parentWidth - newWidth - data.left,-->
<!--  //   bounds.value.minRight,-->
<!--  //   bounds.value.maxRight-->
<!--  // );-->
<!--  const right = datatmp.parentWidth - newWidth - datatmp.left;-->
<!--  let bottom = datatmp.bottom;-->
<!--  if (props.lockAspectRatio) {-->
<!--    bottom = datatmp.bottom - (datatmp.right - right) / datatmp.aspectFactor;-->
<!--  }-->
<!--  const width = computeWidth(datatmp.parentWidth, datatmp.left, right);-->
<!--  const height = computeHeight(datatmp.parentHeight, datatmp.top, bottom);-->
<!--  datatmp.right = right;-->
<!--  datatmp.bottom = bottom;-->
<!--  datatmp.width = width;-->
<!--  datatmp.height = height;-->
<!--}-->

<!--function changeHeight(val) {-->
<!--  const [_, newHeight] = snapToGrid(props.grid, 0, val, datatmp.scale);-->
<!--  // const bottom = restrictToBounds(-->
<!--  //   data.parentHeight - newHeight - data.top,-->
<!--  //   bounds.value.minBottom,-->
<!--  //   bounds.value.maxBottom-->
<!--  // );-->
<!--  const bottom = datatmp.parentHeight - newHeight - datatmp.top;-->
<!--  let right = datatmp.right;-->
<!--  if (props.lockAspectRatio) {-->
<!--    right = datatmp.right - (datatmp.bottom - bottom) * datatmp.aspectFactor;-->
<!--  }-->
<!--  const width = computeWidth(datatmp.parentWidth, datatmp.left, right);-->
<!--  const height = computeHeight(datatmp.parentHeight, datatmp.top, bottom);-->
<!--  datatmp.right = right;-->
<!--  datatmp.bottom = bottom;-->
<!--  datatmp.width = width;-->
<!--  datatmp.height = height;-->
<!--}-->

<!--// 从控制柄松开-->
<!--async function handleUp(e) {-->
<!--  datatmp.handle = null;-->
<!--  // 初始化辅助线数据-->
<!--  const temArr = new Array(3).fill({-->
<!--    display: false,-->
<!--    position: "",-->
<!--    origin: "",-->
<!--    lineLength: ""-->
<!--  });-->
<!--  const refLine = {vLine: [], hLine: []};-->
<!--  for (const i in refLine) {-->
<!--    refLine[i] = JSON.parse(JSON.stringify(temArr));-->
<!--  }-->
<!--  // 保存 鼠标松开的坐标-->
<!--  const {x: mouseX, y: mouseY} = getMouseCoordinate(e);-->
<!--  // lastMouseX = mouseX;-->
<!--  // lastMouseY = mouseY;-->
<!--  if (datatmp.resizing) {-->
<!--    datatmp.resizing = false;-->
<!--    await conflictCheck();-->
<!--    $emit("refLineParams", refLine);-->
<!--    $emit("resizestop", datatmp.left, datatmp.top, datatmp.width, datatmp.height);-->
<!--  }-->
<!--  if (datatmp.dragging) {-->
<!--    datatmp.dragging = false;-->
<!--    await conflictCheck();-->
<!--    $emit("refLineParams", refLine);-->
<!--    $emit("dragstop", datatmp.left, datatmp.top);-->
<!--  }-->
<!--  if (datatmp.rotating) {-->
<!--    datatmp.rotating = false;-->
<!--    $emit("rotatestop", props.data.option.rotate);-->
<!--  }-->
<!--  computeTranslate(props.data)-->
<!--  resetBoundsAndMouseState();-->
<!--  removeEvent(document.documentElement, eventsFor.move, move);-->
<!--  removeEvent(document.documentElement, eventsFor.stop, handleUp);-->
<!--  // console.log("点击")-->
<!--  mitt.emit('elementClick', props.data)-->
<!--  // props.data.status = 'HANDLE'-->
<!--  // mitt.emit('elementUp', props.data)-->

<!--}-->

<!--// 新增方法 ↓↓↓-->
<!--// 设置属性-->
<!--function settingAttribute() {-->
<!--  // 设置冲突检测-->
<!--  dRef.value.setAttribute("data-is-check", `${props.isConflictCheck}`);-->
<!--  // 设置对齐元素-->
<!--  dRef.value.setAttribute("data-is-snap", `${props.snap}`);-->
<!--}-->

<!--// 冲突检测-->
<!--function conflictCheck() {-->
<!--  const top = datatmp.top;-->
<!--  const left = datatmp.left;-->
<!--  const width = datatmp.width;-->
<!--  const height = datatmp.height;-->
<!--  if (props.isConflictCheck) {-->
<!--    const nodes = dRef.value.parentNode.childNodes; // 获取当前父节点下所有子节点-->
<!--    for (const item of nodes) {-->
<!--      if (-->
<!--          item.className !== undefined &&-->
<!--          !item.className.split(" ").includes(props.classNameActive) &&-->
<!--          item.getAttribute("data-is-check") !== null &&-->
<!--          item.getAttribute("data-is-check") !== "false"-->
<!--      ) {-->
<!--        const tw = item.offsetWidth;-->
<!--        const th = item.offsetHeight;-->
<!--        // 正则获取left与right-->
<!--        const [tl, tt] = formatTransformVal(item.style.transform);-->
<!--        // 左上角与右下角重叠-->
<!--        const tfAndBr =-->
<!--            (top >= tt && left >= tl && tt + th > top && tl + tw > left) ||-->
<!--            (top <= tt && left < tl && top + height > tt && left + width > tl);-->
<!--        // 右上角与左下角重叠-->
<!--        const brAndTf =-->
<!--            (left <= tl && top >= tt && left + width > tl && top < tt + th) ||-->
<!--            (top < tt && left > tl && top + height > tt && left < tl + tw);-->
<!--        // 下边与上边重叠-->
<!--        const bAndT =-->
<!--            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||-->
<!--            (top >= tt && left <= tl && top < tt + th && left > tl + tw);-->
<!--        // 上边与下边重叠（宽度不一样）-->
<!--        const tAndB =-->
<!--            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||-->
<!--            (top >= tt && left <= tl && top < tt + th && left > tl + tw);-->
<!--        // 左边与右边重叠-->
<!--        const lAndR =-->
<!--            (left >= tl && top >= tt && left < tl + tw && top < tt + th) ||-->
<!--            (top > tt && left <= tl && left + width > tl && top < tt + th);-->
<!--        // 左边与右边重叠（高度不一样）-->
<!--        const rAndL =-->
<!--            (top <= tt && left >= tl && top + height > tt && left < tl + tw) ||-->
<!--            (top >= tt && left <= tl && top < tt + th && left + width > tl);-->
<!--        // 如果冲突，就将回退到移动前的位置-->
<!--        if (tfAndBr || brAndTf || bAndT || tAndB || lAndR || rAndL) {-->
<!--          datatmp.top = mouseClickPosition.value.top;-->
<!--          datatmp.left = mouseClickPosition.value.left;-->
<!--          datatmp.width = mouseClickPosition.value.width;-->
<!--          datatmp.height = mouseClickPosition.value.height;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--// 检测对齐元素-->
<!--async function snapCheck() {-->
<!--  if (props.snap) {-->
<!--    // 保存当前元素的四个属性-->
<!--    let width = datatmp.width;-->
<!--    let height = datatmp.height;-->
<!--    let activeLeft = datatmp.left;-->
<!--    let activeRight = datatmp.left + width;-->
<!--    let activeTop = datatmp.top;-->
<!--    let activeBottom = datatmp.top + height;-->
<!--    // 初始化辅助线数据-->
<!--    const temArr = new Array(3).fill({-->
<!--      display: false,-->
<!--      position: "",-->
<!--      origin: "",-->
<!--      lineLength: ""-->
<!--    });-->
<!--    const refLine = {vLine: [], hLine: []};-->
<!--    for (const i in refLine) {-->
<!--      refLine[i] = JSON.parse(JSON.stringify(temArr));-->
<!--    }-->
<!--    const tem = {-->
<!--      value: {x: [[], [], []], y: [[], [], []]},-->
<!--      display: [],-->
<!--      position: []-->
<!--    };-->
<!--    // 获取当前父节点下所有子节点-->
<!--    const nodes = dRef.value.parentNode.childNodes;-->
<!--    //  当允许多个同时激活时，获取总体的属性-->
<!--    const {groupWidth, groupHeight, groupLeft, groupTop, bln} = await getActiveAll(nodes);-->
<!--    if (!bln) {-->
<!--      width = groupWidth;-->
<!--      height = groupHeight;-->
<!--      activeLeft = groupLeft;-->
<!--      activeRight = groupLeft + groupWidth;-->
<!--      activeTop = groupTop;-->
<!--      activeBottom = groupTop + groupHeight;-->
<!--    }-->
<!--    // 遍历获取其他元素的属性-->
<!--    for (const item of nodes) {-->
<!--      if (-->
<!--          item.className !== undefined &&-->
<!--          !item.className.split(" ").includes(props.classNameActive) &&-->
<!--          item.getAttribute("data-is-snap") !== null &&-->
<!--          item.getAttribute("data-is-snap") !== "false"-->
<!--      ) {-->
<!--        // 获取位置，角度-->
<!--        const [l, t, rotate] = formatTransformVal(item.style.transform);-->
<!--        if ((rotate - props.data.option.rotate) % 90 === 0) {-->
<!--          // 获取宽高-->
<!--          const w = item.offsetWidth;-->
<!--          const h = item.offsetHeight;-->
<!--          // 计算得到right和bottom-->
<!--          const r = l + w; // 对齐目标right-->
<!--          const b = t + h; // 对齐目标的bottom-->
<!--          const hc = Math.abs(activeTop + height / 2 - (t + h / 2)) <= props.snapTolerance; // 水平中线-->
<!--          const vc = Math.abs(activeLeft + width / 2 - (l + w / 2)) <= props.snapTolerance; // 垂直中线-->
<!--          const ts = Math.abs(t - activeBottom) <= props.snapTolerance; // 从上到下-->
<!--          const TS = Math.abs(b - activeBottom) <= props.snapTolerance; // 从上到下-->
<!--          const bs = Math.abs(t - activeTop) <= props.snapTolerance; // 从下到上 上边共线-->
<!--          const BS = Math.abs(b - activeTop) <= props.snapTolerance; // 从下到上-->
<!--          const ls = Math.abs(l - activeRight) <= props.snapTolerance; // 外左-->
<!--          const LS = Math.abs(r - activeRight) <= props.snapTolerance; // 外左-->
<!--          const rs = Math.abs(l - activeLeft) <= props.snapTolerance; // 外右-->
<!--          const RS = Math.abs(r - activeLeft) <= props.snapTolerance; // 外右-->
<!--          tem.display = [ts, TS, bs, BS, hc, hc, ls, LS, rs, RS, vc, vc];-->
<!--          tem.position = [t, b, t, b, t + h / 2, t + h / 2, l, r, l, r, l + w / 2, l + w / 2];-->
<!--          // 单个可激活元素与其他元素对齐-->
<!--          if (bln) {-->
<!--            if (ts) {-->
<!--              datatmp.top = t - height;-->
<!--              datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              tem.value.y[0].push(l, r, activeLeft, activeRight);-->
<!--            }-->
<!--            if (bs) {-->
<!--              datatmp.top = t;-->
<!--              datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              tem.value.y[0].push(l, r, activeLeft, activeRight);-->
<!--            }-->
<!--            if (TS) {-->
<!--              datatmp.top = b - height;-->
<!--              datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              tem.value.y[1].push(l, r, activeLeft, activeRight);-->
<!--            }-->
<!--            if (BS) {-->
<!--              datatmp.top = b;-->
<!--              datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              tem.value.y[1].push(l, r, activeLeft, activeRight);-->
<!--            }-->
<!--            if (ls) {-->
<!--              datatmp.left = l - width;-->
<!--              datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              tem.value.x[0].push(t, b, activeTop, activeBottom);-->
<!--            }-->
<!--            if (rs) {-->
<!--              datatmp.left = l;-->
<!--              datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              tem.value.x[0].push(t, b, activeTop, activeBottom);-->
<!--            }-->
<!--            if (LS) {-->
<!--              datatmp.left = r - width;-->
<!--              datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              tem.value.x[1].push(t, b, activeTop, activeBottom);-->
<!--            }-->
<!--            if (RS) {-->
<!--              datatmp.left = r;-->
<!--              datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              tem.value.x[1].push(t, b, activeTop, activeBottom);-->
<!--            }-->
<!--            if (hc) {-->
<!--              datatmp.top = t + h / 2 - height / 2;-->
<!--              datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              tem.value.y[2].push(l, r, activeLeft, activeRight);-->
<!--            }-->
<!--            if (vc) {-->
<!--              datatmp.left = l + w / 2 - width / 2;-->
<!--              datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              tem.value.x[2].push(t, b, activeTop, activeBottom);-->
<!--            }-->
<!--            // 和容器贴边-->
<!--            if (props.snapBorder) {-->
<!--              if (Math.abs(datatmp.left - 0) <= props.snapTolerance) {-->
<!--                datatmp.left = 0;-->
<!--                datatmp.right = datatmp.parentWidth - datatmp.left - width;-->
<!--              }-->
<!--              if (Math.abs(datatmp.right - 0) <= props.snapTolerance) {-->
<!--                datatmp.right = 0;-->
<!--                datatmp.left = datatmp.parentWidth - datatmp.width - datatmp.right;-->
<!--              }-->
<!--              if (Math.abs(datatmp.top - 0) <= props.snapTolerance) {-->
<!--                datatmp.top = 0;-->
<!--                datatmp.bottom = datatmp.parentHeight - datatmp.top - height;-->
<!--              }-->
<!--              if (Math.abs(datatmp.bottom - 0) <= props.snapTolerance) {-->
<!--                datatmp.bottom = 0;-->
<!--                datatmp.top = datatmp.parentHeight - datatmp.bottom - height;-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--          // 再次进行边界处理-->
<!--          datatmp.left = restrictToBounds(datatmp.left, bounds.value.minLeft, bounds.value.maxLeft);-->
<!--          datatmp.top = restrictToBounds(datatmp.top, bounds.value.minTop, bounds.value.maxTop);-->
<!--          datatmp.right = restrictToBounds(datatmp.right, bounds.value.minRight, bounds.value.maxRight);-->
<!--          datatmp.bottom = restrictToBounds(datatmp.bottom, bounds.value.minBottom, bounds.value.maxBottom);-->
<!--          // 辅助线坐标与是否显示(display)对应的数组,易于循环遍历-->
<!--          const arrTem = [0, 1, 0, 1, 2, 2, 0, 1, 0, 1, 2, 2];-->
<!--          for (let i = 0; i <= arrTem.length; i++) {-->
<!--            // 前6为Y辅助线,后6为X辅助线-->
<!--            const xory = i < 6 ? "y" : "x";-->
<!--            const horv = i < 6 ? "hLine" : "vLine";-->
<!--            if (tem.display[i]) {-->
<!--              const {origin, length} = calcLineValues(tem.value[xory][arrTem[i]]);-->
<!--              refLine[horv][arrTem[i]].display = tem.display[i];-->
<!--              refLine[horv][arrTem[i]].position = tem.position[i] + "px";-->
<!--              refLine[horv][arrTem[i]].origin = origin;-->
<!--              refLine[horv][arrTem[i]].lineLength = length;-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    // console.log(refLine)-->
<!--    $emit("refLineParams", refLine);-->
<!--  }-->
<!--}-->

<!--// 计算参考线-->
<!--function calcLineValues(arr) {-->
<!--  const length = Math.max(...arr) - Math.min(...arr) + "px";-->
<!--  const origin = Math.min(...arr) + "px";-->
<!--  return {length, origin};-->
<!--}-->

<!--async function getActiveAll(nodes) {-->
<!--  const activeAll = [];-->
<!--  const XArray = [];-->
<!--  const YArray = [];-->
<!--  let groupWidth = 0;-->
<!--  let groupHeight = 0;-->
<!--  let groupLeft = 0;-->
<!--  let groupTop = 0;-->
<!--  for (const item of nodes) {-->
<!--    // 修复判断条件 split(' ')-->
<!--    if (item.className !== undefined && item.className.split(" ").includes(props.classNameActive)) {-->
<!--      activeAll.push(item);-->
<!--    }-->
<!--  }-->
<!--  const AllLength = activeAll.length;-->
<!--  if (AllLength > 1) {-->
<!--    for (const i of activeAll) {-->
<!--      const l = i.offsetLeft;-->
<!--      const r = l + i.offsetWidth;-->
<!--      const t = i.offsetTop;-->
<!--      const b = t + i.offsetHeight;-->
<!--      XArray.push(l, r);-->
<!--      YArray.push(t, b);-->
<!--    }-->
<!--    groupWidth = Math.max(...XArray) - Math.min(...XArray);-->
<!--    groupHeight = Math.max(...YArray) - Math.min(...YArray);-->
<!--    groupLeft = Math.min(...XArray);-->
<!--    groupTop = Math.min(...YArray);-->
<!--  }-->
<!--  const bln = AllLength === 1;-->
<!--  return {groupWidth, groupHeight, groupLeft, groupTop, bln};-->
<!--}-->

<!--// 修复 正则获取left与top  string.match(/[\d|\.]+/g)-->
<!--function formatTransformVal(string) {-->
<!--  let [left, top, rotate = 0] = string.match(/[\d|\.]+/g);-->
<!--  if (top === undefined) top = 0;-->
<!--  return [Number(left), Number(top), rotate];-->
<!--}-->


<!--watch(() => props.active, (val) => {-->
<!--  datatmp.enabled = val;-->
<!--  if (val) {-->
<!--    updateParentSize();-->
<!--    $emit("activated");-->
<!--  } else {-->
<!--    $emit("deactivated");-->
<!--  }-->
<!--})-->
<!--watch(() => props.data.x, (val) => {-->
<!--  if (datatmp.resizing || datatmp.dragging) {-->
<!--    return;-->
<!--  }-->
<!--  if (props.parent) {-->
<!--    bounds.value = calcDragLimits();-->
<!--  }-->
<!--  moveHorizontally(val);-->
<!--})-->
<!--watch(() => props.data.y, (val) => {-->
<!--  if (datatmp.resizing || datatmp.dragging) {-->
<!--    return;-->
<!--  }-->
<!--  if (props.parent) {-->
<!--    bounds.value = calcDragLimits();-->
<!--  }-->
<!--  moveVertically(val);-->
<!--})-->
<!--watch(() => props.z, (val) => {-->
<!--  if (val >= 0 || val === "auto") {-->
<!--    datatmp.zIndex = val;-->
<!--  }-->
<!--})-->
<!--// 新增 监听外部传入参数  旋转角度-->
<!--watch(() => props.r, (val) => {-->
<!--  if (val >= 0) {-->
<!--    props.data.option.rotate = val % 360;-->
<!--  }-->
<!--})-->
<!--// 锁定纵横比-->
<!--watch(() => props.lockAspectRatio, (val) => {-->
<!--  if (val) {-->
<!--    if (props.outsideAspectRatio) {-->
<!--      datatmp.aspectFactor = props.outsideAspectRatio;-->
<!--    } else {-->
<!--      datatmp.aspectFactor = datatmp.width / datatmp.height;-->
<!--    }-->
<!--  } else {-->
<!--    datatmp.aspectFactor = undefined;-->
<!--  }-->
<!--})-->
<!--// 自定义纵横比-->
<!--watch(() => props.outsideAspectRatio, (val) => {-->
<!--  if (val) {-->
<!--    datatmp.aspectFactor = val;-->
<!--  }-->
<!--})-->
<!--watch(() => props.minWidth, (val) => {-->
<!--  if (val > 0 && val <= datatmp.width) {-->
<!--    datatmp.minW = val;-->
<!--  }-->
<!--})-->
<!--watch(() => props.minHeight, (val) => {-->
<!--  if (val > 0 && val <= datatmp.height) {-->
<!--    datatmp.minH = val;-->
<!--  }-->
<!--})-->
<!--watch(() => props.maxWidth, (val) => {-->
<!--  datatmp.maxW = val;-->
<!--})-->
<!--watch(() => props.maxHeight, (val) => {-->
<!--  datatmp.maxH = val;-->
<!--})-->
<!--watch(() => props.w, (val) => {-->
<!--  if (datatmp.resizing || datatmp.dragging) {-->
<!--    return;-->
<!--  }-->
<!--  if (props.parent) {-->
<!--    bounds.value = calcResizeLimits();-->
<!--  }-->
<!--  changeWidth(val);-->
<!--})-->
<!--watch(() => props.h, (val) => {-->
<!--  if (datatmp.resizing || datatmp.dragging) {-->
<!--    return;-->
<!--  }-->
<!--  if (props.parent) {-->
<!--    bounds.value = calcResizeLimits();-->
<!--  }-->
<!--  changeHeight(val);-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->
<!--.vdr {-->
<!--  touch-action: none;-->
<!--  position: absolute;-->
<!--  box-sizing: border-box;-->
<!--  border: 1px dashed;-->
<!--}-->

<!--.drag {-->
<!--  position: absolute;-->
<!--}-->

<!--.bg {-->
<!--  cursor: move;-->
<!--  top: 0;-->
<!--  position: absolute;-->
<!--}-->

<!--.select {-->
<!--  top: 0;-->
<!--  position: absolute;-->
<!--  border: dashed 1px var(&#45;&#45;drag-h-color);-->
<!--  box-sizing: border-box;-->
<!--  overflow: hidden;-->
<!--  pointer-events: none;-->
<!--  opacity: 0.2;-->
<!--}-->

<!--.noSelect {-->
<!--  opacity: 1;-->
<!--}-->

<!--.handle {-->
<!--  background: var(&#45;&#45;drag-h-color);-->
<!--  position: absolute;-->
<!--}-->

<!--.remove {-->
<!--  height: 4mm;-->
<!--  background: red;-->
<!--  width: 4mm;-->
<!--  position: absolute;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.bg-none {-->
<!--  background: none;-->
<!--}-->

<!--.t {-->
<!--  box-sizing: border-box;-->
<!--  top: -1px;-->
<!--  border-top: solid 3px var(&#45;&#45;drag-h-color);-->
<!--}-->

<!--.l {-->
<!--  box-sizing: border-box;-->
<!--  left: -1px;-->
<!--  border-left: solid 3px var(&#45;&#45;drag-h-color);-->
<!--}-->

<!--.r {-->
<!--  box-sizing: border-box;-->
<!--  right: -1px;-->
<!--  border-right: solid 3px var(&#45;&#45;drag-h-color);-->
<!--}-->

<!--.b {-->
<!--  box-sizing: border-box;-->
<!--  bottom: -1px;-->
<!--  border-bottom: solid 3px var(&#45;&#45;drag-h-color);-->
<!--}-->

<!--.center {-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--  position: absolute;-->
<!--}-->

<!--.center:before {-->
<!--  content: ' ';-->
<!--  width: 1px;-->
<!--  height: 6px;-->
<!--  position: absolute;-->
<!--  background: var(&#45;&#45;drag-h-color);-->
<!--  left: 0;-->
<!--  top: -3px;-->
<!--  transform: translateX(-50%);-->
<!--}-->

<!--.center:after {-->
<!--  content: ' ';-->
<!--  width: 6px;-->
<!--  height: 1px;-->
<!--  position: absolute;-->
<!--  background: var(&#45;&#45;drag-h-color);-->
<!--  left: -3px;-->
<!--  top: 0;-->
<!--  transform: translateY(-50%);-->
<!--}-->

<!--.rotate {-->
<!--  position: absolute;-->
<!--  top: -18px;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  width: 7px;-->
<!--  height: 7px;-->
<!--  border-radius: 50%;-->
<!--  background: var(&#45;&#45;drag-h-color);-->
<!--  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURUdwTP///9XV1R0dHf///3Nzc////////////////1ZWVq+vr/T09PX19QQEBP///////8XFxf///////////wYGBv///+jo6P///4aGhqioqMzMzP///2BgYP///////////zExMf///wAAAP///xLps0AAAAAjdFJOUwCxxOdixRDmzSDMv8/Z+tz5wWpXWPk3zALCv8KnyXZVMNuNPnv3CwAAAJ1JREFUKM/NkckOwyAMRFkDBMhC9qWr+//fWCIV1WlzrjoXS36yxmMT8hdqqKoUvRAjMtw22kvecem1GjTuK1vApmI+wQMBbQFy5li+QQRaX4AtRX+vbntAJeRl9HTTx4TiwESs61DXNUPmVQeujzVrQwh43TTxpeRBslVfMUhbiXKWyiAwvnIsMcdyJkfJYdpNvG/ltDm+bjP+8KFP8ggL+zQLGxwAAAAASUVORK5CYII=) 14 14, alias;-->
<!--}-->

<!--.rotate:after {-->
<!--  content: ' ';-->
<!--  height: 12px;-->
<!--  width: 1px;-->
<!--  border-right: var(&#45;&#45;drag-h-color) dashed 1px;-->
<!--  position: absolute;-->
<!--  left: 2px;-->
<!--  top: 6px;-->
<!--}-->
<!--</style>-->
