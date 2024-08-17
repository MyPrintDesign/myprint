import { App, h, render } from 'vue-demi';
import DesignPanel from './components/content';
import { DesignPanelProps } from '@myprint/design/types/entity';

export function mount(app: App<any>, props: DesignPanelProps, element?: HTMLDivElement) {
    const printNode = h(DesignPanel, props == null ? {} : props);
    if (element == null) {
        element = document.createElement('div');
    }
    printNode.appContext = app._context;
    render(printNode, element);
    document.body.appendChild(element.firstElementChild!);
}
