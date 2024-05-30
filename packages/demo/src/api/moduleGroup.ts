import request from '@/utils/request';
import { ModuleGroup, PageParam, R } from '@/types/R';

export function moduleGroupList<T extends PageParam & ModuleGroup>(data: T): Promise<R<ModuleGroup[]>> {
    return request<ModuleGroup[]>({
        url: '/module/group/page',
        method: 'post',
        data: data
    });
}
