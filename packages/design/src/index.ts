import MyText from './components/design/text';
import MyImage from './components/design/image';
import MyDottedHorizontalLine from './components/design/auxiliary/line/dottedHorizontalLine';
import MyDottedVerticalLine from './components/design/auxiliary/line/dottedVerticalLine';
import MyHorizontalLine from './components/design/auxiliary/line/horizontalLine';
import MyVerticalLine from './components/design/auxiliary/line/verticalLine';
import MyPanel from './components/content';


export * from './components/design/auxiliary';

import { install as createPrint } from './install';

export {
    MyText,
    MyImage,
    MyDottedHorizontalLine,
    MyDottedVerticalLine,
    MyHorizontalLine,
    MyVerticalLine,
    MyPanel
};

export { createPrint };
