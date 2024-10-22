import {
    Container,
    displayStrategyFormat,
    DownList,
    ElementOption,
    elementStatus,
    elementType,
    MyElement,
    statisticsTypeFormat
} from '@myprint/design/types/entity';
import { PropType, reactive } from 'vue-demi';
import { i18n } from '@myprint/design/locales';

export const defaultElement: MyElement[] = [];

export const canMoveStatusList = ['SELECT', 'HANDLE'];

export const fontMap = {
    heiti: '\'Microsoft YaHei\'', //微软雅黑
    SimSun: '\'SimSun\',\'STSong\',\'Songti SC\'', //宋体
    kaiti: '\'KaiTi\',\'SimKai\', \'STKaiti\', \'KaiTi SC\'', // 楷体
    // heiti: "'Microsoft YaHei'", //微软雅黑
    FZShuTi: '\'FZShuTi\'', //华文舒体
    NSimSun: '\'NSimSun\'', //新宋体
    DengXian: '\'DengXian\'' //等线

    // todo 自定义字体
};


export const fontList: DownList[][] = [
    [
        {
            label: '微软雅黑',
            value: 'heiti'
        },
        {
            label: '宋体',
            value: 'SimSun'
        },
        {
            label: '楷体',
            value: 'kaiti'
        },
        {
            label: '华文舒体',
            value: 'FZShuTi'
        },
        {
            label: '新宋体',
            value: 'NSimSun'
        },
        {
            label: '等线',
            value: 'DengXian'
        }]
];

export const fontSizeList: DownList[][] = [
    [
        {
            label: '8',
            value: 8
        },
        {
            label: '9',
            value: 9
        },
        {
            label: '10',
            value: 10
        },
        {
            label: '18',
            value: 18
        }
    ]
];


export const definePropType = <T>(val: any): PropType<T> => val;
export type elementSettingType =
    keyof ElementOption
    | (keyof Container)
    | 'contentType'
    | 'data'
    | 'label'
    | 'common'
    | 'clearDrawPanel'
    | 'tableBodyHeightType' //表格表体行高类型
    | 'tablePageHead' // 分页表头
    | 'tableHeightAttr' // 表格高度属性


// "x", 'y', "width", 'height', "font", 'fontSize', "color", 'hiddenLabel', 'opacity', "rotate"
const commonElementSetting: Array<elementSettingType> = ['x', 'y', 'width', 'height', 'opacity', 'rotate'];
const styleElementSetting: Array<elementSettingType> = ['textAlign', 'verticalAlign', 'borderAll', 'color', 'background', 'bold', 'italic', 'underline', 'lineThrough', 'fontFamily', 'fontSize'];
const elementSetting: Record<elementType, Array<elementSettingType>> =
    {
        Image: [...commonElementSetting, 'common', 'borderRadius'],
        Text: [...commonElementSetting, ...styleElementSetting, 'common', 'autoTextHeight', 'lineHeight', 'fontFamily', 'fontSize', 'borderRadius', 'color', 'hiddenLabel', 'contentType', 'padding', 'margin', 'data', 'label', 'lineBreak', 'qrCodeScale', 'qrErrorCorrectionLevel'],
        TextTime: [...commonElementSetting, ...styleElementSetting, 'common', 'lineHeight', 'fontFamily', 'fontSize', 'borderRadius', 'color', 'hiddenLabel', 'formatter', 'padding', 'margin', 'label'],
        Panel: [...commonElementSetting, 'common'],
        DataTable: [...(commonElementSetting.filter(item => item !== 'rotate')), ...styleElementSetting, 'tableHeightAttr', 'tableBodyHeightType', 'tablePageHead', 'common'],
        FreeTable: [...(commonElementSetting.filter(item => item !== 'rotate')), ...styleElementSetting, 'common'],
        Rect: [...commonElementSetting, 'common', 'borderRadius', 'color', 'background', 'lineWidth'],
        HorizontalLine: [...commonElementSetting, 'common', 'color', 'lineHeight', 'lineWidth'],
        DottedHorizontalLine: [...commonElementSetting, 'common', 'color', 'lineHeight', 'dottedStyle', 'lineWidth'],
        VerticalLine: [...commonElementSetting, 'common', 'color', 'lineHeight', 'lineWidth'],
        DottedVerticalLine: [...commonElementSetting, 'common', 'color', 'lineHeight', 'dottedStyle', 'lineWidth'],
        Container: [...commonElementSetting, 'common'],
        PageHeader: [...commonElementSetting, 'common'],
        PageFooter: [...commonElementSetting, 'common'],
        PageNum: [...commonElementSetting, ...styleElementSetting, 'common', 'formatter', 'borderRadius'],
        SvgPolygonLine: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        SvgCircle: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        SvgEllipse: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        SvgLine: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        SvgBezierCurve: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        SvgBezierCurveThree: ['common', 'color', 'background', 'x', 'y', 'opacity'],
        DrawPanel: ['common', 'color', 'background', 'borderAll', 'x', 'y', 'opacity', 'clearDrawPanel']
    };

