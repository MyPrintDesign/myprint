<template>
    <design-content :template="data.template" @saveTemplate="saveTemplate" @back="back" />
</template>
<script setup lang="ts">
import { DesignContent } from '@myprint/design/index';
import { templateDetail, templateUpdate } from '@/api/template';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Template } from '@/types/R';
import { unGzip } from '@/utils/gzipUtil';

const route = useRoute();
const router = useRouter();

const { templateId } = route.query;
const data = reactive({
    template: {} as Template
});

onMounted(() => {
    templateDetail(Number(templateId))
        .then(res => {
            data.template = res.data;
            data.template.module.previewData = unGzip(data.template.module.previewDataByte);
            data.template.module.previewDataByte = null;
            console.log(res);
            
        });
});

function back() {
    router.go(-1);
}

function saveTemplate(template: Template) {
    data.template.name = template.name;
    data.template.content = template.content;
    templateUpdate(data.template)
        .then(res => {
            console.log(res);
        });
}
</script>
