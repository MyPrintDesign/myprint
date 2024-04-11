export interface Option {
    type: string;
    label: string;
}

export interface Provider {
    width: number;
    height: number;
    pageUnit: PageUnit;
    elementList: MyElement[];
}

export interface Design {
    scale: number;
}

/**
 * 节点关系
 */
export interface ElementRelation {
    elementList: MyElement[];
}

export interface Point {
    x: number;
    y: number;
}

export interface SvgData {
    points: Point[];
    controlPoints: Point[];
}

export interface PointLabel extends Point {
    label?: string;
    type: 'control' | 'virtual' | 'rotate';
    insertIndex: number;
}

export interface PointClick extends Point {
    clickTimestamp: number;
}

export interface Line {
    start: Point;
    end: Point;
}

export interface Container extends Point, ElementRelation {
    id: string;
    // status: string;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    type: elementType;
    visibility: 'visible' | 'hidden';

    /**
     * 运行时配置
     */
    runtimeOption: RuntimeElementOption;
}

export interface Panel extends Container {
    name: string;
    width: number;
    height: number;
    pageSize: string;
    pageUnit: PageUnit;
    watermark: boolean;
    watermarkContent: string;
    dragSnapPanelIs: number;
    dragSnapIs: number;
    design: Design;
    orientation?: 'p' | 'portrait' | 'l' | 'landscape';
    pageHeader?: MyElement;
    pageFooter?: MyElement;
    groupList: string[][];
}


export interface PreviewWrapper extends MyElement, PreviewContainerWrapper {
    offsetLastElementTop: number;
    heightIs: boolean;
    tableRowIndex: number;
    previewWrapperList: PreviewWrapper[];
}


export interface PreviewContainerWrapper extends MyElement {
    offsetTop: number;
}

export interface DragWrapper {
    dragIng: boolean
    type: string
    element: MyElement,
    start: Position
    end: Position
}

// 节点类型
export const elementTypeFormat = {
    Panel: '面板',
    Text: '文本',
    TextTime: '时间文本',
    Image: '图片',
    DataTable: '数据表格',
    FREETable: '自由表格',
    Rect: '矩形',
    HorizontalLine: '横线',
    DottedHorizontalLine: '横虚线',
    VerticalLine: '竖线',
    DottedVerticalLine: '竖虚线',
    Container: '容器',
    PageHeader: '页眉',
    PageFooter: '页脚',
    PageNum: '页数',

    SvgPolygonLine: '多边形',
    SvgLine: '线',
    SvgBezierCurve: '曲线',
    SvgBezierCurveThree: '曲线3',
    SvgCircle: '圆',
    SvgEllipse: '椭圆',

    DrawPanel: '画板',


    // 私有类型
    PrivateDragRectElement: '内置框选'
};

export const displayStrategyFormat = {
    'none': '不显示',
    'firstPage': '首页',
    'lastPage': '尾页',
    'oddPage': '奇数',
    'evenPage': '偶数'
};

export type displayStrategy = keyof typeof displayStrategyFormat

export const tableTrTypeFormat = {
    Head: '',
    Body: ''
};

export type DisplayModel = 'design' | 'preview'
export type PageUnit = 'px' | 'mm' | 'cm' | 'in'

export type elementType = keyof typeof elementTypeFormat
export type tableTrType = keyof typeof tableTrTypeFormat

type textContentType =
    'Text'
    | 'Barcode'
    | 'QrCode'

// 节点状态
export type elementStatus = 'NONE' | 'SELECT' | 'SELECT_REMOVE' | 'HANDLE' | 'HANDLE_ED' | 'HANDLE_EDIT_ING'

type textAlign = 'start' | 'center' | 'end'

export interface HandlePanel {
    icon: string;
    label: string;
    visible: boolean;
}

export interface HandlePanelPosition extends Container {
    right: number;
}

export interface MyElement extends Container {
    contentType?: textContentType;
    field?: string;
    enable?: number;
    label?: string;
    data?: any;

    headList: MyElement[];
    bodyList: MyElement[][];
    columnBody: MyElement;
    option: ElementOption;
    svgOption: ElementSvgOption;

    columnOption: ElementSvgOption;
    bodyOption: ElementSvgOption;
    // previewRuntimeOption: {
    //     heightIs: boolean
    // }
    /**
     * 是否锁定
     */
    lock?: number;

    /**
     * 是否组合
     */
    groupIs?: boolean;
}

export interface TextElement extends MyElement {
    labelOption?: ElementOption;
    contentType: textContentType;
}

/**
 * 运行时参数，不提交后台
 */
export interface RuntimeElementOption extends Position {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    translate: Point;
    bounds: Position;
    parent?: Container;
    target: any;
    rotate: number;
    // 组件实时位置
    init: Container;
    status: elementStatus;
    cutIngIs: boolean;

    /**
     * 工作环境，如果是在表格中，填充满整个cell
     */
    workEnvironment: elementType;
    tableTrType: tableTrType;

    // 是否拖拽进入
    dragInIs: boolean;

    // 下标
    index: number;
}

export interface ElementOption {
    barCodeType: string;
    barCodeDisplayValIs: boolean;
    // aspectRatio: number;
    keepRatio: boolean;
    // 固定位置打印
    fixed: boolean;
    fontFamily: string;
    fontSize: number;
    opacity: number;
    color: string;
    background: 'none';
    bold: boolean;
    underline: boolean;
    lineThrough: boolean;
    italic: boolean;
    borderAll: boolean;
    borderWidth: number;
    lineWidth: number;
    rotate: number;
    // textType: string;
    textAlign: textAlign;
    verticalAlign: textAlign;
    lineBreak: boolean;
    lineHeight: number;
    dottedStyle: 'dotted' | 'dashed';
    sort: number;
    hiddenLabel: boolean;
    labelSplit: boolean;
    disableSort: boolean;
    disableEnable: boolean;
    enable: boolean;
    padding: Position;
    margin: Position;
    formatter?: string;

    // 显示策略
    displayStrategy?: displayStrategy;

    tableHeightType: 'FIXED' | 'AUTO';
}

export interface ElementSvgOption {
}

export interface Position extends Point {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ContentScaleVo {
    viewport: Container;
    miniMap: Container;
    scale: number;
    openIs: boolean;
    width: number;
    height: number;
}


export interface FormatterVariable {
    pageIndex: number,
    pageSize: number,
    nowDate?: Date
}

export type MyHtmlElement = HTMLElement & {
    element: MyElement
}

export interface DownList {
    label: string,
    value: any,
    enable?: boolean,
    click?: () => void,
    icon?: string
}
