import { App, h, render, VNode } from 'vue-demi';
import PrintView from './components/print/print.vue';
import previewPanelView from './components/preview/preview-panel.vue';
import { getCurrentPanel, parentInitElement } from './utils/elementUtil';
import { MyPrintOptions, Panel, PrintProps, PrintResult } from './types/entity';
import {
    arrayBuffer2Base64,
    blob2Base64,
    generateUUID,
    isArrayBuffer,
    isBlob,
    isUint8Array,
    uint8Array2Base64
} from './utils/utils';
import { myPrintClientService } from './plugins/myprintClientService';
import i18n from './locales';
import { useAppStoreHook } from './stores/app';
import { useConfigStore } from './stores/config';
import { useSocket } from './stores/socket';

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
    return new Promise<PrintProps>(async (resolve, _reject) => {
        let panel = printProps.panel;
        if (printProps.file) { // 打印pdf
            if (isBlob(printProps.file)) {
                printProps.file = await blob2Base64(printProps.file as Blob);
            }
            if (isArrayBuffer(printProps.file)) {
                printProps.file = arrayBuffer2Base64(printProps.file as ArrayBuffer);
            }
            if (isUint8Array(printProps.file)) {
                printProps.file = uint8Array2Base64(printProps.file as Uint8Array);
            }
        } else { // 打印panel
            if (panel == null) {
                panel = getCurrentPanel();
            } else {
                if (typeof printProps.panel == 'string') {
                    panel = JSON.parse(printProps.panel);
                    initPanel(panel as Panel);
                }
            }
        }

        printProps.taskId = generateUUID();
        resolve(
            {
                ...printProps,
                panel
            });
    });
}

export const MyPrinter = {
    initMyPrinter(options: MyPrintOptions) {
        if (options.serverUrl) {
            if (options.serverUrl.endsWith('/')) {
                myPrintOptions.serverUrl = options.serverUrl.slice(0, -1);
            } else {
                myPrintOptions.serverUrl = options.serverUrl;
            }
        }
        if (options.clientUrl) {
            if (options.clientUrl.endsWith('/')) {
                useConfigStore().clientUrl = options.clientUrl.slice(0, -1);
            } else {
                useConfigStore().clientUrl = options.clientUrl;
            }
        }
        options.disabledClient != null && (myPrintOptions.disabledClient = options.disabledClient);
    },

    setLocale<T extends typeof i18n.global.locale.value>(locale: T) {
        useAppStoreHook().SET_LOCALE(locale);
    },

    setClientUrl(clientUrl: string) {
        if (!clientUrl) {
            return;
        }
        if (clientUrl.endsWith('/')) {
            useConfigStore().clientUrl = clientUrl.slice(0, -1);
        } else {
            useConfigStore().clientUrl = clientUrl;
        }
        useSocket().INIT_SOCKET()
    },

    setServerUrl(serverUrl: string) {
        if (serverUrl.endsWith('/')) {
            myPrintOptions.serverUrl = serverUrl.slice(0, -1);
        } else {
            myPrintOptions.serverUrl = serverUrl;
        }
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
        return convertPrintProps(printProps).then(handleChromePreview);
    },

    chromePrinter(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleChromePrint);
    },

    clientPrinter(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleClientPrint);
    },

    pdfChrome(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleChromeDownloadPdf);
    },

    pdfClient(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleClientDownloadPdf);
    },

    pdfServer(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleServerDownloadPdf);
    },

    imgChrome(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleChromeDownloadImg);
    },

    imgServer(printProps: PrintProps) {
        return convertPrintProps(printProps).then(handleServerDownloadImg);
    }

};
