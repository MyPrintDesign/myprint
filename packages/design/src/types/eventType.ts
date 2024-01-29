import {CpElement, Panel} from "./entity";
import {Snapshot} from "../utils/historyUtil";

export type EventTypes = {
    preview: string;
    save: string;
    saveTemplate: string;
    scaleMove: any;
    scaleEvent: any;

    optionsDragStart: any;
    elementClick: CpElement;
    elementMove: any;
    elementUp: any;
    elementRemove: CpElement;
    previewPanel: CpElement;
    clearPanel: Panel;
    panelSnapshot: Snapshot;
    sortColumn: any;
    updatePanel: any;
}
