import { elementType, MyElement } from '@myprint/design/types/entity';
import { DefineComponent } from 'vue';

export interface FieldEdit {
    elementList: MyElement[];
    row?: MyElement;
    index?: number;
    elementType?: elementType;
}

export interface MenuItem {
    name: string;
    click: (item: any) => void;
    disabled?: boolean;
    icon?: DefineComponent;
}
