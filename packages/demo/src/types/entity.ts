import { elementType, MyElement } from '@myprint/design/types/entity';

export interface FieldEdit {
    elementList: MyElement[];
    row?: MyElement;
    index?: number;
    elementType?: elementType;
}
