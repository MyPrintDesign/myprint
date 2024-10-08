import { defineStore } from 'pinia';
import i18n from '@/locales';

export const useAppStoreHook = defineStore('app', {
    state: () => {
        return {
            locale: localStorage.getItem('lang') || 'zhCn'
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
