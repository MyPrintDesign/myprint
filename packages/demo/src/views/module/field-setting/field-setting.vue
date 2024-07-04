<template>
    <el-card class="filed-setting_content_table">
        <el-button @click="addElement({elementList: props.elementList})">添加字段</el-button>
        <field-table :element-list="elementList" @add="addElement" @edit="editElement" />
    </el-card>
    
    <!--    表单-->
    <el-dialog
        v-model="data.elementEditDialogVisible"
        :title="data.addIs == 1? '添加字段': '编辑字段'"
        width="600"
        align-center>
        <el-form ref="formRef"
                 :model="data.elementForm"
                 label-width="100px"
                 :rules="rules"
                 class="demo-dynamic">
            <el-form-item prop="label" label="名称">
                <el-input v-model="data.elementForm.label" />
            </el-form-item>
            <el-form-item prop="field" label="字段">
                <el-input v-model="data.elementForm.field" />
            </el-form-item>
            <el-form-item prop="type" label="类型">
                <el-select v-model="data.elementForm.type" placeholder="请选择类型" style="width: 240px">
                    <el-option
                        v-for="(item, index) in getSelectElementTypeList()"
                        :key="index"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            
            <el-form-item prop="data" label="内容" v-if="dataTypeList.includes(data.elementForm.type)">
                <el-input v-model="data.elementForm.data" v-if="data.elementForm.type != 'Image'"
                          type="textarea"
                          style="width: 240px">
                </el-input>
                <template v-else>
                    <div v-if="data.elementForm.data == null || data.elementForm.data == ''" class="choose-image"
                         @click="clickChooseImageDialog">添加图片
                    </div>
                    <div v-else class="display-image">
                        <img class="display-image_img" :src="data.elementForm.data" alt="" />
                        <div class="display-image_remove" @click="imageRemove" />
                    </div>
                </template>
            
            </el-form-item>
            
            <el-form-item prop="type" label="内容类型"
                          v-if="data.elementForm.type == 'Text' || data.elementForm.type == 'TextTime'">
                <el-select v-model="data.elementForm.contentType" placeholder="Select" style="width: 240px">
                    <el-option
                        v-for="(item, index) in textContentTypes"
                        :key="index"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            
            <el-form-item label="条码编码" v-model="data.elementForm.option.barCodeType"
                          v-if="data.elementForm.contentType == 'Barcode'">
                <el-select v-model="data.elementForm.option.barCodeType" placeholder="Select" style="width: 240px">
                    <el-option
                        v-for="(item, index) in barcodeTypes"
                        :key="index"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
                <el-tooltip
                    popper-class="barcode-type-tooltip"
                    effect="dark"
                    :max-width="200"
                    :content="currentBarCodeEg"
                    placement="top"
                >
                    <el-icon style="margin-left: 5px" :size="14">
                        <QuestionFilled />
                    </el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="条码值" v-if="data.elementForm.contentType == 'Barcode'">
                <el-switch
                    v-model="data.elementForm.option.barCodeDisplayValIs"
                    class="ml-2"
                    inline-prompt
                    style="--el-switch-on-color: var(--drag-h-color); --el-switch-off-color: var(--switch-off-color)"
                    active-text="显示"
                    inactive-text="隐藏" />
            </el-form-item>
            
            <!--            <el-form-item prop="type" label="表格字段">-->
            <!--                <el-link @click="editTableField">编辑表格字段</el-link>-->
            <!--            </el-form-item>-->
            
            <el-form-item prop="width" label="宽/高">
                <my-group>
                    <el-input-number class="width-60 custom-input-number" v-model="data.elementForm.width"
                                     :controls="false" />
                    <el-input-number class="width-60 custom-input-number" v-model="data.elementForm.height"
                                     :controls="false" />
                </my-group>
            </el-form-item>
            
            <el-form-item label="字体/大小" v-if="fontTypeList.includes(data.elementForm.type)">
                <my-group>
                    <el-select v-model="data.elementForm.option.fontFamily" placeholder="Select" style="width: 240px">
                        <el-option
                            v-for="(item, index) in fontList[0]"
                            :key="index"
                            :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="data.elementForm.option.fontSize" style="width: 100px" />
                </my-group>
            </el-form-item>
        
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="confirmEdit">确定</el-button>
            </div>
        </template>
    </el-dialog>
    
    <!--    选择图片-->
    <el-dialog
        class="choose-image-type-dialog"
        v-model="data.chooseImageVisible"
        width="520px"
        align-center
        :show-close="false"
        :show-header="false"
        append-to-body>
        
        <div class="choose-image-type-dialog-header display-flex">
            <my-tabs class="choose-image-type-dialog-header_tab" v-model="data.chooseImageType"
                     :item-list="chooseImgTypeList" />
            <el-icon color="#666666" size="20" class="cursor-pointer" @click="data.chooseImageVisible = false">
                <CloseBold />
            </el-icon>
        </div>
        
        <div class="choose-image-localFile-panel display-flex" v-if="data.chooseImageType == 'localFile'">
            <div class="choose-image-localFile-btn" @click="clickChooseImage">上传本地图片</div>
        </div>
        
        <div class="choose-image-url-panel display-flex-column" v-if="data.chooseImageType == 'url'">
            <el-form :model="data" style="width: 90%">
                <el-form-item
                    prop="inputImageUrl"
                    ref="imageUrlRef"
                    :rules="[{
          required: true,
          message: '请输入图片网址',
          trigger: ['blur', 'change'],
        },{
        pattern: /^https?:\/\//,
          message: '请输入正确图片网址',
          trigger: ['blur', 'change'],
        }]">
                    <el-input v-model="data.inputImageUrl" placeholder="请输入图片网址" />
                </el-form-item>
            </el-form>
            <div class="choose-image-url-btn" @click="confirmImageUrl">确认</div>
        </div>
    </el-dialog>
    
    <input type="file" ref="uploadFileRef" style="display: none;"
           accept="image/png, image/jpeg, image/jpg" @change="selectImg($event)">
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Module } from '@/types/R';
import { ElementOption, elementType, elementTypeFormat, MyElement } from '@myprint/design/types/entity';
import { CloseBold, QuestionFilled } from '@element-plus/icons-vue';
import MyGroup from '@myprint/design/components/my/group/my-group.vue';
import { barcodeTypes, chooseImgTypeList, fontList, textContentTypes } from '@myprint/design/constants/common';
import MyTabs from '@myprint/design/components/my/tabs/my-tabs.vue';
import FieldTable from '@/views/module/field-setting/field-table.vue';
import { FieldEdit } from '@/types/entity';
import { FormInstance } from 'element-plus';

