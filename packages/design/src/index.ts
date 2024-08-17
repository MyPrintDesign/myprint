import DesignPanel from './components/content';
import { MyPrinter } from './printer';
import { mount } from './design';
import { install as createPrint } from './install';

export * from './types/entity';
export * from './types/R';

export {
    mount,
    createPrint,
    MyPrinter,
    DesignPanel
};
