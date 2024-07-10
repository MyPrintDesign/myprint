export interface Module {
    id?: string| number;
    originId?: any;
    userId?: number;
    moduleGroupId?: number | string;
    name?: string;
    provider?: string;
    previewData?: string;
    previewDataByte?: any;
}

export interface Template {
    id?: string| number;
    userId?: any;
    moduleId?: string| number;
    name?: string;
    content?: any;
    coverImgUrl?: any;
    coverImgList?: ArrayBuffer[];
    module?: Module;

    moreVisible?: boolean;
}
