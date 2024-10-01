import DesignPanel from './components/content';
import { MyPrinter } from './printer';
import { mountDesign } from './design';
import { install as createPrint } from './install';
import { version } from '@myprint/design/version';

export * from './types/entity';
export * from './types/R';


export {
    version,
    createPrint,
    mountDesign,
    MyPrinter,
    DesignPanel
};
