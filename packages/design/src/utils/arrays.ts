export function arrayRemove(array: any, pro: any) {
    const index = arrayIndexOf(array, pro);
    // console.log(index);
    if (index > -1) {
        array.splice(index, 1);
    }
}

export function arrayIndexOf(array: any, pro: any) {
    if (pro === undefined) {
        return -1;
    }
    for (let i = 0; i < array.length; i++) {
        // debugger
        if (array[i] == pro) {
            return i;
        } else {
            if (array[i]['id'] != undefined && pro['id'] != undefined && array[i]['id'] === pro['id']) return i;
        }
    }

    return -1;
}

// 对比嵌套的数组是不是相等
export function arrayArrayIndexOf(arr: any[][], item: any[]) {
    let index = -1;
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        let arrElement = arr[i];
        if (!Array.isArray(arrElement)) continue;
        // console.log(arrElement);
        if (arrElement.length != item.length) {
            return -1;
        }

        for (let j = 0; j < arrElement.length; j++) {
            if (arrElement[j] != item[j]) {
                return -1;
            }
        }
        index = i;
    }
    return index;
}
