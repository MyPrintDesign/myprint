export interface Option {
    type: string;
    label: string;
}

export interface Provider {
    name: string;
    pageUnit: PageUnit;
    pageSize: string;
    width: number;
    height: number;
    watermark: boolean;
    watermarkContent: string;
    dragSnapPanelIs: number;
    dragSnapIs: number;
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

export interface Id {
    id: string;
}

export interface Point {
    x: number;
    y: number;
}

export interface Rect extends Point {
    width: number;
    height: number;
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

export interface MyAuxiliaryLine extends Point, Id {
    direction: 'vertical' | 'horizontal';
}

export interface Line {
    start: Point;
    end: Point;
}

export interface Container extends Rect, ElementRelation, Id {
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
    // 辅助线列表
    auxiliaryLineList: MyAuxiliaryLine[];
}


export interface PreviewWrapper extends MyElement, TableCellElement, PreviewContainerWrapper {
    offsetLastElementTop: number;
    heightIs: boolean;
    tableHeadHiddenIs: boolean;
    previewTableRowIndex: number;
    target: any;
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

    DrawPanel: '画板'


    // 私有类型
};

export const displayStrategyFormat = {
    'none': '不显示',
    'firstPage': '首页',
    'lastPage': '尾页',
    'oddPage': '奇数',
    'evenPage': '偶数'
};

export type displayStrategy = keyof typeof displayStrategyFormat

export const cellTypeFormat = {
    Head: '表头',
    Body: '表体',
    Statistics: '统计行'
};
//统计类型
export const statisticsTypeFormat = {
    Sum: '求和',
    Avg: '平均值',
    Count: '计数',
    DistinctCount: '去重计数',
    Max: '最大值',
    Min: '最小值',
    CustomFormula: '自定义公式'
};

export type DisplayModel = 'design' | 'preview'
export type PageUnit = 'px' | 'mm' | 'cm' | 'in'

export type elementType = keyof typeof elementTypeFormat
export type cellType = keyof typeof cellTypeFormat
export type statisticsType = keyof typeof statisticsTypeFormat

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

// export interface DataTableRow {
//     type: 'HEAD' | 'DATA' | 'STATS';
//     columnList: MyElement[];
// }

export interface MyElement extends Container {
    contentType?: textContentType;
    field: string;
    enable?: number;
    label?: string;
    data?: any;

    option: ElementOption;
    svgOption: ElementSvgOption;

    /* data-table - start*/
    columnBody: TableCellElement;
    columnList: TableHeadProviderCellElement[];
    tableHeadList: TableCellElement[][];
    tableBodyList: TableCellElement[][];
    // 数据行合并单元格-预留
    // 统计行
    statisticsList: TableStatisticsCellElement[][];
    /* data-table - end*/

    /* custom-table - start*/
    rowList: TableCellElement[][];
    /* custom-table - end*/

    // columnOption: ElementSvgOption;
    // bodyOption: ElementSvgOption;
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

export interface TableHeadProviderCellElement extends Rect, Id {
    type: elementType;
    contentType?: textContentType;
    field?: string;
    enable?: number;
    label?: string;
    data?: any;

    columnBody: TableCellElement;

    option: ElementOption;

    rowspan: number;
    colspan: number;

    columnList: Array<TableHeadProviderCellElement>;
}

export interface TableCellElement extends MyElement {
    rowspan: number;
    colspan: number;
}

export interface TableStatisticsCellElement extends TableCellElement {
    statisticsType: statisticsType;
    everyPageStatisticsIs: boolean;
    tableStatisticsIs: boolean;

    // 预留值
    customFormula: string;
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
    cellParent: TableCellElement;
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
    cellType: cellType;

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
    // 换行
    lineBreak: number;
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

    tableBodyBgStyleType: 'NONE' | 'COMMON' | 'CUSTOM';

    tablePageHeadIs: boolean;

    tableBodyHeightType: 'FIXED' | 'AUTO';
    tableBodyHeight: number;
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
