import {defineStore} from 'pinia'
import {Element, DragWrapper} from "../types/entity";

export const dragDataStore = defineStore('dragData', {
    state: () => {
        return {
            data: {
                dragIng: false,
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            } as DragWrapper
        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        set(type: string, element: Element) {
            this.data.element = element
            this.data.type = type
        },
    },
})
