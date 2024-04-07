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
