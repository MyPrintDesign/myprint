import {MyElement, ElementOption} from "@myprint/design/types/entity";

export const customProvider: Array<MyElement> = [
    {
        "type": "Text",
        iconClass: 'iconfont icon-text',
        "label": "文本",
        "data": "自定义文本",
        "width": 50,
        "height": 10
    } as MyElement,
    {
        "type": "TextTime",
        contentType: "Text",
        iconClass: 'iconfont-color icon-color-text-time',
        "label": "时间文本",
        option: {formatter: "{{yyyy-MM-dd hh:mm:ss}}"} as ElementOption,
        "width": 43,
        "height": 5
    } as MyElement,
    {
        "type": "Image",
        iconClass: 'iconfont-color icon-color-img',
        "label": "图片",
        "data": null,
        "width": 50.25,
        "height": 30
    } as MyElement,
    {
        "type": "HorizontalLine",
        iconClass: 'iconfont-color icon-color-vertical_solidline',
        "label": "横实线",
        "width": 30.25,
        "option": {
            borderWidth: 0.3
        } as ElementOption
    } as MyElement,
    {
        "type": "VerticalLine",
        iconClass: 'iconfont-color icon-color-crossrange_solidline',
        "label": "竖实线",
        "height": 21,
        "option": {
            borderWidth: 0.3
        } as ElementOption,
    } as MyElement,
    {
        "type": "DottedHorizontalLine",
        iconClass: 'iconfont-color icon-color-vertical_dottedline',
        "width": 21,
        "option": {
            borderWidth: 0.3
        } as ElementOption,
    } as MyElement,
    {
        "type": "DottedVerticalLine",
        iconClass: 'iconfont-color icon-color-crossrange_dottedline',
        "height": 21,
        option: {
            borderWidth: 0.3
        } as ElementOption,
    } as MyElement,
    {
        type: "Rect",
        iconClass: 'iconfont icon-rectangle_solidline',
        "data": "",
        "width": 30,
        option: {
            borderWidth: 0.3
        } as ElementOption,
        "height": 30,
    } as MyElement,
    {
        type: "Container",
        iconClass: 'iconfont-color icon-color-container',
        "data": "容器",
        "width": 100,
        "height": 100,
    } as MyElement,
    {
        type: "PageHeader",
        iconClass: 'iconfont-color icon-color-page_header',
        "data": "",
        "height": 30,
    } as MyElement,
    {
        type: "PageFooter",
        iconClass: 'iconfont-color icon-color-page_footer',
        "data": "",
        "height": 30,
    } as MyElement,
    {
        field: "",
        type: "PageNum",
        contentType: "Text",
        iconClass: 'iconfont-color icon-color-page',
        option: {
            formatter: "第{{pageIndex:1}}页/共{{pageSize:1}}页",
            textAlign: "end",
            verticalAlign: "center"
        } as ElementOption,

        width: 30,
        height: 6,
    } as MyElement
]