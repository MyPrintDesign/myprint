// import {HandlePanel} from "@myprint/design/types/entity";
// import {PropType} from "vue";
import { Panel } from '@myprint/design/types/entity';

export interface Props {
    msg: string,
    labels?: string[]
}

export interface PrintProps {
    panel: Panel | string,
    previewDataList: any[]
}

// interface PropsHandlePanel{
//     element: HandlePanel
// }
// export const propsHandlePanel = {element: {type: Object as PropType<HandlePanel>, default: () => ({} as HandlePanel)}}

