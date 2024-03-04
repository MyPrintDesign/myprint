import {reactive} from "vue";
import {Container} from "@cp-print/design/types/entity";

export const mouseTips = {
    data: reactive({
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    } as Container & { visible: boolean, data: string }),

    move(x: number, y: number, data?: string) {
        this.data.x = x
        this.data.y = y
        if (data) {
            this.data.data = data
        }
    },

    visible() {
        this.data.visible = true
    },
    hidden() {
        this.data.visible = false
    },

    setData(data: string) {
        this.data.data = data
    },

}
