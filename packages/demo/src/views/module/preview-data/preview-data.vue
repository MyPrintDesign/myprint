<template>
    <div class="filed-setting_wrapper">
        <div class="filed-setting_content display-flex-column">
            <div>
                <el-button @click="addPreviewData" :disabled="data.disabledAdd">添加</el-button>
            </div>
            <preview-data-table :preview-data="data.previewData" :column-list="data.columnList" />
        </div>
        
        <div class="filed-setting_field_footer display-flex">
            <el-button color="#646cff" @click="save">保存</el-button>
            <el-button @click="back">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { moduleDetail, moduleUpdate } from '@/api/module';
import { onMounted, reactive } from 'vue';
import { Module } from '@/types/R';
import { Provider, TableHeadProviderCellElement } from '@myprint/design/types/entity';
import { stringify } from '@myprint/design/utils/utils';
import PreviewDataTable from '@/views/module/preview-data/preview-data-table.vue';
import { gzip, unGzip } from '@/utils/gzipUtil';
import { msgError, msgSuccess } from '@/utils/util';

defineOptions({
    name: 'previewData'
});

const route = useRoute();
const router = useRouter();

const moduleId = route.query.moduleId as any;
const data = reactive({
    module: null as Module,
    previewData: [] as any[],
    columnList: [],
    chooseImageType: 'localFile',
    provider: {} as Provider,
    disabledAdd: false
});

onMounted(() => {
    moduleDetail(moduleId)
        .then(res => {
            data.module = res.data;
            data.provider = JSON.parse(data.module.provider) as Provider;
            data.previewData = JSON.parse(unGzip(data.module.previewDataByte)) as any[];
            if (!data.previewData) {
                data.previewData = [];
            }
            const elementList = data.provider.elementList || [];
            if (elementList.length == 0) {
                data.disabledAdd = true;
                return;
            }
            for (let element of elementList) {
                const column = {
                    label: element.label,
                    prop: element.field,
                    type: element.type,
                    element,
                    columnList: null
                };
                
                if (element.type == 'DataTable') {
                    const columnList = [];
                    for (let columnElement of element.columnList) {
                        const innerTableColumn = {
                            label: columnElement.label,
                            prop: columnElement.field,
                            type: columnElement.type,
                            element: columnElement
                        };
                        columnList.push(innerTableColumn);
                        recursiveTableColumnList(innerTableColumn, columnElement);
                    }
                    column.columnList = columnList;
                }
                
                data.columnList.push(column);
            }
        });
});

function recursiveTableColumnList(innerTableColumn: any, columnElement: TableHeadProviderCellElement) {
    if (columnElement.columnList) {
        const columnList = [];
        for (let element of columnElement.columnList) {
            const tableColumn = {
                label: element.label,
                prop: element.field,
                type: element.type,
                element: element
            };
            columnList.push(tableColumn);
            recursiveTableColumnList(tableColumn, element);
        }
        innerTableColumn.childList = columnList;
    }
}

function addPreviewData() {
    const row = { $editIs: true };
    for (let columnListElement of data.columnList) {
        row[columnListElement.prop] = '';
    }
    data.previewData.unshift(row);
}

function save() {
    // 保存
    data.module.previewDataByte = gzip(stringify(data.previewData, 'id', '$editIs'));
    // console.log(data.module.previewDataByte);
    data.module.provider = null;
    moduleUpdate(data.module)
        .then(res => {
            msgSuccess('保存成功');
        }).catch(e => {
        msgError(e.msg());
    });
}

function back() {
    router.go(-1);
}
</script>
