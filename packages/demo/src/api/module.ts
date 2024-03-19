import request from '@/utils/request'
import {Module, Page, PageParam, R,} from "@/types/R";

export function modulePage<T extends PageParam & Module>(data: T): Promise<R<Page<Module>>> {
    return request<Page<Module>>({
        url: '/module/page',
        method: 'post',
        data: data
    })
}

export function moduleCreate(data: Module) {
    return request({
        url: '/module/page',
        method: 'post',
        data: data
    })
}
