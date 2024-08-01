import { useSocket } from '@myprint/design/stores/socket';
import { ClientCmd, Printer, Panel, PrintProps, PrintResult } from '@myprint/design/types/entity';
import { generateUUID } from '@myprint/design/utils/utils';
import { unit2unit } from '@myprint/design/utils/devicePixelRatio';
import { getCurrentPanelUnit } from '@myprint/design/utils/elementUtil';

export const myPrintClientService = {
    print(option: ClientCmd, panel: Panel) {
        option.width = unit2unit(getCurrentPanelUnit(panel), 'mm', panel.width);
        option.height = unit2unit(getCurrentPanelUnit(panel), 'mm', panel.height);

        return new Promise<ClientCmd>((resolve, _reject) => {
            useSocket().SEND(option.taskId, JSON.stringify({
                ...option
            })).then((msg: ClientCmd) => {
                resolve(msg);
            });
        });
    },

    connectIs() {
        return useSocket().connect;
    },

    getPrinterList() {
        return useSocket().printerList as Printer[];
    },

    asyncGetPrinterList() {
        return new Promise<Printer[]>((resolve, reject) => {
            if (useSocket().connect) {
                const taskId = generateUUID();
                useSocket().SEND(taskId, JSON.stringify({
                    taskId,
                    cmd: 'printerList'
                })).then((msg: ClientCmd) => {
                    useSocket().SET_PRINTER_LIST(msg.content);
                    resolve(msg.content);
                }).catch(e => {
                    reject(e);
                });
            } else {
                reject({ msg: '客户端未连接' });
            }
        });
    }
};

export const handleClientResult = (clientCmd: ClientCmd, printResult: Function, previewTimeOutMap: any, resolveMap: any) => {
    if (clientCmd.cmd == 'printResult') {
        printResult(clientCmd.taskId, {
            status: clientCmd.content.success ? 'SUCCESS' : 'ERROR',
            msg: clientCmd.content.failureReason,
            type: 'CLIENT_PRINT'
        }, previewTimeOutMap, resolveMap);
    }

    if (clientCmd.cmd == 'generatePdfResult') {
        let pdf = clientCmd.pdf;
        let blob: Blob = null!;
        if (pdf != null) {
            // 将Buffer对象转换为Uint8Array数组
            // @ts-ignore
            const uint8Array = new Uint8Array(pdf.data);
            // 将Uint8Array数组转换为Blob对象
            blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            // download(blob, pdfName + '.pdf');
        }

        printResult(clientCmd.taskId, {
            status: 'SUCCESS',
            msg: '',
            blob,
            type: 'CLIENT_GENERATE_PDF'
        }, previewTimeOutMap, resolveMap);

        return blob;
    }
};

export function printResult(taskId: string, result: PrintResult, previewTimeOutMap: any, resolveMap: any) {
    if (previewTimeOutMap[taskId]) {
        clearTimeout(previewTimeOutMap[taskId]);
        delete previewTimeOutMap[taskId];
    }

    if (resolveMap[taskId]) {
        resolveMap[taskId](result);
        delete resolveMap[taskId];
    }
}

export function handleTimeOut(printProps: PrintProps, previewTimeOutMap: any, resolveMap: any) {
    if (printProps.timeout! > 0) {
        previewTimeOutMap[printProps.taskId!] = setTimeout(() => {
            printResult(printProps.taskId!, {
                status: 'TIMEOUT',
                type: 'TIMEOUT'
            }, previewTimeOutMap, resolveMap);
        }, printProps.timeout);
    }
}
