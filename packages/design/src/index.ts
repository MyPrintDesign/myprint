import CpText from './components/design/text'
import CpImage from './components/design/image'
import CpDottedHorizontalLine from './components/design/auxiliary/line/dottedHorizontalLine'
import CpDottedVerticalLine from './components/design/auxiliary/line/dottedVerticalLine'
import CpHorizontalLine from './components/design/auxiliary/line/horizontalLine'
import CpVerticalLine from './components/design/auxiliary/line/verticalLine'
import CpPageHeader from './components/design/container/pageHeader'
// import CpPageFooter from './components/design/container/pageFooter'
import CpPanel from './components/panel'
// import CpTest from './components/test/index.vue'
import CpTest from './components/design/svg/test.vue'



export * from './components/design/auxiliary'

import {install as createPrint} from './install'

export {
    CpTest,
    CpText,
    CpImage,
    CpDottedHorizontalLine,
    CpDottedVerticalLine,
    CpHorizontalLine,
    CpVerticalLine,
    CpPageHeader,
    // CpPageFooter,

    CpPanel,
}

export {createPrint}
