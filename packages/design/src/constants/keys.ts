import {InjectionKey, Ref} from "vue/dist/vue";
import {Emitter} from "mitt";
import {Element, Panel, Provider} from "@cp-print/design/types/entity";
import {EventTypes} from "@cp-print/design/types/eventType";

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

export const selectElementKey: InjectionKey<Ref<Element>> =
    Symbol('selectElementKey')
