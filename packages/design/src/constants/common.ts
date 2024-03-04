import {
    Container,
    CpElement,
    DownList,
    ElementOption, elementStatus,
    elementType,
    RuntimeElementOption
} from "@cp-print/design/types/entity";
import {PropType, reactive} from "vue";
import {i18n} from "@cp-print/design/locales";

export const defaultElement: CpElement[] = []

export const defaultDragRectElement = reactive({
    type: 'PrivateDragRectElement',
    label: '多个元素',
    option: {
        padding: {},
        margin: {}
    } as ElementOption,
    runtimeOption: {} as RuntimeElementOption
} as CpElement)


export const canMoveStatusList = ['SELECT', 'HANDLE']

export const fontList: DownList[][] = [
    [{
        label: i18n('font.default'),
        value: 'default',
    },
        {
            label: '等线',
            value: 'heiti',
        },
        {
            label: '宋体',
            value: "'zh question mark','Times New Roman','Songti SC',STSong,NSimSun,SimSun,FangSong,'Nanum Myeongjo',NanumMyeongjo,Batang,serif",
        },
        {
            label: '楷体',
            value: "'zh question mark','Times New Roman','Kaiti SC',STKaiti,KaiTi,serif",
        },
        {
            label: '黑体',
            value: "'Microsoft YaHei', sans-serif",
        },
        {
            label: '方圆体',
            value: 'AlimamaFangYuanTiVF-Thin',
        },
        {
            label: '数黑体',
            value: 'AlimamaShuHeiTi-Boldr',
        }]
]

export const fontSizeList: DownList[][] = [
    [
        {
            label: "8",
            value: 8
        },
        {
            label: "9",
            value: 9
        },
        {
            label: "10",
            value: 10
        },
        {
            label: "18",
            value: 18
        }
    ]
]


export const definePropType = <T>(val: any): PropType<T> => val
type elementSettingType = keyof ElementOption | (keyof Container) | 'contentType' | 'data' | 'label'
// "x", 'y', "width", 'height', "font", 'fontSize', "color", 'hiddenLabel', 'opacity', "aspectRatio", "rotate"
const commonElementSetting: Array<elementSettingType> = ["x", 'y', "width", 'height', 'opacity', "aspectRatio", "rotate"]
const styleElementSetting: Array<elementSettingType> = ['textAlign', "verticalAlign", 'borderAll', 'color', 'background', 'bold', 'italic', 'underline', 'lineThrough', 'fontFamily', 'fontSize']
const elementSetting: Record<elementType, Array<elementSettingType>> =
    {
        Image: [...commonElementSetting],
        Text: [...commonElementSetting, ...styleElementSetting, "fontFamily", 'fontSize', "color", 'hiddenLabel', 'contentType', 'padding', "margin", 'data', 'label'],
        TextTime: [...commonElementSetting, ...styleElementSetting, "fontFamily", 'fontSize', "color", 'hiddenLabel', "formatter", 'padding', "margin", 'label'],
        Panel: [...commonElementSetting],
        Table: [...(commonElementSetting.filter(item => item !== "rotate"))],
        Rect: [...commonElementSetting, 'color', 'background'],
        HorizontalLine: [...commonElementSetting, 'color', 'lineHeight'],
        DottedHorizontalLine: [...commonElementSetting, 'color', 'lineHeight', 'dottedStyle'],
        VerticalLine: [...commonElementSetting, 'color', 'lineHeight'],
        DottedVerticalLine: [...commonElementSetting, 'color', 'lineHeight', 'dottedStyle'],
        Container: [...commonElementSetting],
        PageHeader: [...commonElementSetting],
        PageFooter: [...commonElementSetting],
        PageNum: [...commonElementSetting, ...styleElementSetting, "formatter"],
        PrivateDragRectElement: [],
        SvgPolygonLine: [],
        SvgCircle: [],
        SvgEllipse: [],
        SvgLine: [],
        SvgBezierCurve: [],
        SvgBezierCurveThree: [],
        DrawPanel: [],
    }

export function getElementSetting(type: elementType) {
    const settingList = elementSetting[type]
    if (settingList) {
        return settingList
    }
    return []
}

export function hasStyle(type: elementType, style: elementSettingType) {
    const ele = elementSetting[type]
    if (ele) {
        return ele.includes(style)
    }
    return false
}

export const textContentTypes = [
    {
        'label': '文本',
        'value': 'Text'
    },
    {
        'label': '条码',
        'value': 'Barcode'
    },
    {
        'label': '二维码',
        'value': 'QrCode'
    }
]

