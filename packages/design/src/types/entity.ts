export interface Option {
    type: string;
    label: string;
}

export interface Provider {
    width: number;
    height: number;
    elementList: Element[];
}

export interface Design {
    scale: number;
}

export interface ElementRelation {
    elementList?: Element[]
}

export interface Point {
    x?: number;
    y?: number;
}

export interface Container extends Point, ElementRelation {
    id: string
    status: string;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    type: elementType
}

export interface Panel extends Container {
    name: string
    width: number
    height: number
    pageSize: string
    pageUnit: PageUnit
    watermark: boolean
    watermarkContent: string
    design: Design
    orientation?: "p" | "portrait" | "l" | "landscape"
    pageHeader?: Element
    pageFooter?: Element
}


export interface PreviewWrapper {
    element: Element | undefined
    offsetLastElementTop: number
}

export interface DragWrapper {
    dragIng: boolean
    type: string
    element: Element,
    start: Position
    end: Position
}

// 节点类型
export const elementTypeFormat = {
    Panel: '面板',
    Text: '文本',
    TextTime: '时间文本',
    Image: '图片',
    Table: '表格',
    Rect: '矩形',
    HorizontalLine: '横线',
    DottedHorizontalLine: '横虚线',
    VerticalLine: '竖线',
    DottedVerticalLine: '竖虚线',
    Container: '容器',
    PageHeader: '页眉',
    PageFooter: '页脚',
    PageNum: '页数',

    // 私有类型
    PrivateDragRectElement: '内置框选',
}

export type DisplayModel = 'design' | 'preview'
export type PageUnit = 'px' | 'mm' | 'cm' | 'in'

export type elementType = keyof typeof elementTypeFormat

type textContentType =
    'Text'
    | 'Barcode'
    | 'QrCode'

// 节点状态
type elementStatus = 'NONE' | 'SELECT' | 'SELECT_REMOVE' | 'HANDLE'

type textAlign = 'start' | 'center' | 'end'

export interface HandlePanel extends Container {
    icon: string
    label: string
    visible: boolean
    right: number
}


export interface Element extends Container {
    id: string
    minWidth: number
    minHeight: number

    contentType?: textContentType
    field?: string
    translateX?: number
    translateY?: number
    enable?: number
    label?: string
    data?: any

    columnList?: Element[]
    status: elementStatus
    option: ElementOption

    /**
     * 运行时配置
     */
    runtimeOption: RuntimeElementOption
    /**
     * 是否锁定
     */
    lock?: number
}

export interface TextElement extends Element {
    labelOption?: ElementOption
    contentType: textContentType
}

/**
 * 运行时参数，不提交后台
 */
export interface RuntimeElementOption extends Position {
    centerX: number
    centerY: number
    width: number
    height: number
    TL: Position
    TR: Position
    BL: Position
    BR: Position
    bounds: Position
    parent?: Container

    /**
     * 工作环境，如果是在表格中，填充满整个cell
     */
    workEnvironment: elementType

    rowList?: Array<Element[]>

    onDragStart: () => void
    onDragEnd: () => void
}

export interface ElementOption {
    barCodeType: string
    aspectRatio: number
    font: string
    fontSize: number
    opacity: number
    color: string
    background: 'none'
    bold: boolean
    underline: boolean
    lineThrough: boolean
    italic: boolean
    borderAll: boolean
    borderWidth: number
    rotate: number
    textType: string
    textAlign: textAlign
    verticalAlign: textAlign
    lineBreak: boolean
    lineHeight: number
    dottedStyle: 'dotted' | 'dashed'
    sort: number
    hiddenLabel: boolean
    labelSplit: boolean
    disableSort: boolean
    disableEnable: boolean
    enable: boolean;
    padding: Position
    margin: Position
    formatter?: string

}

export interface Position extends Point {
    top: number
    bottom: number
    left: number
    right: number
}

export interface ContentScaleVo {
    scrollWidth?: number,
    scrollHeight?: number,
    openIs: boolean
}


export interface FormatterVariable {
    pageIndex?: number,
    pageSize?: number,
    nowDate?: Date
}
