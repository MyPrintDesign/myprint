import request from '@/utils/request'
import {Page, PageParam, R, Template,} from "@/types/R";

export function templatePage<T extends PageParam & Template>(data: T): Promise<R<Page<Template>>> {
    return request<Page<Template>>({
        url: '/template/page',
        method: 'post',
        data: data
    })
}

export function templateCreate(data: Template) {
    return request({
        url: '/template/page',
        method: 'post',
        data: data
    })
}

export function templateUpdate(data: Template) {
    return request({
        url: '/template/update',
        method: 'post',
        data: data
    })
}

export function templateDetail(id: number) {
    return request<Template>({
        url: '/template/detail',
        method: 'post',
        data: {id}
    })
}
