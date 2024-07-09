import { pdfServerUrl } from '@myprint/design/printer';

export function downloadPdf(data: any) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(pdfServerUrl + 'print/generatePdf', options)
        .then(response => Promise.resolve(response.blob()));
}

export function downloadImg(data: any) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return fetch(pdfServerUrl + 'print/generateImg', options)
        .then(response => Promise.resolve(response.blob()));
}
