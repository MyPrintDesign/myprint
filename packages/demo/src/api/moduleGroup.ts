import request from '@/utils/request';
import { ModuleGroup, PageParam, R } from '@/types/R';

export function moduleGroupList<T extends PageParam & ModuleGroup>(data: T): Promise<R<ModuleGroup[]>> {
    return request<ModuleGroup[]>({
        url: '/module/group/page',
        method: 'post',
        data: data
    });
}


export function moduleGroupSave(data: ModuleGroup): Promise<R> {
    return request({
        url: '/module/group/create',
        method: 'post',
        data: data
    });
}


export function moduleGroupUpdate(data: ModuleGroup): Promise<R> {
    return request({
        url: '/module/group/update',
        method: 'post',
        data: data
    });
}
export function moduleGroupDelete(data: ModuleGroup): Promise<R> {
    return request({
        url: '/module/group/delete',
        method: 'post',
        data: data
    });
}
