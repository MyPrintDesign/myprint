<template>
    <div class="width-100-p height-100-p">
        <div v-if="element.data != null" class="img_wrapper">
            <img
                ref="imgRef"
                draggable="false"
                @load="loadImg"
                :style="{width: valueUnit(element.width, getRecursionParentPanel(element)), height: valueUnit(element.height, getRecursionParentPanel(element))}"
                :src="contentBase64" alt="image" />
            
            <div class="img-tool_wrapper"
                 v-if="displayDesign(element) && elementHandleStatusList.includes(element.runtimeOption.status)">
                <my-icon class="img-tool-icon" @click="editImgClick">
                    <Crop />
                </my-icon>
                <!--        <el-icon class="img-tool-icon">-->
                <!--          <MoreFilled/>-->
                <!--        </el-icon>-->
            </div>
        </div>
        <div class="choose-img_wrapper" v-else>
            <my-icon v-if="displayDesign(element)"
                     :size="20"
                     class="avatar-uploader-icon" @click="clickPlus">
                <Plus />
            </my-icon>
        
        </div>
        <my-dialog
            class="image-crop-dialog"
            v-model="data.cropVisible"
            width="640px"
            title="图片裁剪">
            <div style="width: 640px; height: 640px">
                <VueCropper ref="cropper"
                            :img="sourceBase64"
                            :outputSize="option.outputSize"
                            :outputType="option.outputType"
                            :info="option.info"
                            :canScale="option.canScale"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :fixed="element.option.keepRatio"
                            :fixedNumber="option.fixedNumber"
                            :full="option.full"
                            :fixedBox="option.fixedBox"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :original="option.original"
                            :centerBox="option.centerBox"
                            :height="option.height"
                            :infoTrue="option.infoTrue"
                            :maxImgSize="option.maxImgSize"
                            :enlarge="option.enlarge"
                            :mode="option.mode"
                            @realTime="realTime"
                            @imgLoad="imgLoad">
                </VueCropper>
            
            </div>
            <div class="image-handle-wrapper">
                <my-icon class="image-handle-icon" @click="imageZoomIn">
                    <ZoomIn />
                </my-icon>
                <my-icon class="image-handle-icon" @click="imageZoomOut">
                    <ZoomOut />
                </my-icon>
                <my-icon class="image-handle-icon" @click="rotateLeft">
                    <RefreshLeft />
                </my-icon>
                <my-icon class="image-handle-icon" @click="rotateRight">
                    <RefreshRight />
                </my-icon>
                <my-icon class="image-handle-icon-sure" @click="sureClip">
                    <Check />
                </my-icon>
            </div>
        
        </my-dialog>
        
        <my-dialog
            class="choose-image-type-dialog"
            :show-header="false"
            v-model="data.chooseImageVisible"
            @close="handleCloseChooseImageDialog"
            width="520px">
            
            <div class="choose-image-type-dialog-header display-flex">
                <!--        <div class="choose-image-type-dialog-header_tab">-->
                <!--          <div class="choose-image-type-dialog-header-title">本地上传</div>-->
                <!--          <div class="choose-image-type-dialog-header-title">图片链接</div>-->
                <!--        </div>-->
                <my-tabs class="choose-image-type-dialog-header_tab" v-model="data.chooseImageType"
                         :item-list="chooseImgTypeList" />
                <my-icon color="#666666" size="20" class="cursor-pointer" @click="data.chooseImageVisible = false">
                    <CloseBold />
                </my-icon>
            </div>
            
            <div class="choose-image-localFile-panel display-flex" v-if="data.chooseImageType == 'localFile'">
                <div class="choose-image-localFile-btn" @click="chooseImage">上传本地图片</div>
            </div>
            
            <div class="choose-image-url-panel display-flex display-flex-column" v-if="data.chooseImageType == 'url'">
                <my-input class="choose-image-url-input" placeholder="请输入网络地址http/https"
                          v-model="imageHttpUrlInput" />
                
                <div class="choose-image-url-btn" @click="clickSureImageHttpUrl">
                    确认
                </div>
            </div>
        </my-dialog>
        
        <input type="file" ref="uploadFileRef" style="visibility: hidden"
               accept="image/png, image/jpeg, image/jpg" @change="selectImg($event)">
    
    </div>
</template>
<script setup lang="ts">
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { onMounted, reactive, ref } from 'vue-demi';
import { MyElement } from '@myprint/design/types/entity';
// import {useBase64} from "@vueuse/core";
import {
    displayDesign,
    getRecursionParentPanel,
    valueUnit
} from '@myprint/design/utils/elementUtil';
import { unit2px } from '@myprint/design/utils/devicePixelRatio';
import { chooseImgTypeList, elementHandleStatusList } from '@myprint/design/constants/common';
import MyTabs from '@myprint/design/components/my/tabs/my-tabs.vue';
import MyDialog from '@myprint/design/components/my/dialog/my-dialog.vue';
import MyIcon from '@myprint/design/components/my/icon/my-icon.vue';
import Crop from '@myprint/design/components/my/icon/icons/Crop.vue';
import Plus from '@myprint/design/components/my/icon/icons/Plus.vue';
import ZoomIn from '@myprint/design/components/my/icon/icons/ZoomIn.vue';
import ZoomOut from '@myprint/design/components/my/icon/icons/ZoomOut.vue';
import RefreshLeft from '@myprint/design/components/my/icon/icons/RefreshLeft.vue';
import RefreshRight from '@myprint/design/components/my/icon/icons/RefreshRight.vue';
import Check from '@myprint/design/components/my/icon/icons/Check.vue';
import CloseBold from '@myprint/design/components/my/icon/icons/CloseBold.vue';
import { downloadImg2Base64 } from '@myprint/design/utils/utils';
import MyInput from '@myprint/design/components/my/input/my-input.vue';
import { isEmpty } from 'lodash';
import { MyMessage } from '@myprint/design/components/my/message/my-message';

