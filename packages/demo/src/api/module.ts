import request from '@/utils/request';
import { Module, Page, PageParam } from '@/types/R';

export function modulePage<T extends PageParam & Module>(data: T) {
    return request<Page<Module>>({
        url: '/module/page',
        method: 'post',
        data: data
    });
}

export function moduleCreate(data: Module) {
    return request({
        url: '/module/create',
        method: 'post',
        data: data
    });
}

export function moduleDetail(id: string) {
    return request<Module>({
        url: `/module/${id}/detail`,
        method: 'post'
    });
}


export function moduleUpdate(data: Module) {
    return request<Module>({
        url: '/module/update',
        method: 'post',
        data: data
    });
}

export function moduleDelete(data: Module) {
    return request<Module>({
        url: '/module/delete',
        method: 'post',
        data: data
    });
}
