import { App, h, render, VNode } from 'vue-demi';
import PrintView from '@myprint/design/components/print/print.vue';
import previewPanelView from '@myprint/design/components/preview/preview-panel.vue';
import { getCurrentPanel } from '@myprint/design/utils/elementUtil';
import { PrintProps, PrintResult } from '@myprint/design/types/entity';

export let pdfServerUrl = '';

let printNode: VNode = null!;
let previewNode: VNode = null!;
let handleChromePrint: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleClientPrint: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleChromeDownloadPdf: (printProps: PrintProps) => Promise<Blob> = null!;
let handleClientDownloadPdf: (printProps: PrintProps) => Promise<Blob> = null!;
let handleServerDownloadPdf: (printProps: PrintProps) => Promise<Blob> = null!;
let handleChromeDownloadImg: (printProps: PrintProps) => Promise<ArrayBuffer[]> = null!;
let handleServerDownloadImg: (printProps: PrintProps) => Promise<Blob> = null!;
let handleChromePreview: (printProps: PrintProps) => Promise<PrintResult> = null!;

export function installPrinter(app: App<any>) {
    if (!printNode) {
        printNode = h(PrintView, {});
        const container = document.createElement('div');
        printNode.appContext = app._context;

        render(printNode, container);

        handleChromePrint = printNode.component!.exposed!.handleChromePrint;
        handleClientPrint = printNode.component!.exposed!.handleClientPrint;

        handleChromeDownloadPdf = printNode.component!.exposed!.handleServerDownloadPdf;
        handleClientDownloadPdf = printNode.component!.exposed!.handleServerDownloadPdf;
        handleServerDownloadPdf = printNode.component!.exposed!.handleServerDownloadPdf;
        handleChromeDownloadImg = printNode.component!.exposed!.handleChromeDownloadImg;
        handleServerDownloadImg = printNode.component!.exposed!.handleServerDownloadImg;

        document.body.appendChild(container.firstElementChild!);
    }

    if (!previewNode) {
        previewNode = h(previewPanelView, {});
        const container = document.createElement('div');
        previewNode.appContext = app._context;

        render(previewNode, container);

        handleChromePreview = previewNode.component!.exposed!.handleChromePreview;
        // handleServerDownloadPdf = previewNode.component!.exposed!.handleServerDownloadPdf;
        // handleServerDownloadImg = previewNode.component!.exposed!.handleServerDownloadImg;
        document.body.appendChild(container);
    }
}

export const MyPrinter = {

    setServerUrl(url: string) {
        pdfServerUrl = url;
    },

    chromePreview(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleChromePreview({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    chromePrinter(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleChromePrint({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    clientPrinter(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleClientPrint({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    pdfChrome(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleChromeDownloadPdf({
            ...printProps,
            panel: panel == null ? getCurrentPanel() : panel
        });
    },

    pdfClient(printProps: PrintProps) {
        let panel = printProps.panel;
        if (typeof printProps.panel == 'string') {
            panel = JSON.parse(printProps.panel);
        }
        return handleClientDownloadPdf({
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

    imgChrome(printProps: PrintProps) {
        return handleChromeDownloadImg({ ...printProps, panel: getCurrentPanel() });
    },

    imgServer(printProps: PrintProps) {
        return handleServerDownloadImg({ ...printProps, panel: getCurrentPanel() });
    }


};
