import { App, h, render } from 'vue';
import PrintView from './components/print/print.vue';
import previewPanelView from './components/preview/preview-panel.vue';
import { getCurrentPanel } from './utils/elementUtil';
import { VNode } from 'vue-demi';
import { PrintProps, PrintResult } from './types/entity';

export let pdfServerUrl = '';

let printNode: VNode = null!;
let previewNode: VNode = null!;
let handlePrint: (printProps: PrintProps) => Promise<PrintResult> = null!;
let design2Img: (printProps: PrintProps) => Promise<ArrayBuffer[]> = null!;
let handleServerDownloadPdf: (printProps: PrintProps) => Promise<Blob> = null!;
let handleServerDownloadImg: (printProps: PrintProps) => Promise<Blob> = null!;
let handlePreview: (printProps: PrintProps) => Promise<PrintResult> = null!;

export function installPrinter(app: App<any>) {
    if (!printNode) {
        printNode = h(PrintView, {});
        const container = document.createElement('div');
        printNode.appContext = app._context;

        render(printNode, container);

        design2Img = printNode.component!.exposed!.design2Img;
        handlePrint = printNode.component!.exposed!.handlePrint;
        handleServerDownloadPdf = printNode.component!.exposed!.handleServerDownloadPdf;
        handleServerDownloadImg = printNode.component!.exposed!.handleServerDownloadImg;

        document.body.appendChild(container.firstElementChild!);
    }

    if (!previewNode) {
        previewNode = h(previewPanelView, {});
        const container = document.createElement('div');
        previewNode.appContext = app._context;

        render(previewNode, container);

        handlePreview = previewNode.component!.exposed!.handlePreview;
        // handleServerDownloadPdf = previewNode.component!.exposed!.handleServerDownloadPdf;
        // handleServerDownloadImg = previewNode.component!.exposed!.handleServerDownloadImg;
        console.log(container.outerHTML);
        document.body.appendChild(container);
    }
}

export const MyPrinter = {

    setServerUrl(url: string) {
        pdfServerUrl = url;
    },

    chromePrinter(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handlePrint({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    printer(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handlePrint({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    preview(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handlePreview({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    pdfServer(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleServerDownloadPdf({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    pdfClient(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleServerDownloadPdf({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    imgServer(printProps: PrintProps) {
        return handleServerDownloadImg({ ...printProps, panel: getCurrentPanel() });
    },

    print2ImgLocal(printProps: PrintProps) {
        return design2Img({ ...printProps, panel: getCurrentPanel() });
    }

};


// function print() {
//     // 即将被创建的组件的z-index
//     const { nextZIndex } = useZIndex();
//     // 每个组件有唯一的id
//     const id = `message_${seed++}`;
//     // 用来防止Message组件的容器
//     const container = document.createElement('div');
//
//     // 在添加组件应有的属性
//     const newProps = {
//         // ...props,
//         id,
//         zIndex: nextZIndex(),
//         // destroyMesssage见下文
//         useDestroy: destroyMesssage
//     };
//     const vnode = h(printView, newProps);
//     // 通过render函数将虚拟DOM节点渲染或挂载到真实DOM节点上
//     render(vnode, container);
//     // 在页面上添加，即显示
//     document.body.appendChild(container.firstElementChild!);
//
//     // 存储当前创建的实例,并且使用shallowReactive做浅层监听
//     const instances: MesssageContext[] = shallowReactive([]);
//
//     const instance = {
//         id,
//         vnode,
//         props: newProps,
//         vm,
//         // manualDistory下文添加
//         destroy: manualDistory
//     };
//     // 将当前创建的实例添加到实例数组中
//     instances.push(instance);
//
//     //  手动调用删除, 也就是手动调整组件中的visible值
//     //  visible 是通过expose传出来的
//     const manualDistory = () => {
//         const instance = instances.find((instance) => instance.id === id);
//         if (instance) {
//             instance.vm.exposed!.visible.value = false;
//         }
//     };
//
//     // 卸载组件
//     const destroyMesssage = () => {
//         // 从实例数组中删除
//         const index = instances.findIndex((instance) => instance.id === id);
//         if (index === -1) return;
//         instances.splice(index, 1);
//         render(null, container);
//     };
//
// }
