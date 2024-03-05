import {defineStore} from 'pinia'
import {PageUnit, Panel} from "@cp-print/design/types/entity";
import {defaultElement} from "@cp-print/design/constants/common";
import i18n from '../locales'

export const useAppStoreHook = defineStore('app', {
    state: () => {
        return {
            locale: localStorage.getItem('lang') || 'zhCn',
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
            dataRotation: -1
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
