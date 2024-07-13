import { pdfServerUrl } from '@myprint/design/printer';

export async function downloadPdf(data: any) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    let response = await fetch(pdfServerUrl + 'print/generatePdf', options);
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

    let response = await fetch(pdfServerUrl + 'print/generateImg', options);
    return await Promise.resolve(response.blob());
}
