export function arrayRemove(val, pro) {
    const index = arrayIndexOf(val, pro)
    if (index > -1) {
        val.splice(index, 1)
    }
}

export function arrayIndexOf(val, pro) {
    for (let i = 0; i < val.length; i++) {
        if (pro === undefined) {
            if (val[i] === pro) return i
        } else {
            if (val[i]['id'] === pro['id']) return i
        }
    }

    return -1
}
