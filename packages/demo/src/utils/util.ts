import { ElMessage } from 'element-plus';

export function emptyIs(val: any) {
    if (val == null) {
        return true;
    }
    return val == '';

}

export function msgSuccess(msg: string) {
    ElMessage({
        message: msg,
        type: 'success'
    });
}

export function msgError(msg: string) {
    ElMessage.error(msg);

}
