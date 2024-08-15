import { ElMessage } from 'element-plus';
import { load } from '@fingerprintjs/fingerprintjs';
import { autoLogin } from '@/api/login';

export function emptyIs(val: any) {
    if (val == null) {
        return true;
    }
    return val == '';

}

export function arraySwap(arr: any[], from: number, to: number) {
    const obj = arr[from];
    arr[from] = arr[to];
    arr[to] = obj;
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

export let visitorId = null;
export let token = null;

export function initVisitorId() {
    visitorId = window.localStorage.getItem('visitorId');
    token = window.localStorage.getItem('token');
    if (visitorId != null && token != null) {
        return;
    }
    if (visitorId == null) {
        const fpPromise = load();

        fpPromise
            .then(fp => fp.get())
            .then(result => {
                // 这个唯一ID
                visitorId = result.visitorId;
                window.localStorage.setItem('visitorId', visitorId);

                autoLogin({ visitorId })
                    .then(res => {
                        token = res.data.token;
                        window.localStorage.setItem('token', res.data.token);
                    });
                // console.log(visitorId);
                // 可以将visitorId发送到服务器或用于其他用途
            })
            .catch(error => console.error(error));
    } else {
        autoLogin({ visitorId })
            .then(res => {
                token = res.data.token;
                window.localStorage.setItem('token', res.data.token);
            });
    }
}
