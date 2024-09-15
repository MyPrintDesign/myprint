import { defineStore } from 'pinia';
import { DisplayModel, MyAuxiliaryLine, PageUnit, Panel, Provider } from '../types/entity';
import { defaultElement } from '../constants/common';
import i18n from '../locales';

export const useAppStoreHook = defineStore('myPrintApp', {
    state: () => {
        return {
            locale: localStorage.getItem('lang') || 'zhCn',
            displayModel: 'design' as DisplayModel,
            client: {
                connect: false
            },
            panelPosition: {
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0
            },
            currentPanel: {} as Panel,
            previewData: [] as any[],
            provider: {} as Provider,
            lastPageUnit: 'px' as PageUnit,
            currentElement: defaultElement,
            auxiliaryLineTmp: {} as MyAuxiliaryLine,
            dataRotation: -1 as number | 'rotate' | 'move' | 'none' | 'col-resize' | 'ns-resize'
        };
    },
    actions: {
        SET_LOCALE<T extends typeof i18n.global.locale.value>(locale: T) {
            //语言切换
            this.locale = locale;
            localStorage.setItem('lang', locale);
            i18n.global.locale.value = locale;
        },
        SET_CLIENT_CONNECT(status: boolean) {
            this.client.connect = status;
        }
    }
});
