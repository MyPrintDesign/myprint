<template>
    <el-container style="height: calc(100vh - 60px);">
        <el-aside width="240px"
                  class="display-flex-column"
                  style="background: rgb(248, 248, 248); padding-right: 6px; border-right: 1px solid rgb(233, 233, 233);">
            <div class="module-list-filter display-flex">
                <el-input
                    v-model="data.nameFilter"
                    @change="filterChange"
                    style=" margin-left: 5px; width: calc(100% - 5px)"
                    placeholder="过滤" />
                <el-button class="module-list-filter-add" type="primary" plain :icon="Plus"
                           @click="addModuleGroup" />
            </div>
            <el-tree
                :data="data.moduleGroupList"
                :props="defaultProps"
                default-expand-all
                node-key="id"
                ref="elTreeRef"
                class="module-list-tree"
                :indent="0"
                empty-text="">
                <template #default="{ node, data }">
                    <ModuleGroupView v-if="data.groupIs" :node="node" @addModule="groupAddModule"
                                     @rename="renameModuleGroup" @delete="deleteModuleGroup" />
                    <module-item @click="handleNodeClick" v-else :node="node" @rename="renameModule"
                                 @delete="deleteModule" />
                </template>
            </el-tree>
            
            <div>123</div>
        </el-aside>
        <el-main class="module-right_main">
            <div class="module-header display-flex">
                <div class="module-header_title">模版列表</div>
                <el-button type="primary" plain :icon="Plus" @click="editTemplate(null)">新增模版</el-button>
                <el-button type="primary" plain :icon="Setting" @click="toFieldSetting">字段设置</el-button>
                <el-button type="primary" plain :icon="Coin" @click="toPreviewData">预览数据管理</el-button>
            </div>
            <el-scrollbar class="module-list-scrollbar">
                <el-empty class="module-list-empty" v-if="data.templateList.length == 0" description="暂无数据" />
                <div v-else class="module-list">
                    <el-card class="module-item_card"
                             shadow="hover"
                             v-for="(template, index) in data.templateList"
                             :key="index">
                        <div class="display-flex display-flex-column">
                            <div v-if="template.lockIs == 1" class="module-item_card_lock">
                                <el-icon>
                                    <Lock />
                                </el-icon>
                            </div>
                            <el-image class="module-item_card_cover"
                                      :src="getImgUrl(template.coverImgUrl)"
                                      :zoom-rate="1.02"
                                      hide-on-click-modal
                                      :preview-src-list="[getImgUrl(template.coverImgUrl)]"
                                      fit="cover" />
                            
                            <div class="module-item_card_tool display-flex">
                                <div class="module-item_card_tool_template_title display-flex">
                                    {{ template.name }}
                                </div>
                                <el-link @click="editTemplate(template)"
                                         :underline="false"
                                         class="module-item_card_tool_edit"
                                         :icon="Edit" />
                                <popover-menu-list :menu-list="data.menuList"
                                                   :item="template"
                                                   v-model:visible="template.moreVisible"
                                                   placement="top">
                                    <el-link :underline="false"
                                             class="module-item_card_tool_edit"
                                             @click.stop="template.moreVisible = true"
                                             :icon="More" />
                                </popover-menu-list>
                            </div>
                        </div>
                    </el-card>
                </div>
            
            </el-scrollbar>
            <el-divider style="margin: 0" />
            <div class="module-page_wrapper display-flex">
                <el-pagination
                    v-model:current-page="data.currentPage"
                    v-model:page-size="data.pageSize"
                    :page-sizes="[32, 64, 128]"
                    background
                    layout="prev, pager, next, sizes, jumper"
                    :total="data.dataTotal"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-main>
    </el-container>
    
    <rename-dialog v-model="data.renameVisible"
                   @confirm="confirmTemplateRename"
                   :name-value="data.renameModuleName" />
    
    <delete-dialog v-model="data.deleteVisible"
                   @confirm="confirmTemplateDelete"
                   :name="data.deleteModuleName" />
    
    <el-dialog
        v-model="data.addModuleGroupVisible"
        title="添加"
        width="400">
        <el-radio-group v-model="data.addModuleGroupType">
            <el-radio-button label="分组" value="GROUP" />
            <el-radio-button label="模块" value="MODULE" />
        </el-radio-group>
        
        <div class="add_module_group_wrapper" v-if="data.addModuleGroupType == 'GROUP'">
            <el-form-item label="模块名" label-width="100px">
                <el-input style="width: 240px"
                          placeholder="请输入模块名"
                          v-model="data.addModuleGroup.name" />
            </el-form-item>
        </div>
        <div class="add_module_group_wrapper" v-else>
            <el-form-item label="分组" label-width="100px">
                <el-select
                    v-model="data.addModule.moduleGroupId"
                    placeholder="请选择分组"
                    style="width: 240px">
                    <el-option
                        v-for="(item) in data.dbModuleGroupList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="模块名" label-width="100px">
                <el-input style="width: 240px"
                          placeholder="请输入模块名"
                          v-model="data.addModule.name" />
            </el-form-item>
        </div>
        
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelAddModule">取消</el-button>
                <el-button type="primary"
                           :disabled="emptyIs(data.addModuleGroup.name) && emptyIs(data.addModule.name)"
                           @click="clickAddModuleSure">确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { moduleGroupDelete, moduleGroupList, moduleGroupSave, moduleGroupUpdate } from '@/api/moduleGroup';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Module, ModuleGroup, PageParam, R, Template } from '@/types/R';
