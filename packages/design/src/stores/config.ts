import {defineStore} from 'pinia'

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            collapsePanelZIndex: 1000,
            cursor: null,
            showHistory: false,
            printer: null,
            defaultPrinter: null,
            clientProtocol: 'cprint',
            clientUrl: 'ws://127.0.0.1:9898',
            autoConnect: true,
            settingPanel: {
                setting: {visible: false},
                operation: {visible: true},
                history: {visible: false},
                elementList: {visible: false},
            } as any,
            settingDesign: {
                autoAlign: false
            }
        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        initConfig() {

        },
        updateConfig(key: string, value: string) {
            let self = this as any
            self[key] = value
            this.postConfig()
        },
        postConfig() {

        },
        changeCursor(cursor: any) {
            // if (this.data.cursor) {
            //     document.body.classList.remove(this.data.cursor)
            // }
            // if (cursor) {
            //     document.body.classList.add(cursor)
            // }
            this.cursor = cursor
        }
    },
    // persist: {
    //     // 需要持久化的状态
    //     enabled: true,
    // },
})
