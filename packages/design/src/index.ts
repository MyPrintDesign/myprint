import MyText from '@myprint/design/components/design/text';
import MyImage from '@myprint/design/components/design/image';
import MyDottedHorizontalLine from '@myprint/design/components/design/shape/line/dottedHorizontalLine';
import MyDottedVerticalLine from '@myprint/design/components/design/shape/line/dottedVerticalLine';
import MyHorizontalLine from '@myprint/design/components/design/shape/line/horizontalLine';
import MyVerticalLine from '@myprint/design/components/design/shape/line/verticalLine';
import DesignPanel from '@myprint/design/components/content';
import { MyPrinter } from '@myprint/design/printer';


export * from './components/design/shape';

import { install as createPrint } from './install';

export {
    MyText,
    MyImage,
    MyDottedHorizontalLine,
    MyDottedVerticalLine,
    MyHorizontalLine,
    MyVerticalLine,
    DesignPanel
};

export { createPrint };
export { MyPrinter };
