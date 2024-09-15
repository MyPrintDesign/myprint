import { App, h, render } from 'vue-demi';
import DesignPanel from '@myprint/design/components/content';
import { DesignPanelProps } from '@myprint/design/types/entity';

export function mountDesign(app: App<any>, props: DesignPanelProps, element?: HTMLDivElement) {
    const printNode = h(DesignPanel, props == null ? {} : props);
    let elementTmp = element!;
    if (elementTmp == null) {
        elementTmp = document.createElement('div');
    }
    printNode.appContext = app._context;
    render(printNode, elementTmp);
    if (element == null) {
        document.body.appendChild(elementTmp.firstElementChild!);
    }
}
