import pako from 'pako';

export function gzip(val: string) {
    //gzip压缩
    let uint8Array = pako.gzip(val, { to: 'string' } as any);
    //返回的是uint8Array对象 将其转成数组
    /**
     //方法一
     var array = []
     for (var i = 0; i < uint8Array.byteLength; i++) {
     array[i] = uint8Array[i]
     }*/
    //方法二（es6）
    /** var array = Array.from(uint8Array)*/
    //方法三
    // console.log(uint8Array);
    return [].slice.call(uint8Array);
}

export function unGzip(uint8Array: string) {
    if (uint8Array == null) {
        return null;
    }
    let strData = atob(uint8Array);
    // console.log(strData);
    let charData = strData.split('').map(function(x) {
        return x.charCodeAt(0);
    });
    // Turn number array into byte-array
    let binData = new Uint8Array(charData);
    //解压
    // console.log(binData);
    return pako.inflate(binData, { to: 'string' });
    // console.log(s);
}