export function getElementSetting(type: elementType) {
    const settingList = elementSetting[type];
    if (settingList) {
        return settingList;
    }
    return [];
}

export function hasStyle(type: elementType, style: elementSettingType) {
    const ele = elementSetting[type];
    if (ele) {
        return ele.includes(style);
    }
    return false;
}

export function hasStyleByTypeList(typeList: elementType[], style: elementSettingType) {
    if (typeList == undefined || typeList.length == 0) {
        return false;
    }

    for (let typeListElement of typeList) {
        const ele = elementSetting[typeListElement];
        if (!ele) {
            return false;
        }
        if (!ele.includes(style)) {
            return false;
        }
    }
    return true;
}

export const textContentTypes = [
    {
        'label': i18n('common.text'),
        'value': 'Text'
    },
    {
        'label': i18n('common.barcode'),
        'value': 'Barcode'
    },
    {
        'label': i18n('common.qrcode'),
        'value': 'QrCode'
    }
];

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
];

export const handleConstants = {
    tl: { id: 'tl', index: 0, class: 'bg-none l t', x: null, y: null, width: 0, height: 0 } as any,
    tm: { id: 'tm', index: 1, class: 't center-h', x: null, y: null, width: 0, height: 0 } as any,
    tr: { id: 'tr', index: 2, class: 'bg-none r t', x: null, y: null, width: 0, height: 0 } as any,
    rm: { id: 'rm', index: 3, class: 'r', x: null, y: null, width: 0, height: 0 } as any,
    br: { id: 'br', index: 4, class: 'bg-none r b', x: null, y: null, width: 0, height: 0 } as any,
    bm: { id: 'bm', index: 5, class: 'b', x: null, y: null, width: 0, height: 0 } as any,
    bl: { id: 'bl', index: 6, class: 'bg-none l b', x: null, y: null, width: 0, height: 0 } as any,
    lm: { id: 'lm', index: 7, class: 'l', x: null, y: null, width: 0, height: 0 } as any,
    rot: { id: 'rot', index: 8, class: 'l', x: null, y: null, width: 0, height: 0 } as any
} as any;

export type handleConstantsType = keyof typeof handleConstants

export const cursorStyleArray = [
    'nwse-resize',
    'ns-resize',
    'nesw-resize',
    'ew-resize',
    'nwse-resize',
    'ns-resize',
    'nesw-resize',
    'ew-resize'
];

export const elementTypeLineList: Array<elementType> = ['HorizontalLine', 'DottedHorizontalLine', 'VerticalLine', 'DottedVerticalLine'];
export const elementTypeContainerList: Array<elementType> = ['PageHeader', 'PageFooter', 'Container'];
export const elementHandleEditStatusList: Array<elementStatus> = ['HANDLE_ED', 'HANDLE_EDIT_ING'];
export const elementHandleHandleStatusList: Array<elementStatus> = ['HANDLE', 'HANDLE_ED'];
export const elementHandleStatusList: Array<elementStatus> = ['HANDLE', 'HANDLE_ED', 'HANDLE_EDIT_ING'];
export const noCopyElementTypeList: Array<elementType> = ['PageHeader', 'PageFooter'];
export const displayStrategyList: any[] = Object.keys(displayStrategyFormat).map(key => {
    return {
        label: displayStrategyFormat[key],
        value: key
    };
});

