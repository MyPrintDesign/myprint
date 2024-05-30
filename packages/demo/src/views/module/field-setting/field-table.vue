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
        <el-table-column prop="data" label="内容" />
        <el-table-column label="操作" width="120">
            <template #default="scope">
                
                <!--                        <el-icon>-->
                <!--                            <Top />-->
                <!--                        </el-icon>-->
                <!--                        <el-icon>-->
                <!--                            <Bottom />-->
                <!--                        </el-icon>-->
                <!--                        type="primary"-->
                <!--                        type="danger"-->
                <el-link v-if="tableCanHasChildren(scope.row)" @click="addTableElement(scope)">添加</el-link>
                <el-link @click="editElement(scope)">编辑</el-link>
                <el-link @click="deleteElement(scope)">删除</el-link>
            
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { elementTypeFormat, MyElement } from '@myprint/design/types/entity';
import { computed } from 'vue';
import { FieldEdit } from '@/types/entity';

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
