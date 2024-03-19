import {Design} from "@myprint/design/types/entity";
import {reactive} from "vue";

export const scaleUtil = {
    miniMap: reactive<Design>(
        {
            scale: 1
        }),
    scale(val: number) {
        return (this.miniMap.scale * val)
    },
    scaleDiv(val: number) {
        return (val / this.miniMap.scale)
    }
}
