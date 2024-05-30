<template>
    <el-container style="height: calc(100vh - 100px);">
        <el-aside width="200px">
            <el-input
                v-model="data.nameFilter"
                placeholder="Filter keyword" />
            <el-tree
                style="max-width: 600px"
                :data="data.moduleGroupList"
                :props="defaultProps"
                default-expand-all
                :indent="0"
                empty-text="">
                <template #default="{ node, data }">
                    <module-item @click="handleNodeClick" v-if="node.isLeaf" :node="node" />
                    <ModuleGroupView v-else :node="node" />
                </template>
            </el-tree>
        </el-aside>
        <el-main class="module-right_main">
            <div class="module-header display-flex">
                <div class="module-header_title">模版列表</div>
                <el-button type="primary" :icon="Setting" @click="toFieldSetting">字段设置</el-button>
                <el-button type="primary" :icon="Coin" @click="toPreviewData">预览数据管理</el-button>
            </div>
            <el-scrollbar class="module-list-scrollbar">
                <div class="module-list display-flex display-flex-wrap">
                    <el-card class="module-item_card" v-for="(template, index) in data.templateList"
                             :key="index">
                        <div class="module-item_card_cover">
                        
                        </div>
                        <!--                                                <el-image style="width: 100px; height: 100px"-->
                        <!--                                                          src="https://fastly.picsum.photos/id/878/200/200.jpg?hmac=94qVwjVC5mGEAO1cRdaRSvxxUhth4qBsz66dnax2riY"-->
                        <!--                                                          fit="contain" />-->
                        <div class="module-item_card_tool display-flex">
                            <div class="module-item_card_tool_template_title"></div>
                            <el-button type="primary" :icon="Delete" />
                            <el-button @click="editTemplate(template)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-button>
                        </div>
                    </el-card>
                </div>
            
            </el-scrollbar>
            <div class="module-page_wrapper display-flex">
                <el-pagination
                    v-model:current-page="data.currentPage"
                    v-model:page-size="data.pageSize"
                    :page-sizes="[32, 64, 128]"
                    background
                    layout="prev, pager, next, sizes, jumper"
                    :total="400"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { moduleGroupList } from '@/api/moduleGroup';
import { onMounted, reactive } from 'vue';
import { Module, ModuleGroup, PageParam, Template } from '@/types/R';
import { useRouter } from 'vue-router';
import { templatePage } from '@/api/template';
import ModuleItem from '@/views/module/module-item.vue';
import ModuleGroupView from '@/views/module/module-group.vue';
import { moduleDetail } from '@/api/module';
import { Coin, Delete, Edit, Setting } from '@element-plus/icons-vue';

defineOptions({
    name: 'module'
});

const defaultProps = {
    children: 'moduleList',
    label: 'name'
};

const data = reactive({
    currentPage: 1,
    pageSize: 32,
    fieldSettingVisible: false,
    moduleGroupList: [] as ModuleGroup[],
    moduleId: null as number,
    module: null as Module,
    templateList: [] as Array<Template>,
    nameFilter: ''
});
const router = useRouter();

function handleSizeChange(val: any) {
    data.pageSize = val;
}

function handleCurrentChange(val: any) {
    data.currentPage = val;
    // 加载数据
}

const handleNodeClick = (module: Module) => {
    moduleDetail(module.id)
        .then(res => {
            data.module = res.data;
            data.moduleId = res.data.id;
        })
        .catch(e => {
            console.log(e);
        });
    
    templatePage(<Template & PageParam>{
        current: 1,
        size: 50,
        moduleId: module.id
    })
        .then(res => {
            data.templateList = res.data.records;
            // for (let i = 0; i < 10; i++) {
            //     data.templateList.push(data.templateList[0]);
            // }
        })
        .catch(e => {
            console.log(e);
        });
    
};

onMounted(() => {
    moduleGroupList(<PageParam & ModuleGroup>{
        current: 1,
        size: 50,
        name: null
    })
        .then(res => {
            console.log(res);
            data.moduleGroupList = res.data;
            
            if (data.moduleGroupList.length > 0) {
                handleNodeClick(data.moduleGroupList[0].moduleList[0]);
            }
            
        });
});

function toFieldSetting() {
    router.push({
        path: '/providerSetting',
        query: {
            moduleId: data.module.id
        }
    });
}

function toPreviewData() {
    router.push({
        path: '/previewData',
        query: {
            moduleId: data.module.id
        }
    });
}

function editTemplate(module: Module) {
    router.push({
        path: '/design',
        query: {
            moduleId: module.id,
            templateId: module.id
        }
    });
}

</script>

<style scoped>
.infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

.infinite-list .infinite-list-item + .list-item {
    margin-top: 10px;
}
</style>
