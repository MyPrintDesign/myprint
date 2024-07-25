import request from '@/utils/request';
import { Login } from '@/types/R';

export function autoLogin<T extends Login>(data: T) {
    return request<Login>({
        url: '/auto/login',
        method: 'post',
        data: data
    });
}
