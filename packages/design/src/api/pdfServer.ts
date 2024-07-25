import { myPrintOptions } from '@myprint/design/printer';

export async function downloadPdf(data: any) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    let response = await fetch(myPrintOptions.serverUrl + '/print/generatePdf', options);
    return await Promise.resolve(response.blob());
}

export async function downloadImg(data: any) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    let response = await fetch(myPrintOptions.serverUrl + '/print/generateImg', options);
    return await Promise.resolve(response.blob());
}
