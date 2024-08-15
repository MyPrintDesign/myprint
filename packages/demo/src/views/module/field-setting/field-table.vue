<template>
    <el-table :data="elementList"
              class="field-table"
              row-key="id"
              :expand-row-keys="expandRowKeys"
              :row-class-name="setRowClass">
        
        <el-table-column fixed type="expand">
            <template #default="scope">
                <field-table v-if="tableHasChildren(scope.row)" border
                             :element-list="scope.row.columnList"
                             inner-table
                             class="inner_table"
                             @add="(fieldEdit:FieldEdit) => {
                                 fieldEdit.elementType = 'DataTable' ;
                                 emit('add', fieldEdit)}"
                             @edit="(fieldEdit) =>{
                                 fieldEdit.elementType = 'DataTable' ;
                                 emit('edit', fieldEdit)}" />
            </template>
        </el-table-column>
        <!--        <el-table-column fixed prop="id" label="id" width="150" />-->
        <el-table-column fixed prop="label" label="名称" />
        <el-table-column prop="field" label="字段">
            <template #default="scope">
                <el-tag disable-transitions>{{ scope.row.field }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" :formatter="typeFormat" />
        <el-table-column prop="data" label="内容" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-link class="table_link" @click="moveTop(scope)">
                    <el-icon>
                        <Top />
                    </el-icon>
                </el-link>
                <el-link class="table_link" @click="moveBottom(scope)">
                    <el-icon>
                        <Bottom />
                    </el-icon>
                </el-link>
                <el-link class="table_link" v-if="tableCanHasChildren(scope.row)" @click="addTableElement(scope)">
                    <el-icon>
                        <CirclePlusFilled />
                    </el-icon>
                </el-link>
                <el-link class="table_link" @click="editElement(scope)">
                    <el-icon>
                        <Edit />
                    </el-icon>
                </el-link>
                <el-link class="table_link" @click="deleteElement(scope)">
                    <el-icon>
                        <DeleteFilled />
                    </el-icon>
                </el-link>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { elementTypeFormat, MyElement } from '@myprint/design/types/entity';
import { computed } from 'vue';
import { FieldEdit } from '@/types/entity';
import { Bottom, CirclePlusFilled, DeleteFilled, Edit, Top } from '@element-plus/icons-vue';
import { arraySwap } from '@/utils/util';

const emit = defineEmits(['add', 'edit', 'delete']);
const props = withDefaults(defineProps<{
    elementList: MyElement[],
    innerTable?: boolean
}>(), {
    elementList: () => [] as MyElement[],
    innerTable: false
});

const expandRowKeys = computed(() => {
    return props.elementList.filter(v => tableHasChildren(v)).map(v => v.id);
});

function moveTop(scope) {
    const { $index } = scope;
    if ($index == 0) {
        return;
    }
    
    arraySwap(props.elementList, $index, $index - 1);
}

function moveBottom(scope) {
    const { $index } = scope;
    if ($index == props.elementList.length - 1) {
        return;
    }
    
    arraySwap(props.elementList, $index, $index + 1);
}

function typeFormat(row: any, _column: any, _cellValue: any, _index: number) {
    return elementTypeFormat[row.type];
}

function addTableElement({ row, $index }) {
    if (row.columnList == null) {
        row.columnList = [];
    }
    emit('add', { elementList: row.columnList, row, $index });
}

function editElement({ row, $index }) {
    emit('edit', { elementList: props.elementList, row, $index });
}

function deleteElement({ $index }) {
    props.elementList.splice($index, 1);
}

function setRowClass({ row }) {
    return tableHasChildren(row) ? '' : 'hidden-expand-icon';
}

function tableCanHasChildren(row: MyElement) {
    return row.type == 'DataTable' || props.innerTable;
}

function tableHasChildren(row: MyElement) {
    return (row.type == 'DataTable' || props.innerTable) && row.columnList != null && row.columnList.length > 0;
}
</script>
