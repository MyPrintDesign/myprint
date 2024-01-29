import {InjectionKey, Ref} from "vue";
import {CpElement, Panel, Provider} from "@cp-print/design/types/entity";
import {EventTypes} from "@cp-print/design/types/eventType";

// @ts-ignore
import {Emitter} from 'mitt'
export const mittKey: InjectionKey<Emitter<EventTypes>> =
    Symbol('mittKey')

export const providerKey: InjectionKey<Ref<Provider>> =
    Symbol('providerKey')

export const panelKey: InjectionKey<Panel> =
    Symbol('panelKey')

export const previewDataKey: InjectionKey<Ref<any>> =
    Symbol('previewDataKey')

export const messageFun: InjectionKey<Ref<Function>> =
    Symbol('messageFunKey')

export const selectElementKey: InjectionKey<Ref<CpElement>> =
    Symbol('selectElementKey')
