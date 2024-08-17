import { Design } from '../types/entity';
import { reactive } from 'vue-demi';

export const scaleUtil = {
    miniMap: reactive<Design>(
        {
            scale: 1
        }),
    scale(val: number) {
        return (this.miniMap.scale * val);
    },
    scaleDiv(val: number) {
        return (val / this.miniMap.scale);
    }
};
