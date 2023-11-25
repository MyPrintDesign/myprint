import {Element, Panel} from "./entity";
import {Snapshot} from "../utils/historyUtil";

export type EventTypes = {
    preview: string;
    save: string;
    saveTemplate: string;
    scaleMove: any;
    scaleEvent: any;

    optionsDragStart: any;
    elementClick: Element;
    elementMove: any;
    elementUp: any;
    elementRemove: Element;
    previewPanel: Element;
    clearPanel: Panel;
    panelSnapshot: Snapshot;
    sortColumn: any;
}
