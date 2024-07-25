<template>
    <design-panel :template="data.template"
                  generateImg
                  :module="data.module"
                  :saveTemplate="saveTemplate"
                  @panel-img="panelImg"
                  @back="back" />
</template>
<script setup lang="ts">
import { DesignPanel, SaveResult } from '@myprint/design/index';
import { templateCoverImgUpdate, templateCreate, templateDetail, templateUpdate } from '@/api/template';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Module, Template } from '@/types/R';
import { unGzip } from '@/utils/gzipUtil';
import { moduleDetail } from '@/api/module';
import { msgSuccess } from '@/utils/util';

const route = useRoute();
const router = useRouter();

let { moduleId, id } = route.query;
const data = reactive({
    template: null! as Template,
    module: null as Module,
    blobList: null
});

onMounted(() => {
    moduleDetail(moduleId as string)
        .then(res => {
            data.module = res.data;
            
            data.module.previewData = unGzip(res.data.previewDataByte);
            data.module.previewDataByte = null;
        });
    
    if (id) {
        templateDetail(id as string)
            .then(res => {
                data.template = res.data;
                // console.log(res);
            });
    } else {
        data.template = null;
    }
    
});

const updateQuery = (id: string) => {
    router.replace({
        path: route.path,
        query: {
            ...route.query,
            id: id
        }
    });
};


function back() {
    router.go(-1);
}

function saveTemplate(template: Template) {
    return new Promise<SaveResult>((resolve, reject) => {
        if (data.template == null) {
            data.template = {} as Template;
        }
        data.template.name = template.name;
        data.template.content = template.content;
        if (data.template.id == null) {
            data.template.moduleId = data.module.id;
            templateCreate(data.template)
                .then(res => {
                    id = res.data.id as string;
                    updateQuery(id);
                    msgSuccess('新增成功');
                    if (data.arrayBufferList != null) {
                        panelImg(data.arrayBufferList);
                    }
                    resolve({ status: 'SUCCESS' } as SaveResult);
                }).catch(_e => {
                reject({ status: 'ERROR' } as SaveResult);
            });
        } else {
            templateUpdate(data.template)
                .then(_res => {
                    msgSuccess('保存成功');
                    resolve({ status: 'SUCCESS' } as SaveResult);
                }).catch(_e => {
                reject({ status: 'ERROR' } as SaveResult);
            });
        }
    });
}

function panelImg(blobList: Blob []) {
    data.blobList = null;
    if (id) {
        const formData = new FormData();
        for (let i = 0; i < blobList.length; i++) {
            const blob = blobList[i];
            formData.append('fileList', blob);
        }
        
        formData.append('id', id as string);
        formData.append('imgType', 'TEMPLATE_COVER');
        templateCoverImgUpdate(formData).then(res => {
            console.log(res);
        });
    } else {
        data.blobList = blobList;
    }
    
}
</script>
