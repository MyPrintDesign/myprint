import {defineStore} from 'pinia'
import {DisplayModel, PageUnit, Panel} from "@myprint/design/types/entity";
import {defaultElement} from "@myprint/design/constants/common";
import i18n from '../locales'

export const useAppStoreHook = defineStore('app', {
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
                scrollY: 0,
            },
            currentPanel: {} as Panel,
            lastPageUnit: 'px' as PageUnit,
            currentElement: defaultElement,
            dataRotation: -1 as number | "rotate" | "move" | "none" | "col-resize"
        }
    },
    actions: {
        SET_LOCALE<T extends typeof i18n.global.locale.value>(locale: T) {
            //语言切换
            this.locale = locale
            localStorage.setItem('lang', locale)
            i18n.global.locale.value = locale
        },
        SET_CLIENT_CONNECT(status: boolean) {
            this.client.connect = status
        }
    }
})