export const statisticsTypeList: any[] = Object.keys(statisticsTypeFormat).map(key => {
    return {
        label: statisticsTypeFormat[key],
        value: key
    };
});

export const chooseImgTypeList = reactive([
    { value: 'localFile', label: i18n('common.local.upload') },
    { value: 'url', label: i18n('common.image.url') }
]) as DownList[];

export const tableBodyHeightTypeList = reactive([
    { value: 'AUTO', label: i18n('common.auto') },
    { value: 'FIXED', label: i18n('common.fixed') }
]) as DownList[];

export const pageUnitList = [
    [{
        label: 'px',
        value: 'px'
    }, {
        label: 'mm',
        value: 'mm'
    }, {
        label: 'cm',
        value: 'cm'
    }]
];

export const fontSizeUnitList = [
    [{
        label: 'px',
        value: 'px'
    }, {
        label: 'pt',
        value: 'pt'
    }]
];

export const clientProtocolList = [
    {
        label: 'myprint',
        value: 'ws://127.0.0.1:8888'
    },
    {
        label: 'lodop',
        value: 'ws://127.0.0.1:8000'
    },
    {
        label: 'hiprint',
        value: 'ws://127.0.0.1:8888'
    }
];

export const pageSizeList = [
    {
        label: i18n('common.auto.height'),
        value: 'AutoHeight',
        width: 100,
        height: 200
    },
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
        'height': 1189.0
    },
    {
        'label': 'A1',
        'value': 'A1',
        'width': 594.0,
        'height': 841.0
    },
    {
        'label': 'A2',
        'value': 'A2',
        'width': 420.0,
        'height': 594.0
    },
    {
        'label': 'A3',
        'value': 'A3',
        'width': 297.0,
        'height': 420.0
    },
    {
        'label': 'A4',
        'value': 'A4',
        'width': 210.0,
        'height': 297.0
    },
    {
        'label': 'A5',
        'value': 'A5',
        'width': 148.0,
        'height': 210.0
    },
    {
        'label': 'A6',
        'value': 'A6',
        'width': 105.0,
        'height': 148.0
    }, {
        'label': 'A7',
        'value': 'A7',
        'width': 74.0,
        'height': 105.0
    }, {
        'label': 'A8',
        'value': 'A8',
        'width': 52.0,
        'height': 74.0
    }, {
        'label': 'B5',
        'value': 'B5',
        'width': 176.0,
        'height': 250.0
    }, {
        'label': 'B6',
        'value': 'B6',
        'width': 125.0,
        'height': 176.0
    }, {
        'label': 'B7',
        'value': 'B7',
        'width': 88.0,
        'height': 125.0
    }, {
        'label': 'C5',
        'value': 'C5',
        'width': 162.0,
        'height': 229.0
    }, {
        'label': 'C6',
        'value': 'C6',
        'width': 114.0,
        'height': 162.0
    }, {
        'label': 'C7',
        'value': 'C7',
        'width': 81.0,
        'height': 114.0
    }];

export const dottedStyleList = [
    {
        'label': i18n('common.dotted'),
        'value': 'dotted'
    },
    {
        'label': i18n('common.dashed'),
        'value': 'dashed'
    }
];
export const qrCodeErrorCorrectionLevel = [
    {
        'label': i18n('common.qr.errorCorrectionLevel.low'),
        'value': 'L'
    },
    {
        'label': i18n('common.qr.errorCorrectionLevel.medium'),
        'value': 'M'
    },
    {
        'label': i18n('common.qr.errorCorrectionLevel.quartile'),
        'value': 'Q'
    },
    {
        'label': i18n('common.qr.errorCorrectionLevel.high'),
        'value': 'H'
    }
];
