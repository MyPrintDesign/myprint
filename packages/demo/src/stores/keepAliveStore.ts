import { defineStore } from 'pinia';

export const keepAliveStore = defineStore('keepAlive', {

    state: () => {
        return {
            keepAliveComponents: ['Layout', 'design']
        };
    },

    getters: {
        getKeepAliveComponents(state) {
            return state.keepAliveComponents;
        }
    },

    actions: {

        // 加入到缓存队列
        setKeepAlive(component: any) {
            if (!this.keepAliveComponents.includes(component)) {
                this.keepAliveComponents.push(component);
            }
        },

        // 从缓存队列移除
        removeKeepAlive(component: any) {
            const index = this.keepAliveComponents.indexOf(component);
            if (index !== -1) {
                this.keepAliveComponents.splice(index, 1);
            }
        }

    }
});
