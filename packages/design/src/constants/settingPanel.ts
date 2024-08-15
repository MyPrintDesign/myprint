import { HandlePanel } from '@myprint/design/types/entity';
import { reactive } from 'vue-demi';
import { i18n } from '@myprint/design/locales';

export const handlePanelElementList = reactive({
    'setting': {
        icon: 'icon-setting',
        label: i18n('common.setting'),
        visible: false
    } as HandlePanel,
    'operation': {
        icon: 'icon-operation',
        label: i18n('common.attr'),
        visible: false
    } as HandlePanel,
    'history': {
        icon: 'icon-history',
        label: i18n('common.operation.history'),
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

    label: i18n('common.mini.map'),
    visible: false
} as HandlePanel;
