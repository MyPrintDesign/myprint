import DesignPanel from '@myprint/design/components/content';
import { MyPrinter } from '@myprint/design/printer';
import { install as createPrint } from './install';

export * from '@myprint/design/types/entity';
export * from '@myprint/design/types/R';

export {
    createPrint,
    MyPrinter,
    DesignPanel
};
