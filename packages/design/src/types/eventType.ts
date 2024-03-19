import {Container, MyElement, Panel} from "./entity";
import {Snapshot} from "../utils/historyUtil";

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
    previewPanel: MyElement;
    clearPanel: Panel;
    panelSnapshot: Snapshot;
    sortColumn: any;
    updatePanel: any;
    triggerScroll: any;

    minimapViewportSize: Container;
    minimapViewportScroll: Container;

    changePageSize: any;
}
