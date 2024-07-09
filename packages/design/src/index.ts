import MyText from './components/design/text';
import MyImage from './components/design/image';
import MyDottedHorizontalLine from './components/design/shape/line/dottedHorizontalLine';
import MyDottedVerticalLine from './components/design/shape/line/dottedVerticalLine';
import MyHorizontalLine from './components/design/shape/line/horizontalLine';
import MyVerticalLine from './components/design/shape/line/verticalLine';
import DesignContent from './components/content';
import { MyPrinter } from './printer';


export * from './components/design/shape';

import { install as createPrint } from './install';

export {
    MyText,
    MyImage,
    MyDottedHorizontalLine,
    MyDottedVerticalLine,
    MyHorizontalLine,
    MyVerticalLine,
    DesignContent
};

export { createPrint };
export { MyPrinter };
