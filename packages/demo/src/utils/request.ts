import axios, { AxiosRequestConfig } from 'axios';
// import errorCode from '@/utils/errorCode';
import { R } from '@/types/R';
import { token, visitorId } from '@/utils/util';
// import cache from '@/plugins/cache'
// import { saveAs } from 'file-saver'

// let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
// console.log(import.meta.env.VITE_API_BASE_URL)
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // 超时
    timeout: 10000
});

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    // const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    // const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    const isRepeatSubmit = false;
    // if (getToken() && !isToken) {
    //     config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    config.headers.set('visitorId', visitorId);
    config.headers.set('token', token);
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url;
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        };
        const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
        const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
        if (requestSize >= limitSize) {
            console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。');
            return config;
        }
        // const sessionObj = cache.session.getJSON('sessionObj')
        // if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        //     cache.session.setJSON('sessionObj', requestObj)
        // } else {
        //     const s_url = sessionObj.url;                  // 请求地址
        //     const s_data = sessionObj.data;                // 请求数据
        //     const s_time = sessionObj.time;                // 请求时间
        //     const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
        //     if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        //         const message = '数据正在处理，请勿重复提交';
        //         console.warn(`[${s_url}]: ` + message)
        //         return Promise.reject(new Error(message))
        //     } else {
        //         cache.session.setJSON('sessionObj', requestObj)
        //     }
        // }
    }
    return config;
}, error => {
    console.log(error);
    Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        // const msg = errorCode[code] || res.data.msg || errorCode['default'];
        // 二进制数据则直接返回
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            return res;
        }
        if (code === 401) {
            if (!isRelogin.show) {
                isRelogin.show = true;
                // MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
                //     isRelogin.show = false;
                //     store.dispatch('LogOut').then(() => {
                //         location.href = '/index';
                //     })
                // }).catch(() => {
                //     isRelogin.show = false;
                // });
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
        } else if (code === 500) {
            // Message({ message: msg, type: 'error' })
            return Promise.reject(res.data);
        } else if (code === 601) {
            // Message({ message: msg, type: 'warning' })
            return Promise.reject('error');
        } else if (code !== 200) {
            // Notification.error({ title: msg })
            return Promise.reject('error');
        } else {
            return res;
        }
    },
    error => {
        console.log('err' + error);
        let { msg } = error;
        if (msg == 'Network Error') {
            msg = '后端接口连接异常';
        } else if (msg.includes('timeout')) {
            msg = '系统接口请求超时';
        } else if (msg.includes('Request failed with status code')) {
            msg = '系统接口' + msg.substr(msg.length - 3) + '异常';
        }
        // Message({ message: message, type: 'error', duration: 5 * 1000 })
        return Promise.reject(error);
    }
);

// // 通用下载方法
// export function download(url, params, filename, config) {
//     downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
//     return service.post(url, params, {
//         transformRequest: [(params) => { return tansParams(params) }],
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         responseType: 'blob',
//         ...config
//     }).then(async (data) => {
//         const isBlob = blobValidate(data);
//         if (isBlob) {
//             const blob = new Blob([data])
//             saveAs(blob, filename)
//         } else {
//             const resText = await data.text();
//             const rspObj = JSON.parse(resText);
//             const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
//             Message.error(errMsg);
//         }
//         downloadLoadingInstance.close();
//     }).catch((r) => {
//         console.error(r)
//         Message.error('下载文件出现错误，请联系管理员！')
//         downloadLoadingInstance.close();
//     })
// }

// export default service
export default <T = any>(config: AxiosRequestConfig) => {
    return new Promise<R<T>>((res, rej) => {
        service
            .request<R<T>>(config)
            .then((response) => {
                res(response.data);
            })
            .catch((err: any) => {
                rej(err);
            });
    });
};

// export default <T>(config: AxiosRequestConfig) => {
//     return service
//         .request<R<T>>(config);
// };
