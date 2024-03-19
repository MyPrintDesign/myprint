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

export interface Module {
    id?: number;
    originId?: any;
    userId?: any;
    name?: string;
    provider?: string;
    previewData?: string;
}

export interface Template {
    id?: number;
    userId?: any;
    moduleId?: number;
    name?: string;
    content?: any;
    coverImgUrl?: any;
    module: Module
}
