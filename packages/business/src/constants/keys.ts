import {InjectionKey} from "vue/dist/vue";
import {Emitter} from "mitt";
import {EventTypes} from "@/types/eventType";

export const mittKey: InjectionKey<Emitter<EventTypes>> =
    Symbol('mittKey')
