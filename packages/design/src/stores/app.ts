import { defineStore } from 'pinia';
import { DisplayModel, MyAuxiliaryLine, PageUnit, Panel, Provider } from '@myprint/design/types/entity';
import { defaultElement } from '@myprint/design/constants/common';
import i18n from '@myprint/design/locales';

export const useAppStoreHook = defineStore('myPrintApp', {
    state: () => {
        return {
            locale: localStorage.getItem('print-lang') || 'zhCn',
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
    getters: {
      getCurrentPanel(state): Panel {
          return state.currentPanel
      }
    },
    actions: {
        SET_CURRENT_PANEL(panel: Panel) {
            this.currentPanel = panel;
        },
        SET_LOCALE<T extends typeof i18n.global.locale.value>(locale: T) {
            //语言切换
            this.locale = locale;
            localStorage.setItem('print-lang', locale);
            i18n.global.locale.value = locale;
        },
        SET_CLIENT_CONNECT(status: boolean) {
            this.client.connect = status;
        }
    }
});
