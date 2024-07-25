import { useSocket } from '@myprint/design/stores/socket';
import { ClientCmd, Panel, PrintProps, PrintResult } from '@myprint/design/types/entity';
import { download } from '@myprint/design/utils/utils';
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
    }

};

export const handleClientResult = (clientCmd: ClientCmd, printResult: Function, previewTimeOutMap: any, resolveMap: any, pdfName?: string) => {
    if (clientCmd.cmd == 'printResult') {
        printResult(clientCmd.taskId, {
            status: clientCmd.content.success ? 'SUCCESS' : 'ERROR',
            msg: clientCmd.content.failureReason,
            type: 'CLIENT_PRINT'
        }, previewTimeOutMap, resolveMap);
    }

    if (clientCmd.cmd == 'generatePdfResult') {
        printResult(clientCmd.taskId, {
            status: 'SUCCESS',
            msg: '',
            type: 'CLIENT_GENERATE_PDF'
        }, previewTimeOutMap, resolveMap);

        let pdf = clientCmd.pdf;
        if (pdf != null) {
            // 将Buffer对象转换为Uint8Array数组
            // @ts-ignore
            const uint8Array = new Uint8Array(pdf.data);
            // 将Uint8Array数组转换为Blob对象
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            download(blob, pdfName + '.pdf');
        }
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
