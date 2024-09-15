import { MyElement, ElementOption, PageUnit } from '@myprint/design/types/entity';
import { i18n } from '@myprint/design/locales';

export const customProvider = {
    pageUnit: 'mm' as PageUnit,
    elementList: [
        {
            'type': 'Text',
            iconClass: 'iconfont icon-text',
            'data': i18n('provider.text.default.data'),
            'width': 50,
            'height': 8
        } as any,
        {
            'type': 'TextTime',
            contentType: 'Text',
            iconClass: 'iconfont-color icon-color-text-time',
            option: { formatter: '{{yyyy-MM-dd hh:mm:ss}}' } as ElementOption,
            'width': 43,
            'height': 8
        } as any,
        {
            'type': 'Image',
            iconClass: 'iconfont-color icon-color-img',
            'width': 50.25,
            'height': 30
        } as any,
        {
            'type': 'HorizontalLine',
            iconClass: 'iconfont-color icon-color-vertical_solidline',
            'width': 30.25,
            'option': {
                lineWidth: 0.3
            } as ElementOption
        } as any,
        {
            'type': 'VerticalLine',
            iconClass: 'iconfont-color icon-color-crossrange_solidline',
            'height': 21,
            'option': {
                lineWidth: 0.3
            } as ElementOption
        } as any,
        {
            'type': 'DottedHorizontalLine',
            iconClass: 'iconfont-color icon-color-vertical_dottedline',
            'width': 21,
            'option': {
                lineWidth: 0.3
            } as ElementOption
        } as any,
        {
            'type': 'DottedVerticalLine',
            iconClass: 'iconfont-color icon-color-crossrange_dottedline',
            'height': 21,
            option: {
                lineWidth: 0.3
            } as ElementOption
        } as any,
        {
            type: 'Rect',
            iconClass: 'iconfont icon-rectangle_solidline',
            'width': 30,
            'height': 30,
            option: {
                lineWidth: 0.3
            } as ElementOption
        } as any,
        {
            type: 'Container',
            iconClass: 'iconfont-color icon-color-container',
            'width': 70,
            'height': 70
        } as any,
        {
            type: 'PageHeader',
            iconClass: 'iconfont-color icon-color-page_header',
            'height': 30
        } as any,
        {
            type: 'PageFooter',
            iconClass: 'iconfont-color icon-color-page_footer',
            'height': 30
        } as any,
        {
            type: 'PageNum',
            contentType: 'Text',
            iconClass: 'iconfont-color icon-color-page',
            option: {
                formatter: '第{{pageIndex::1}}页/共{{pageSize::1}}页',
                textAlign: 'end',
                verticalAlign: 'center',
                fixed: true
            } as ElementOption,

            width: 30,
            height: 6
        } as any,
        {
            field: '',
            type: 'SvgPolygonLine',
            data: '{"points":[{"x": 0,"y": 0},{"x": 30,"y": 0},{"x": 30,"y": 30},{"x": 0,"y": 30}]}',
            iconClass: 'iconfont-color icon-color-svg-rect',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'SvgCircle',
            iconClass: 'iconfont-color icon-color-svg-circle',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'SvgEllipse',
            iconClass: 'iconfont-color icon-color-svg-ellipse',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'DrawPanel',
            iconClass: 'iconfont-color icon-color-shouxieqianming-icon',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'SvgLine',
            data: '{"points":[{"x": 0,"y": 0},{"x": 30,"y": 30}]}',
            iconClass: 'iconfont-color icon-color-svg-line',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'SvgBezierCurve',
            data: '{"points":[{"x": 0,"y": 0},{"x": 30,"y": 0}],"controlPoints":[{"x": 15,"y": 50}]}',
            iconClass: 'iconfont-color icon-color-svg-bezier2',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any,
        {
            field: '',
            type: 'SvgBezierCurveThree',
            data: '{"points":[{"x": 0,"y": 15},{"x": 30,"y": 15}],"controlPoints":[{"x": 10,"y": 30},{"x": 20,"y": 0}]}',
            iconClass: 'iconfont-color icon-color-svg-bezier3',
            width: 30,
            'option': {
                borderWidth: 0.3
            } as ElementOption,
            height: 30
        } as any
    ] as MyElement[]
};
