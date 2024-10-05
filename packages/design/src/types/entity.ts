import { Module, SaveResult, Template } from '@myprint/design/types/R';
import { i18n } from '@myprint/design/locales';

export interface PrintOptions {
    taskId?: string,
    panel?: Panel | string,
    previewDataList?: any[],

    title?: string,
    timeout?: number,

    file?: Blob | ArrayBuffer | Uint8Array | string,
    html?: string,
    css?: string,
    printer?: string,

    // 支持MyPrint客户端、windows原生、windows直连
    orientation?: 'portrait' | 'landscape' | 'auto', // 打印方向
    // 支持MyPrint客户端、windows直连，macos直连
    swapWidthHeight?: boolean, // 是否交换宽高
    // 支持MyPrint客户端、windows直连，macos直连
    pageSize?: string, // 打印file 时使用
    // 支持MyPrint客户端
    width?: number,// 单位毫米
    // 支持MyPrint客户端
    height?: number, //高 单位毫米
    // 支持MyPrint客户端、windows直连，macos直连
    copies?: number, //打印份数
    // 打印文件时使用（例如pdf）
    scale?: 'fit',
    // 支持MyPrint客户端、windows直连，macos直连
    scaleFactor?: number,
    printBackground?: boolean, // 是否打印背景
    color?: boolean, // 是否打印颜色

    /**
     * 支持MyPrint客户端、windows直连，macos直连
     * 双面打印 | 单面打印
     */
    duplexMode?: 'duplex' | 'simplex',
    // 支持MyPrint客户端
    dpi?: any
}

export interface DesignPanelProps {
    template?: Template;
    saveTemplate?: (template: Template) => Promise<SaveResult>;
    module?: Module;
    height?: string;
    generateImg?: boolean;
    showBackButton?: boolean;
    showPrintButton?: boolean;
    showDownloadPdfButton?: boolean;
    showPreviewButton?: boolean;
    showClearButton?: boolean;
    showSaveButton?: boolean;
}

export interface MyPrintConfig {
    serverUrl?: string;
    clientUrl?: string;
    disabledClient?: boolean;
}

export interface PrintResult {
    status: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'CLOSE';
    msg?: string,
    blob?: Blob,
    blobList?: Blob[],
    type: 'CHROME_PRINT' | 'TIMEOUT' | 'CLIENT_PRINT' | 'CHROME_GENERATE_PDF' | 'CHROME_GENERATE_IMG' | 'SERVER_GENERATE_IMG' | 'CLIENT_GENERATE_PDF' | 'SERVER_GENERATE_PDF' | 'CLOSE';
}

export interface ClientCmd {
    taskId: string;
    cmd: 'print' | 'printerList' | 'generatePdf' | 'generatePdfResult' | 'printResult' | 'ping' | 'text/css',
    options?: PrintOptions
}

export interface ClientResult {
    taskId: string;
    cmd: 'print' | 'printerList' | 'generatePdf' | 'generatePdfResult' | 'printResult' | 'pong',
    data?: Buffer | any,
    status?: 'SUCCESS' | 'ERROR',
    msg?: string
}

export interface Printer {

    /**
     * a longer description of the printer's type.
     */
    description: string;
    /**
     * the name of the printer as shown in Print Preview.
     */
    displayName: string;
    /**
     * whether or not a given printer is set as the default printer on the OS.
     */
    isDefault: boolean;
    /**
     * the name of the printer as understood by the OS.
     */
    name: string;
    /**
     * an object containing a variable number of platform-specific printer information.
     */
    options: any;
    /**
     * the current status of the printer.
     */
    status: number;
}

export interface Provider {
    name: string;
    pageUnit: PageUnit;
    fontSizeUnit: FontSizeUnit;
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
    runtimeOption: RuntimeElementOption;
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
    fontSizeUnit: FontSizeUnit;
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

export interface PreviewContext {
    autoPageIs: boolean,
    currentPreview: PreviewWrapper
    previewData: any
    panel: Panel
    pageList: PreviewContainerWrapper[]
    currentPage: PreviewContainerWrapper
    top: number
    bottom: number
    pagingRepetition: boolean
}

export interface PreviewWrapper extends MyElement, TableCellElement, PreviewContainerWrapper {
    offsetLastElementTop: number;
    heightIs: boolean;
    tableHeadHiddenIs: boolean;
    previewTableRowIndex: number;
    target: any;
}

export interface PreviewContainerWrapper extends MyElement {
    offsetTop: number;
    previewWrapperList: PreviewWrapper[];
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
    Panel: i18n('provider.panel'),
    Text: i18n('provider.text'),
    TextTime: i18n('provider.text.time'),
    Image: i18n('provider.image'),
    DataTable: i18n('provider.data.table'),
    FreeTable: i18n('provider.free.table'),
    Rect: i18n('provider.rect'),
    HorizontalLine: i18n('provider.horizontal.line'),
    DottedHorizontalLine: i18n('provider.dotted.horizontal.line'),
    VerticalLine: i18n('provider.vertical.line'),
    DottedVerticalLine: i18n('provider.dotted.vertical.line'),
    Container: i18n('provider.container'),
    PageHeader: i18n('provider.page.header'),
    PageFooter: i18n('provider.page.footer'),
    PageNum: i18n('provider.page.num'),
    SvgPolygonLine: i18n('provider.svg.polygon line'),
    SvgLine: i18n('provider.svg.line'),
    SvgBezierCurve: i18n('provider.svg.bezier.curve'),
    SvgBezierCurveThree: i18n('provider.svg.bezier.curve.three'),
    SvgCircle: i18n('provider.svg.circle'),
    SvgEllipse: i18n('provider.svg.ellipse'),
    DrawPanel: i18n('provider.draw.panel')

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

export type DisplayModel = 'design' | 'preview' | 'print'
export type PageUnit = 'px' | 'mm' | 'cm' | 'in'
export type FontSizeUnit = 'px' | 'pt'

export type elementType = keyof typeof elementTypeFormat
export type cellType = keyof typeof cellTypeFormat
export type statisticsType = keyof typeof statisticsTypeFormat

type textContentType =
    'Text'
    | 'Barcode'
    | 'QrCode'

// 节点状态
export type elementStatus = 'NONE' | 'SELECT' | 'SELECT_REMOVE' | 'HANDLE' | 'HANDLE_ED' | 'HANDLE_EDIT_ING'
export type auxiliaryLineStatus = 'SHOW' | 'HIDDEN'

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
    disableCellMap: Record<number, 0 | 1 | undefined>;
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
    // 组件实时位置 单位px
    init: Container;
    status: elementStatus;
    auxiliaryLineStatus: auxiliaryLineStatus;
    cutIngIs: boolean;

    previewIs: boolean;

    /**
     * 工作环境，如果是在表格中，填充满整个cell
     */
    workEnvironment: elementType;
    cellType: cellType;

    nestColumnList: TableCellElement[];

    // 是否拖拽进入
    dragInIs: boolean;

    // 下标
    index: number;
}

export interface ElementOption {
    barCodeType: string;
    barCodeDisplayValIs: boolean;
    qrCodeScale: number, // 二维码缩放倍数
    qrErrorCorrectionLevel: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H', // 二维码容错等级
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
    borderRadius: number;
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
    disableSort: number;
    disableEnable: number;
    autoTextHeight: boolean;
    enable: number;
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
