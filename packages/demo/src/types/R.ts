export interface Page<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    maxLimit?: any;
    countId?: any;
    pages: number;
}

export interface PageParam {
    size?: number;
    current?: number;
}

export interface R<D = any> {
    code: number;
    data: D;
    msg?: any;
}

export interface Login {
    visitorId?: string;
    token?: string;
}

export interface ModuleGroup {
    id?: string;
    originId?: any;
    userId?: any;
    name?: string;

    moduleList?: Module[];
}

export interface Module {
    id?: string | number;
    originId?: any;
    userId?: number;
    moduleGroupId?: string | number;
    name?: string;
    provider?: string;
    previewData?: string;
    previewDataByte?: any;
}

export interface Template {
    id?: string | number;
    userId?: any;
    moduleId?: string | number;
    name?: string;
    content?: any;
    coverImgUrl?: any;
    coverImgList?: ArrayBuffer[];
    module?: Module;
    lockIs?: number;

    moreVisible?: boolean;
}
