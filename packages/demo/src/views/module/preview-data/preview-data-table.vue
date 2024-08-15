<template>
    <el-table :data="previewData" border style="width: 100%">
        
        <recursive-table-column v-for="(item, index) in columnList" :item="item" :key="item.prop+'$'+index"
                                :prop="item.prop"
                                :label="item.label">
            <template #default="{scope, item}">
                <div v-if="item.type == 'DataTable'">
                    <el-link @click="clickLinkTablePreviewData(scope, item)">编辑表格数据</el-link>
                </div>
                <div v-else-if="scope.row.$editIs && !cantInputByType(item.type)">
                    <el-input v-model="scope.row[item.prop]" />
                </div>
                <div v-else>
                    {{ scope.row[item.prop] }}
                </div>
            </template>
        </recursive-table-column>
        <el-table-column label="操作" width="140">
            <template #default="scope">
                <el-link class="table_link" @click="clickLinkCopyRow(scope)">
                    <el-icon>
                        <CopyDocument />
                    </el-icon>
                </el-link>
                <el-link class="table_link" @click="editRow(scope)">
                    <el-icon>
                        <Edit />
                    </el-icon>
                </el-link>
                <el-link class="table_link" @click="deleteRow(scope)">
                    <el-icon>
                        <DeleteFilled />
                    </el-icon>
                </el-link>
            
            </template>
        </el-table-column>
    </el-table>
    
    <el-dialog v-model="data.copyRow.dialogVisible"
               :close-on-press-escape="false"
               title="Shipping address" width="500">
        <el-form-item label="复制份数">
            <el-input-number v-model="data.copyRow.copyNum" autocomplete="off" style="width: 100%" />
        </el-form-item>
        
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="data.copyRow.dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="copyRowData">
                    复制
                </el-button>
            </div>
        </template>
    </el-dialog>
    
    <el-dialog v-model="data.tablePreviewDataVisible" title="Shipping address" width="90%"
               :close-on-press-escape="false">
        <div>
            <el-button @click="addTablePreviewData">添加</el-button>
        </div>
        <preview-data-table :preview-data="data.tablePreviewData" :column-list="data.tableColumnList" />
        
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="data.tablePreviewDataVisible = false">取消</el-button>
                <el-button type="primary" @click="sureTablePreviewData">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>


</template>
<script setup lang="ts">
import { elementType, MyElement, Provider } from '@myprint/design/types/entity';
import { reactive } from 'vue';
import RecursiveTableColumn from '@/views/module/preview-data/recursive-table-column.vue';
import { CopyDocument, DeleteFilled, Edit } from '@element-plus/icons-vue';

const cantInputTypeList: elementType[] = ['Rect', 'HorizontalLine', 'DottedHorizontalLine', 'VerticalLine', 'DottedVerticalLine', 'DrawPanel'];

const props = withDefaults(defineProps<{
    columnList: any[],
    previewData: any[],
    innerTable?: boolean
}>(), {
    elementList: () => [] as MyElement[],
    innerTable: false
});

// console.log(props.columnList);

const data = reactive({
    tablePreviewData: [] as any[],
    tablePreviewDataVisible: false,
    columnList: [],
    tmpRow: null,
    tmpItem: null,
    tableColumnList: [] as any[],
    chooseImageType: 'localFile',
    provider: {} as Provider,
    copyRow: {
        tmpData: {},
        copyNum: 1,
        dialogVisible: false
    }
});

function addTablePreviewData() {
    const row = { $editIs: true };
    for (let columnListElement of data.columnList) {
        row[columnListElement.prop] = 'null';
    }
    data.tablePreviewData.unshift(row);
}

function cantInputByType(type: elementType) {
    return cantInputTypeList.includes(type);
}

function clickLinkTablePreviewData({ row }, item) {
    if (!row[item.prop]) {
        row[item.prop] = [];
    }
    
    data.tmpRow = row;
    data.tmpItem = item;
    data.tableColumnList = item.columnList;
    data.tablePreviewData = JSON.parse(JSON.stringify(row[item.prop]));
    for (let tablePreviewDatum of data.tablePreviewData) {
        tablePreviewDatum.$editIs = false;
    }
    data.tablePreviewDataVisible = true;
}

function sureTablePreviewData() {
    data.tablePreviewDataVisible = false;
    data.tmpRow[data.tmpItem.prop] = data.tablePreviewData;
}

function clickLinkCopyRow({ row }) {
    data.copyRow.tmpData = row;
    data.copyRow.dialogVisible = true;
}

function editRow({ row }) {
    row.$editIs = true;
}

function deleteRow({ $index }) {
    props.previewData.splice($index, 1);
}

function copyRowData() {
    const copyRow = JSON.stringify(data.copyRow.tmpData);
    for (let i = 0; i < data.copyRow.copyNum; i++) {
        const tmpCopyRow = JSON.parse(copyRow);
        tmpCopyRow.$editIs = false;
        props.previewData.unshift(tmpCopyRow);
    }
}
</script>
