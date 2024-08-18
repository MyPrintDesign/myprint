import DesignPanel from './components/content';
import { MyPrinter } from './printer';
import { mountDesign } from './design';
import { install as createPrint } from './install';

export * from './types/entity';
export * from './types/R';

export {
    createPrint,
    mountDesign,
    MyPrinter,
    DesignPanel
};