import { useRouter } from 'vue-router';
import { templateDelete, templatePage, templateUpdate } from '@/api/template';
import ModuleItem from '@/views/module/module-item.vue';
import ModuleGroupView from '@/views/module/module-group.vue';
import { moduleCreate, moduleDelete, moduleDetail, moduleUpdate } from '@/api/module';
import { Coin, Edit, Lock, More, Plus, Setting } from '@element-plus/icons-vue';
import RenameDialog from '@/components/dialog/rename-dialog.vue';
import PopoverMenuList from '@/components/popover/popover-menu-list.vue';
import { MenuItem } from '@/types/entity';
import DeleteDialog from '@/components/dialog/delete-dialog.vue';
import { emptyIs, msgError, msgSuccess } from '@/utils/util';
import { ElMessage } from 'element-plus';

defineOptions({
    name: 'module'
});

const defaultProps = {
    children: 'moduleList',
    label: 'name'
};

const data = reactive({
    menuList: [
        {
            name: '重命名', click: (template: Template) => {
                data.renameVisible = true;
                data.renameModuleName = template.name;
                data.template = template;
            }
        },
        {
            name: '删除', click: (template: Template) => {
                data.deleteVisible = true;
                data.deleteModuleName = template.name;
                data.template = template;
                // console.log(template);
            }
        }
    
    ] as MenuItem[],
    addModule: {
        moduleGroupId: 1,
        name: '',
        provider: '{}'
    } as Module,
    addModuleGroup: {
        name: ''
    } as ModuleGroup,
    currentPage: 1,
    pageSize: 32,
    dataTotal: 0,
    fieldSettingVisible: false,
    dbModuleGroupList: [] as ModuleGroup[],
    moduleGroupList: [] as ModuleGroup[],
    moduleId: null as number,
    module: {} as Module,
    template: {} as Template,
    templateList: [] as Array<Template>,
    nameFilter: '',
    moreVisible: false,
    renameVisible: false,
    deleteVisible: false,
    addModuleGroupVisible: false,
    renameModuleName: null,
    deleteModuleName: null,
    addModuleGroupType: 'GROUP'
});

const elTreeRef = ref();
const router = useRouter();

function getImgUrl(url: string) {
    if (url == null || url == '') {
        return 'https://fastly.picsum.photos/id/519/200/200.jpg?hmac=7MwcBjyXrRX5GB6GuDATVm_6MFDRmZaSK7r5-jqDNS0';
    } else {
        return url;
    }
}

function filterChange() {
    // console.log(data.moduleGroupList);
}

function addModuleGroup() {
    data.addModuleGroupVisible = true;
}

