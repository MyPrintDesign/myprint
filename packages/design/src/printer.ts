import { App, h, render, VNode } from 'vue-demi';
import PrintView from './components/print/print.vue';
import previewPanelView from './components/preview/preview-panel.vue';
import { getCurrentPanel, parentInitElement } from './utils/elementUtil';
import { MyPrintConfig, Panel, PrintResult, PrintOptions } from './types/entity';
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

export const myPrintOptions: MyPrintConfig = {
    disabledClient: false
};

let printNode: VNode = null!;
let previewNode: VNode = null!;
let handleChromePrint: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleClientPrint: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleChromeDownloadPdf: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleClientDownloadPdf: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleServerDownloadPdf: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleChromeDownloadImg: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleServerDownloadImg: (printProps: PrintOptions) => Promise<PrintResult> = null!;
let handleChromePreview: (printProps: PrintOptions) => Promise<PrintResult> = null!;

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

function convertPrintProps(printProps: PrintOptions) {
    return new Promise<PrintOptions>(async (resolve, _reject) => {
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

        if (!printProps.taskId) {
            printProps.taskId = generateUUID();
        }
        resolve({
            ...printProps,
            panel
        });
    });
}

export const MyPrinter = {
    initMyPrinter(options: MyPrintConfig) {
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
        useSocket().INIT_SOCKET();
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

    chromePreview(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleChromePreview);
    },

    chromePrinter(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleChromePrint);
    },

    clientPrinter(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleClientPrint);
    },

    pdfChrome(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleChromeDownloadPdf);
    },

    pdfClient(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleClientDownloadPdf);
    },

    pdfServer(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleServerDownloadPdf);
    },

    imgChrome(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleChromeDownloadImg);
    },

    imgServer(printProps: PrintOptions) {
        return convertPrintProps(printProps).then(handleServerDownloadImg);
    }

};