const props = withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});
// type s = typeof VueCropper
const cropper = ref({} as InstanceType<any>);
const uploadFileRef = ref<HTMLInputElement>();
const sourceBase64 = ref();
const contentBase64 = ref();
const imageHttpUrlInput = ref('');

const option = reactive({
    outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
    outputType: 'png', //裁剪生成图片的格式（jpeg || png || webp）
    info: true, //图片大小信息
    canScale: true, //图片是否允许滚轮缩放
    autoCrop: true, //是否默认生成截图框
    autoCropWidth: unit2px(props.element.width, getRecursionParentPanel(props.element)), //默认生成截图框宽度
    autoCropHeight: unit2px(props.element.height, getRecursionParentPanel(props.element)), //默认生成截图框高度
    fixed: true, //是否开启截图框宽高固定比例
    fixedNumber: [props.element.width, props.element.height], //截图框的宽高比例
    full: true, //false按原比例裁切图片，不失真
    fixedBox: false, //固定截图框大小，不允许改变
    canMove: true, //上传图片是否可以移动
    canMoveBox: true, //截图框能否拖动
    original: false, //上传图片按照原始比例渲染
    centerBox: false, //截图框是否被限制在图片里面
    height: true, //是否按照设备的dpr 输出等比例图片
    infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
    maxImgSize: 3000, //限制图片最大宽度和高度
    enlarge: 1, //图片根据截图框输出比例倍数
    mode: '640px 640px' //图片默认渲染方式
});

// console.log(option)
const data = reactive({
    cropVisible: false,
    chooseImageVisible: false,
    dragFlag: false,
    chooseImageType: 'localFile'
});

function editImgClick() {
    data.cropVisible = true;
}

function realTime(_data: any) {
    // console.log(data)
    // let that = this
    // that.previews = data
    
}

function imageZoomIn() {
    cropper.value.changeScale(1);
}

function imageZoomOut() {
    cropper.value.changeScale(-1);
    
}

function rotateLeft() {
    cropper.value.rotateLeft();
}

function rotateRight() {
    cropper.value.rotateRight();
}

function sureClip() {
    cropper.value.getCropBlob((result: any) => {
        blobToDataURI(result, function(res: any) {
            // console.log(res)
            // that.previewImg = res
            props.element.data = res;
            contentBase64.value = res;
            data.cropVisible = false;
        });
    });
}

function blobToDataURI(blob: any, callback: any) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(e) {
        callback(e.target!.result);
    };
}

function imgLoad() {

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
    reader.onload = (e) => {
        // console.log('选择图片1', e.target.result)
        if (typeof e.target!.result === 'object') {
            sourceBase64.value = window.URL.createObjectURL(new Blob([e.target!.result!]));
            // console.log('选择图片3')
        } else {
            sourceBase64.value = e.target!.result;
            props.element.data = sourceBase64.value;
            // console.log(sourceBase64.value)
            // console.log('选择图片2', props.element.data)
        }
        contentBase64.value = sourceBase64.value;
        
        data.chooseImageVisible = false;
        // data.cropVisible = true
    };
    //转化为base64
    reader.readAsDataURL(file);
}

function clickSureImageHttpUrl() {
    if (isEmpty(imageHttpUrlInput.value)) {
        MyMessage.error('请输入图片地址');
    }
    if (!imageHttpUrlInput.value.startsWith('http') && !imageHttpUrlInput.value.startsWith('https')) {
        MyMessage.error('图片地址需要以http/https开头');
    }
    props.element.data = imageHttpUrlInput.value;
    loadData();
}

function handleCloseChooseImageDialog() {
    imageHttpUrlInput.value = '';
}

function clickPlus(_ev: any) {
    data.chooseImageVisible = true;
    // uploadFileRef.value!.click()
}

function chooseImage(_ev: any) {
    uploadFileRef.value!.click();
}

const imgRef = ref<HTMLImageElement>();
onMounted(() => {
    loadData();
});

function loadData() {
    if (!props.element.data) {
        return;
    }
    if ((props.element.data as string).startsWith('http')) {
        downloadImg2Base64(props.element.data)
            .then(base64 => {
                sourceBase64.value = base64;
                contentBase64.value = base64;
            }).catch(_e => {
            
        });
    } else {
        sourceBase64.value = props.element.data;
        contentBase64.value = props.element.data;
    }
}

function loadImg() {
    // console.log(props.element, imgRef);
    // if (imgRef.value!) {
    //     const ratioTmp = imgRef.value!.width / imgRef.value!.height;
    // }
}
</script>
