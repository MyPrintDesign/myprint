import { Template } from '../../design/src/types/R';
import { ElementOption, MyElement, Panel } from '../../design/src/types/entity';

const templateContent = {
    width: 100,
    height: 100,
    pageUnit: 'mm',
    elementList: [{
        type: 'Text',
        x: 10,
        y: 10,
        width: 50,
        height: 10,
        data: '磨刀霍霍向厨房',
        option: {
            textAlign: 'center',
            verticalAlign: 'center'
        } as ElementOption
    },
        {// 时间
            type: 'TextTime',
            x: 10,
            y: 20,
            width: 50,
            height: 10,
            option: {
                formatter: '{{yyyy年MM月dd日 hh:mm:ss}}',
                textAlign: 'center',
                verticalAlign: 'center'
            } as ElementOption
        },
        {// 图片
            type: 'Image',
            x: 10,
            y: 30,
            width: 20,
            height: 20
        }, {// 横实线
            type: 'Image',
            x: 10,
            y: 30,
            width: 20,
            height: 20
        }]
} as Panel;
export const template = {
    content: JSON.stringify(templateContent)
} as Template;
