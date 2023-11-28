// import {createI18n} from 'vue-i18n'

// import zhCn from './zh-cn'
// import enUs from './en-us'

// 创建 i18n
// const i18nInit = createI18n({
//     legacy: false,
//     globalInjection: true, // 全局模式，可以直接使用 $t
//     locale: localStorage.getItem('lang') || 'zhCn',
//     messages: {
//         zhCn,
//         enUs
//     }
// })

// type TailNodeKeys<T> = {
//     [K in keyof T]: T[K] extends object ? `${K & string}.${TailNodeKeys<T[K]> & string}` : K;
// }[keyof T];

// export function i18n(msg: keyof typeof zhCn) {
//     return i18nInit.global.t(msg)
// }
export function i18n(msg: any) {
    return '-' + msg
}

// export default i18nInit

