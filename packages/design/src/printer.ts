import { App, h, render, VNode } from 'vue-demi';
import PrintView from '@myprint/design/components/print/print.vue';
import previewPanelView from '@myprint/design/components/preview/preview-panel.vue';
import { getCurrentPanel, parentInitElement } from '@myprint/design/utils/elementUtil';
import { MyPrintOptions, Panel, PrintProps, PrintResult } from '@myprint/design/types/entity';
import { generateUUID } from '@myprint/design/utils/utils';
import { myPrintClientService } from '@myprint/design/plugins/myprintClientService';
import i18n from '@myprint/design/locales';
import { useAppStoreHook } from '@myprint/design/stores/app';

export const myPrintOptions: MyPrintOptions = {
    disabledClient: false
};

let printNode: VNode = null!;
let previewNode: VNode = null!;
let handleChromePrint: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleClientPrint: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleChromeDownloadPdf: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleClientDownloadPdf: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleServerDownloadPdf: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleChromeDownloadImg: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleServerDownloadImg: (printProps: PrintProps) => Promise<PrintResult> = null!;
let handleChromePreview: (printProps: PrintProps) => Promise<PrintResult> = null!;

export function installPrinter(app: App<any>) {
    if (!printNode) {
        printNode = h(PrintView, {});
        const container = document.createElement('div');
        printNode.appContext = app._context;

        render(printNode, container);

        handleChromePrint = printNode.component!.exposed!.handleChromePrint;
        handleClientPrint = printNode.component!.exposed!.handleClientPrint;

        handleChromeDownloadPdf = printNode.component!.exposed!.handleChromeDownloadPdf;
        handleClientDownloadPdf = printNode.component!.exposed!.handleClientDownloadPdf;
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
        document.body.appendChild(container);
    }
}

function initPanel(panel: Panel) {
    panel.runtimeOption = {} as any;
    for (let i = 0; i < panel.elementList.length; i++) {
        const element = panel.elementList[i];
        parentInitElement(panel, panel, element, i);
    }
    panel.pageHeader && parentInitElement(panel, panel, panel.pageHeader, 0);
    panel.pageFooter && parentInitElement(panel, panel, panel.pageFooter, 0);
}

function convertPrintProps(printProps: PrintProps) {
    let panel = printProps.panel;
    if (typeof printProps.panel == 'string') {
        panel = JSON.parse(printProps.panel);
        initPanel(panel as Panel);
    }
    printProps.taskId = generateUUID();
    return {
        ...printProps,
        panel: panel == null ? getCurrentPanel() : panel
    };
}

export const MyPrinter = {
    initMyPrinter(options: MyPrintOptions) {
        options.serverUrl && (myPrintOptions.serverUrl = options.serverUrl);
        options.disabledClient != null && (myPrintOptions.disabledClient = options.disabledClient);
    },

    setLocale<T extends typeof i18n.global.locale.value>(locale: T) {
        useAppStoreHook().SET_LOCALE(locale);
    },

    clientConnectIs() {
        return myPrintClientService.connectIs();
    },

    getPrinterList() {
        return myPrintClientService.getPrinterList();
    },

    getDefaultPrinter() {
        const printList = myPrintClientService.getPrinterList();
        if (printList == null || printList.length == 0) {
            return null;
        }
        for (let printListElement of printList) {
            if (printListElement.isDefault) {
                return printListElement;
            }
        }
        return printList[0];
    },

    asyncGetPrinterList() {
        return myPrintClientService.asyncGetPrinterList();
    },

    chromePreview(printProps: PrintProps) {
        return handleChromePreview(convertPrintProps(printProps));
    },

    chromePrinter(printProps: PrintProps) {
        return handleChromePrint(convertPrintProps(printProps));
    },

    clientPrinter(printProps: PrintProps) {
        return handleClientPrint(convertPrintProps(printProps));
    },

    pdfChrome(printProps: PrintProps) {
        return handleChromeDownloadPdf(convertPrintProps(printProps));
    },

    pdfClient(printProps: PrintProps) {
        return handleClientDownloadPdf(convertPrintProps(printProps));
    },

    pdfServer(printProps: PrintProps) {
        return handleServerDownloadPdf(convertPrintProps(printProps));
    },

    imgChrome(printProps: PrintProps) {
        return handleChromeDownloadImg(convertPrintProps(printProps));
    },

    imgServer(printProps: PrintProps) {
        return handleServerDownloadImg(convertPrintProps(printProps));
    }

};
