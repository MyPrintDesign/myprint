<template>
    <design-content :template="data.template" @saveTemplate="saveTemplate" />
    <!--  <my-text :element="text"/>-->
</template>
<script setup lang="ts">
import { DesignContent } from '@myprint/design/index';
import { templateDetail, templateUpdate } from '@/api/template';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { Template } from '@myprint/design/types/R';

const route = useRoute();
// const text = {} as TextElement
// initElement(text)
const { templateId } = route.query;
const data = reactive({
    template: {} as Template
});

onMounted(() => {
    templateDetail(Number(templateId))
        .then(res => {
            // const panel = reactive(<Panel>JSON.parse(res.data.content))
            // console.log(panel)
            data.template = res.data;
            
        });
});

function saveTemplate(template: Template) {
    // console.log(panel)
    // console.log(template)
    data.template.name = template.name;
    data.template.content = template.content;
    templateUpdate(data.template)
        .then(res => {
            console.log(res);
        });
    // templateUpdate(props.panel)
    // console.log(JSON.stringify(toRaw(unref(props.panel))))
    
}
</script>
