<template>
    <div class="filed-setting_wrapper">
        <div class="filed-setting_content display-flex">
            <el-card style="width: 450px">
                <el-form ref="formRef"
                         :model="data.provider"
                         label-width="auto"
                         :rules="rules">
                    
<!--                    <el-form-item label="模版名称">-->
<!--                        <el-input v-model="data.provider.name"-->
<!--                                  type="textarea"-->
<!--                                  :placeholder="i18n('common.width')"-->
<!--                                  size="small"-->
<!--                                  style="margin-right: 20px" />-->
<!--                    </el-form-item>-->
                    
                    <el-form-item label="单位" prop="region">
                        <el-select v-model="data.provider.pageUnit"
                                   class="width-60"
                                   size="small">
                            <el-option
                                v-for="item in pageUnitList"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="纸张" prop="region">
                        <el-select v-model="data.provider.pageSize" class="width-80" placeholder="请选择" size="small"
                                   @change="changePageUnit">
                            <el-option
                                v-for="item in pageSizeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item prop="width" label="宽/高">
                        <my-group>
                            <el-input-number class="width-60 custom-input-number" v-model="data.provider.width"
                                             :controls="false" />
                            <el-input-number class="width-60 custom-input-number" v-model="data.provider.height"
                                             :controls="false" />
                        </my-group>
                    </el-form-item>
                    
                    
                    <el-form-item label="水印内容" v-if="data.provider.watermark">
                        <el-input v-model="data.provider.watermarkContent"
                                  :placeholder="i18n('common.width')"
                                  size="small"
                                  historyLabel="水印内容"
                                  style="margin-right: 20px" />
                    </el-form-item>
                    
                    <el-form-item label="边界限制">
                        <el-switch
                            v-model="data.provider.dragSnapPanelIs"
                            class="ml-2"
                            inline-prompt
                            :active-value="1"
                            :inactive-value="0"
                            style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                            active-text="开"
                            inactive-text="关" />
                    </el-form-item>
                    
                    <el-form-item label="拖动磁吸">
                        <el-switch
                            v-model="data.provider.dragSnapIs"
                            class="ml-2"
                            inline-prompt
                            :active-value="1"
                            :inactive-value="0"
                            style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                            active-text="开"
                            inactive-text="关" />
                    </el-form-item>
                </el-form>
            </el-card>
            
            <field-setting :elementTypeConstList="elementTypeConstList" :element-list="data.provider.elementList" />
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
import { onMounted, reactive, ref } from 'vue';
import { Module } from '@/types/R';
import { elementType, MyElement, Provider, TableHeadProviderCellElement } from '@myprint/design/types/entity';
import FieldSetting from '@/views/module/field-setting/field-setting.vue';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { FormInstance } from 'element-plus';
import { pageSizeList, pageUnitList } from '@myprint/design/constants/common';
import { i18n } from '@myprint/design/locales';
import { stringify } from '@myprint/design/utils/utils';

defineOptions({
    name: 'providerSetting'
});

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();

const checkWidthHeight = (_rule: any, _value: any, callback: any) => {
    if (data.elementForm.width == null || data.elementForm.height == null) {
        callback(new Error('请输入宽/高'));
    }
    callback();
};

const rules = reactive({
    label: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    field: [{ required: true, message: '请输入变量字段', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
    width: [{ required: true, validator: checkWidthHeight, trigger: 'change' }]
});

const moduleId = route.query.moduleId as any;
const elementTypeConstList = ['Text', 'TextTime', 'Image', 'DataTable', 'Rect', 'HorizontalLine', 'DottedHorizontalLine', 'VerticalLine', 'DottedVerticalLine'] as elementType[];
const data = reactive({
    module: null as Module,
    row: {} as MyElement,
    elementForm: {} as MyElement,
    elementEditDialogVisible: false,
    chooseImageVisible: false,
    inputImageUrl: null,
    chooseImageType: 'localFile',
    provider: {} as Provider
});

onMounted(() => {
    moduleDetail(moduleId)
        .then(res => {
            data.module = res.data;
            data.provider = JSON.parse(data.module.provider) as Provider;
            // console.log(data.provider);
            for (let element of data.provider.elementList) {
                element.id = crypto.randomUUID();
                if (element.columnList) {
                    setId(element.columnList);
                }
            }
            if (data.provider.pageUnit == null) {
                data.provider.pageUnit = 'mm';
            }
        });
});

function setId(columnList: TableHeadProviderCellElement[]) {
    for (let element of columnList) {
        element.id = crypto.randomUUID();
        if (element.columnList) {
            setId(element.columnList);
        }
    }
}

function save() {
    // 保存
    data.module.provider = stringify(data.provider, 'id');
    data.module.previewData = null;
    moduleUpdate(data.module)
        .then(res => {
            console.log('保存成功', res);
        }).catch(e => {
        console.error(e);
    });
}

function back() {
    router.go(-1);
}

function changePageUnit(val: any) {
    for (let valueElement of pageSizeList) {
        if (valueElement.value == val) {
            data.provider.width = valueElement.width;
            data.provider.height = valueElement.height;
            break;
        }
    }
}
</script>
