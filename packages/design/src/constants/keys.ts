import { InjectionKey, Ref } from 'vue-demi';
import { DesignPanelProps, MyElement, Panel, Provider } from '@myprint/design/types/entity';
import { EventTypes } from '@myprint/design/types/eventType';

// @ts-ignore
import { Emitter } from 'mitt';

export const designPropsKey: InjectionKey<DesignPanelProps> =
    Symbol('designPropsKey');

export const mittKey: InjectionKey<Emitter<EventTypes>> =
    Symbol('mittKey');

export const providerKey: InjectionKey<Ref<Provider>> =
    Symbol('providerKey');

export const panelKey: InjectionKey<Panel> =
    Symbol('panelKey');

export const previewDataKey: InjectionKey<Ref<any[]>> =
    Symbol('previewDataKey');

export const messageFun: InjectionKey<Ref<Function>> =
    Symbol('messageFunKey');

export const selectElementKey: InjectionKey<Ref<MyElement>> =
    Symbol('selectElementKey');