export const barcodeTypes = [
    {
        'label': 'CODE128',
        'value': 'CODE128',
        'eg': i18n('CODE128')
    },
    {
        'label': 'CODE128A',
        'value': 'CODE128A',
        'eg': i18n('CODE128A')
    },
    {
        'label': 'CODE128B',
        'value': 'CODE128B',
        'eg': i18n('CODE128B')
    },
    {
        'label': 'CODE128C',
        'value': 'CODE128C',
        'eg': i18n('CODE128C')
    },
    {
        'label': 'CODE39',
        'value': 'CODE39',
        'eg': i18n('CODE39')
    }, {
        'label': 'EAN2',
        'value': 'EAN2',
        'eg': i18n('EAN2')
    }, {
        'label': 'EAN5',
        'value': 'EAN5',
        'eg': i18n('EAN5')
    }, {
        'label': 'EAN8',
        'value': 'EAN8',
        'eg': i18n('EAN8')
    }, {
        'label': 'EAN13',
        'value': 'EAN13',
        'eg': i18n('EAN13')
    }, {
        'label': 'UPC',
        'value': 'UPC',
        'eg': i18n('UPC')
    }, {
        'label': 'UPC-E',
        'value': 'UPC_E',
        'eg': i18n('UPC-E')
    }, {
        'label': 'ITF',
        'value': 'ITF',
        'eg': i18n('ITF')
    }, {
        'label': 'ITF14',
        'value': 'ITF14',
        'eg': i18n('ITF14')
    }, {
        'label': 'MSI',
        'value': 'MSI',
        'eg': i18n('MSI')
    }, {
        'label': 'MSI10',
        'value': 'MSI10',
        'eg': i18n('MSI10')
    }, {
        'label': 'MSI11',
        'value': 'MSI11',
        'eg': i18n('MSI11')
    }, {
        'label': 'MSI1010',
        'value': 'MSI1010',
        'eg': i18n('MSI1010')
    }, {
        'label': 'MSI1110',
        'value': 'MSI1110',
        'eg': i18n('MSI1110')
    },
    {
        'label': 'codabar',
        'value': 'codabar',
        'eg': i18n('codabar')
    },
    {
        'label': 'pharmacode',
        'value': 'pharmacode',
        'eg': i18n('pharmacode')
    }
]

export const handleConstants = {
    tl: {id: 'tl', index: 0, class: 'bg-none l t', x: null, y: null, width: 0, height: 0} as any,
    tm: {id: 'tm', index: 1, class: 't center-h', x: null, y: null, width: 0, height: 0} as any,
    tr: {id: 'tr', index: 2, class: 'bg-none r t', x: null, y: null, width: 0, height: 0} as any,
    rm: {id: 'rm', index: 3, class: 'r', x: null, y: null, width: 0, height: 0} as any,
    br: {id: 'br', index: 4, class: 'bg-none r b', x: null, y: null, width: 0, height: 0} as any,
    bm: {id: 'bm', index: 5, class: 'b', x: null, y: null, width: 0, height: 0} as any,
    bl: {id: 'bl', index: 6, class: 'bg-none l b', x: null, y: null, width: 0, height: 0} as any,
    lm: {id: 'lm', index: 7, class: 'l', x: null, y: null, width: 0, height: 0} as any,
    rot: {id: 'rot', index: 8, class: 'l', x: null, y: null, width: 0, height: 0} as any
} as any

export type handleConstantsType = keyof typeof handleConstants

export const cursorStyleArray = [
    "nwse-resize",
    "ns-resize",
    "nesw-resize",
    "ew-resize",
    "nwse-resize",
    "ns-resize",
    "nesw-resize",
    "ew-resize"
];

export const elementTypeLineList: Array<elementType> = ['HorizontalLine', 'DottedHorizontalLine', 'VerticalLine', 'DottedVerticalLine']
export const elementTypeContainerList: Array<elementType> = ['PageHeader', 'PageFooter', 'Container']
export const elementHandleEditStatusList: Array<elementStatus> = ['HANDLE_ED', 'HANDLE_EDIT_ING']
export const elementHandleHandleStatusList: Array<elementStatus> = ['HANDLE', 'HANDLE_ED']
export const elementHandleStatusList: Array<elementStatus> = ['HANDLE', 'HANDLE_ED', 'HANDLE_EDIT_ING']

export const pageUnitList = [
    'px', 'mm', 'cm'
]

export const clientProtocolList = {
    cprint: {
        protocol: 'cprint',
        clientUrl: 'ws://127.0.0.1:8888'
    },
    lodop: {
        protocol: 'lodop',
        clientUrl: 'ws://127.0.0.1:8000'
    },
    hiprint: {
        protocol: 'hiprint',
        clientUrl: 'ws://127.0.0.1:8888'
    },
}

export const pageSizeList = [
    {
        label: i18n('common.custom'),
        value: 'Custom',
        width: 150,
        height: 150
    },
    {
        'label': 'A0',
        'value': 'A0',
        'width': 841.0,
        'height': 1189.0,
    },
    {
        'label': 'A1',
        'value': 'A1',
        'width': 594.0,
        'height': 841.0,
    },
    {
        'label': 'A2',
        'value': 'A2',
        'width': 420.0,
        'height': 594.0,
    },
    {
        'label': 'A3',
        'value': 'A3',
        'width': 297.0,
        'height': 420.0,
    },
    {
        'label': 'A4',
        'value': 'A4',
        'width': 210.0,
        'height': 297.0,
    },
    {
        'label': 'A5',
        'value': 'A5',
        'width': 148.0,
        'height': 210.0,
    },
    {
        'label': 'A6',
        'value': 'A6',
        'width': 105.0,
        'height': 148.0,
    }, {
        'label': 'A7',
        'value': 'A7',
        'width': 74.0,
        'height': 105.0,
    }, {
        'label': 'A8',
        'value': 'A8',
        'width': 52.0,
        'height': 74.0,
    }, {
        'label': 'B5',
        'value': 'B5',
        'width': 176.0,
        'height': 250.0,
    }, {
        'label': 'B6',
        'value': 'B6',
        'width': 125.0,
        'height': 176.0,
    }, {
        'label': 'B7',
        'value': 'B7',
        'width': 88.0,
        'height': 125.0,
    }, {
        'label': 'C5',
        'value': 'C5',
        'width': 162.0,
        'height': 229.0,
    }, {
        'label': 'C6',
        'value': 'C6',
        'width': 114.0,
        'height': 162.0,
    }, {
        'label': 'C7',
        'value': 'C7',
        'width': 81.0,
        'height': 114.0,
    }]

export const dottedStyleList = [
    {
        'label': '点',
        'value': 'dotted'
    },
    {
        'label': '线',
        'value': 'dashed'
    }
]
