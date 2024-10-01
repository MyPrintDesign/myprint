import { Container, MyElement, Panel } from './entity';
import { Snapshot } from '@myprint/design/utils/historyUtil';
import { PrintOptions } from '@myprint/design/types/entity';

export type EventTypes = {
    preview: string;
    save: string;
    saveTemplate: string;
    scaleMove: any;
    scaleEvent: any;

    optionsDragStart: any;
    elementClick: MyElement;
    elementMove: any;
    elementUp: any;
    elementRemove: MyElement;
    printPanel: PrintOptions;
    design2Img: PrintOptions;
    previewPanel: PrintOptions;
    clearPanel: Panel;
    panelSnapshot: Snapshot;
    sortColumn: any;
    updatePanel: any;
    triggerScroll: any;

    minimapViewportSize: Container;
    minimapViewportScroll: Container;

    changePageSize: any;

    changeElement: any;
}
