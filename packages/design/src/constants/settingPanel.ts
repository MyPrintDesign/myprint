import { HandlePanel } from '@myprint/design/types/entity';
import { reactive } from 'vue';

export const handlePanelElementList = reactive({
    'setting': {
        icon: 'icon-setting',
        label: '设置',
        visible: false
    } as HandlePanel,
    'operation': {
        icon: 'icon-operation',
        label: '属性',
        visible: false
    } as HandlePanel,
    'history': {
        icon: 'icon-history',
        label: '历史操作',
        visible: false
    } as HandlePanel
    // 'elementList': {
    //     icon: 'icon-element-list',
    //     right: 20, y: 660, width: 200, height: 200,
    //     label: '历史操作',
    //     visible: false,
    // } as HandlePanel

});

export const miniMap = {
    // icon: 'icon-history',

    label: '小地图',
    visible: false
} as HandlePanel;
