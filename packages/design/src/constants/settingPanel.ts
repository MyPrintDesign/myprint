import {HandlePanel} from "@cp-print/design/types/entity";
import {reactive} from "vue";

export const handlePanelElementList = reactive({
    'setting': {
        icon: 'icon-setting',
        right: 20, y: 70, width: 800, height: 500,
        label: '设置',
        visible: false,
    } as HandlePanel,
    'operation': {
        icon: 'icon-operation',
        right: 20, y: 70, width: 260, height: 600,
        label: '属性',
        visible: false,
    } as HandlePanel,
    'history': {
        icon: 'icon-history',
        right: 20, y: 660, width: 200, height: 200,
        label: '历史操作',
        visible: false,
    } as HandlePanel,
    // 'elementList': {
    //     icon: 'icon-element-list',
    //     right: 20, y: 660, width: 200, height: 200,
    //     label: '历史操作',
    //     visible: false,
    // } as HandlePanel

})