defineOptions({
    name: 'fieldSetting'
});
const emit = defineEmits(['cancel', 'save']);

const props = withDefaults(defineProps<{
    elementList: MyElement[]
    elementTypeConstList: elementType[]
}>(), {
    elementList: () => [] as MyElement[],
    elementTypeConstList: () => [] as elementType[]
});

const dataTypeList: elementType[] = ['Text', 'Image'];
const fontTypeList: elementType[] = ['Text', 'TextTime', 'DataTable'];

const elementTypeTableConstList = ['Text', 'TextTime', 'Image'] as elementType[];

const elementTypeList: any[] = props.elementTypeConstList.map(key => {
    return {
        label: elementTypeFormat[key],
        value: key
    };
});

const elementTypeTableList: any[] = elementTypeTableConstList.map(key => {
    return {
        label: elementTypeFormat[key],
        value: key
    };
});

function getSelectElementTypeList() {
    if (data.elementType) {
        switch (data.elementType) {
            case 'DataTable':
                return elementTypeTableList;
        }
    }
    
    return elementTypeList;
}

const data = reactive({
    addIs: 0,
    elementType: null as elementType,
    module: null as Module,
    row: null as MyElement,
    tmpElementList: [] as MyElement[],
    elementForm: {} as MyElement,
    elementEditDialogVisible: false,
    chooseImageVisible: false,
    tableEditDrawerVisible: false,
    inputImageUrl: null,
    chooseImageType: 'localFile'
});
const uploadFileRef = ref<HTMLInputElement>();
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

const imageUrlRef = ref<any>();

const currentBarCodeEg = computed(() => {
    if (data.elementForm.option && data.elementForm.option.barCodeType) {
        return barcodeTypes.find(v => v.value == data.elementForm.option.barCodeType)!.eg;
    }
});

function clickChooseImage(_ev: any) {
    uploadFileRef.value!.click();
}

function selectImg(event: any) {
    
    let file = event.target.files[0];
    if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(event.target.value)) {
        // this.$message({
        //   message: '图片类型要求：jpeg、jpg、png',
        //   type: "error"
        // });
        return false;
    }
    // console.log('选择图片')
    //转化为blob
    let reader = new FileReader();
    let sourceBase64;
    reader.onload = (e) => {
        // console.log('选择图片1', e.target.result)
        if (typeof e.target!.result === 'object') {
            sourceBase64 = window.URL.createObjectURL(new Blob([e.target!.result!]));
            // console.log('选择图片3')
        } else {
            sourceBase64 = e.target!.result;
            // console.log(sourceBase64.value)
            // console.log('选择图片2', props.element.data)
        }
        // contentBase64.value = sourceBase64.value
        data.elementForm.data = sourceBase64;
        
        data.chooseImageVisible = false;
        // data.cropVisible = true
    };
    //转化为base64
    reader.readAsDataURL(file);
}

function editElement(fieldEdit: FieldEdit) {
    data.addIs = 0;
    data.row = fieldEdit.row;
    data.elementType = fieldEdit.elementType;
    // console.log(data.row);
    data.elementForm = { ...fieldEdit.row };
    if (data.elementForm.option == null) {
        data.elementForm.option = {} as ElementOption;
    }
    data.elementEditDialogVisible = true;
}

function confirmImageUrl() {
    imageUrlRef.value.validate()
        .then(res => {
            // console.log(res);
            data.elementForm.data = data.inputImageUrl;
            data.chooseImageVisible = false;
        }).catch(err => {
        console.log(err);
    });
    
}

function clickChooseImageDialog() {
    data.chooseImageVisible = true;
}

function imageRemove() {
    data.elementForm.data = null;
}

function addElement(fieldEdit: FieldEdit) {
    data.addIs = 1;
    data.row = null;
    data.elementType = fieldEdit.elementType;
    data.tmpElementList = fieldEdit.elementList;
    data.elementForm = {
        id: crypto.randomUUID(),
        type: 'Text',
        contentType: 'Text',
        width: 50,
        height: 10,
        option: {
            fontFamily: 'default',
            fontSize: 13
        }
    } as MyElement;
    data.elementEditDialogVisible = true;
}

function cancelEdit() {
    data.elementEditDialogVisible = false;
    data.elementForm = {
        option: {
            fontSize: 13
        }
    } as MyElement;
}

function confirmEdit() {
    formRef.value.validate((valid, fields) => {
        if (valid) {
            if (data.row == null) {
                data.tmpElementList.push(data.elementForm);
            } else {
                Object.assign(data.row, data.elementForm);
                data.row = null;
            }
            data.elementEditDialogVisible = false;
        } else {
            // console.log('error submit!', fields)
        }
    });
}

function save() {
    emit('save');
}

</script>
