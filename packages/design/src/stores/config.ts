import { defineStore } from 'pinia';

export const useConfigStore = defineStore({
    id: 'config',
    state: () => {
        return {
            // cursor: null,
            init: false,
            printer: null,
            defaultPrinter: null,
            clientProtocol: 'myprint',
            clientUrl: 'ws://127.0.0.1:9898',
            autoConnect: true,
            settingPanel: {
                setting: { visible: false, x: 20, y: 70, width: 800, height: 500 },
                operation: { visible: false, x: 20, y: 70, width: 260, height: 600 },
                history: { visible: false, x: 20, y: 560, width: 200, height: 200 },
                elementList: { visible: false },
                miniMap: { visible: false, x: 20, y: 660, width: 200, height: 200 }
            } as any,
            settingDesign: {
                autoAlign: false
            }
        };
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        initConfig() {
            this.init = true;
        },
        updateConfig(key: string, value: string) {
            let self = this as any;
            self[key] = value;
            this.postConfig();
        },
        postConfig() {

        }
    },

    persist: true
});