function groupAddModule(moduleGroup: ModuleGroup) {
    data.addModuleGroupType = 'MODULE';
    data.addModule.moduleGroupId = moduleGroup.id;
    data.addModuleGroupVisible = true;
}

function cancelAddModule() {
    data.addModuleGroup.name = '';
    data.addModule.name = '';
    data.addModuleGroupVisible = false;
}

function renameModuleGroup(moduleGroup: ModuleGroup, name: string) {
    moduleGroupUpdate({
        id: moduleGroup.id,
        name
    }).then(_res => {
        refreshModuleList(false);
    }).catch(e => {
        ElMessage.error(e.msg);
    });
}

function renameModule(module: Module, name: string) {
    moduleUpdate({
        id: module.id,
        name
    }).then(_res => {
        refreshModuleList(false);
    }).catch(e => {
        ElMessage.error(e.msg);
    });
}

function deleteModuleGroup(moduleGroup: ModuleGroup) {
    moduleGroupDelete({
        id: moduleGroup.id
    }).then(_res => {
        msgSuccess('删除成功');
        refreshModuleList(false);
    }).catch(e => {
        msgError(e.msg);
    });
}

function deleteModule(module: Module) {
    moduleDelete({
        id: module.id
    }).then(_res => {
        refreshModuleList(false);
        msgSuccess('删除成功');
    }).catch(e => {
        msgError(e.msg);
    });
}

function confirmTemplateRename(name: string) {
    templateUpdate({
        id: data.template.id,
        name
    }).then(_res => {
        data.deleteVisible = false;
        refreshModuleList(false);
    }).catch(e => {
        ElMessage.error(e.msg);
    });
}

function confirmTemplateDelete() {
    templateDelete({
        id: data.template.id
    }).then(_res => {
        data.deleteVisible = false;
        refreshTemplateList();
    }).catch(e => {
        ElMessage.error(e.msg);
    });
}

function clickAddModuleSure() {
    let result: Promise<R>;
    if (data.addModuleGroupType == 'GROUP') {
        result = moduleGroupSave(data.addModuleGroup);
    } else {
        result = moduleCreate(data.addModule);
    }
    result.then(_res => {
        msgSuccess('添加成功');
        cancelAddModule();
        refreshModuleList(false);
    }).catch(e => {
        msgError(e.msg);
    });
}

function handleSizeChange(val: any) {
    data.pageSize = val;
}

function handleCurrentChange(val: any) {
    data.currentPage = val;
    // 加载数据
}

const handleNodeClick = (module: Module) => {
    data.module.id = module.id;
    moduleDetail(module.id)
        .then(res => {
            data.module = res.data;
        })
        .catch(e => {
            msgError(e.msg);
        });
    refreshTemplateList();
};

onMounted(() => {
    refreshModuleList();
});

function refreshModuleList(defaultOne = true) {
    moduleGroupList(<PageParam & ModuleGroup>{
        current: 1,
        size: 9999999,
        name: null
    }).then(res => {
        data.dbModuleGroupList = res.data;
        data.moduleGroupList = res.data;
        
        if (defaultOne) {
            if (data.moduleGroupList.length > 0) {
                nextTick(() => {
                    elTreeRef.value.setCurrentKey(data.moduleGroupList[0].moduleList[0].id, true);
                });
                handleNodeClick(data.moduleGroupList[0].moduleList[0]);
            }
        }
    }).catch(e => {
        msgError(e.msg);
    });
}

function refreshTemplateList() {
    templatePage(<Template & PageParam>{
        current: data.currentPage,
        size: data.pageSize,
        moduleId: data.module.id
    }).then(res => {
        data.templateList = res.data.records;
        data.dataTotal = res.data.total;
        // for (let i = 0; i < 10; i++) {
        //     data.templateList.push(data.templateList[0]);
        // }
    }).catch(e => {
        msgError(e.msg);
    });
}

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

function editTemplate(template: Template) {
    router.push({
        path: '/design',
        query: {
            moduleId: data.module.id,
            id: template?.id
        }
    });
}

</script>
