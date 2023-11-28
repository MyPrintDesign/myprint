<template>
  <div class="width-100-p height-100-p">
    <div v-if="element.data != null" class="img_wrapper">
      <img
          ref="imgRef"
          draggable="false"
          @load="loadImg"
          :style="{width: valueUnit(element.width), height: valueUnit(element.height)}"
          :src="contentBase64" alt="image"/>
      
      <div class="img-tool_wrapper" v-if="displayModelPreview()">
        <el-icon class="img-tool-icon" @click="editImgClick">
          <Crop/>
        </el-icon>
        <el-icon class="img-tool-icon">
          <MoreFilled/>
        </el-icon>
      </div>
    </div>
    <div class="choose-img_wrapper" v-else>
      <el-icon class="avatar-uploader-icon" @click="chooseImg">
        <Plus/>
      </el-icon>
      <input type="file" ref="uploadFileRef" style="visibility: hidden"
             accept="image/png, image/jpeg, image/jpg" @change="selectImg($event)">
    </div>
    <el-dialog
        v-model="data.cropVisible"
        width="640px"
        title="图片裁剪"
        append-to-body>
      <div style="width: 600px; height: 500px">
<!--        <VueCropper ref="cropper"-->
<!--                    :img="sourceBase64"-->
<!--                    :outputSize="option.outputSize"-->
<!--                    :outputType="option.outputType"-->
<!--                    :info="option.info"-->
<!--                    :canScale="option.canScale"-->
<!--                    :autoCrop="option.autoCrop"-->
<!--                    :autoCropWidth="option.autoCropWidth"-->
<!--                    :autoCropHeight="option.autoCropHeight"-->
<!--                    :fixed="option.fixed"-->
<!--                    :fixedNumber="option.fixedNumber"-->
<!--                    :full="option.full"-->
<!--                    :fixedBox="option.fixedBox"-->
<!--                    :canMove="option.canMove"-->
<!--                    :canMoveBox="option.canMoveBox"-->
<!--                    :original="option.original"-->
<!--                    :centerBox="option.centerBox"-->
<!--                    :height="option.height"-->
<!--                    :infoTrue="option.infoTrue"-->
<!--                    :maxImgSize="option.maxImgSize"-->
<!--                    :enlarge="option.enlarge"-->
<!--                    :mode="option.mode"-->
<!--                    @realTime="realTime"-->
<!--                    @imgLoad="imgLoad">-->
<!--        </VueCropper>-->
      
      </div>
      <div class="image-handle-wrapper">
        <el-icon class="image-handle-icon" @click="imageZoomIn">
          <ZoomIn/>
        </el-icon>
        <el-icon class="image-handle-icon" @click="imageZoomOut">
          <ZoomOut/>
        </el-icon>
        <el-icon class="image-handle-icon" @click="rotateLeft">
          <RefreshLeft/>
        </el-icon>
        <el-icon class="image-handle-icon" @click="rotateRight">
          <RefreshRight/>
        </el-icon>
        <el-icon class="image-handle-icon-sure" @click="sureClip">
          <Check/>
        </el-icon>
      </div>
    
    </el-dialog>
  
  </div>
</template>
<script setup lang="ts">
// import { ElIcon, ElDialog } from 'element-plus'
// import 'vue-cropper/dist/index.css'
// import {VueCropper} from 'vue-cropper'

import {onMounted, reactive, ref} from "vue";
import {Element} from "@cp-print/design/types/entity";
// import {useBase64} from "@vueuse/core";
import {
  // aspectRatioHeight,
  displayModelPreview,
  handleAspectRatioHeight,
  valueUnit
} from "@cp-print/design/utils/elementUtil";
import {
  Crop,
  MoreFilled,
  Plus,
  RefreshLeft,
  RefreshRight,
  ZoomIn,
  ZoomOut,
  Check
} from "@element-plus/icons-vue";
import {unit2px} from "@cp-print/design/utils/devicePixelRatio";

const props = withDefaults(defineProps<{
  element?: Element
}>(), {
  element: () => ({} as Element)
})
// type s = typeof VueCropper
const cropper = ref({} as InstanceType<any>)
const uploadFileRef = ref<HTMLInputElement>()
const sourceBase64 = ref()
const contentBase64 = ref()
const option = {
  outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
  outputType: 'jpeg', //裁剪生成图片的格式（jpeg || png || webp）
  info: true, //图片大小信息
  canScale: true, //图片是否允许滚轮缩放
  autoCrop: true, //是否默认生成截图框
  autoCropWidth: unit2px(props.element.width), //默认生成截图框宽度
  autoCropHeight: unit2px(props.element.height), //默认生成截图框高度
  fixed: false, //是否开启截图框宽高固定比例
  fixedNumber: [props.element.width, props.element.height], //截图框的宽高比例
  full: false, //false按原比例裁切图片，不失真
  fixedBox: false, //固定截图框大小，不允许改变
  canMove: true, //上传图片是否可以移动
  canMoveBox: true, //截图框能否拖动
  original: false, //上传图片按照原始比例渲染
  centerBox: false, //截图框是否被限制在图片里面
  height: true, //是否按照设备的dpr 输出等比例图片
  infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
  maxImgSize: 3000, //限制图片最大宽度和高度
  enlarge: 1, //图片根据截图框输出比例倍数
  mode: '600px 600px' //图片默认渲染方式
}
console.log(option)
const data = reactive({
  cropVisible: false,
  dragFlag: false
})

onMounted(() => {
  props.element.runtimeOption.onDragStart = () => {
    data.dragFlag = true
  }
})

function editImgClick() {
  data.cropVisible = true
}

// function realTime(_data: any) {
  // console.log(data)
  // let that = this
  // that.previews = data
  
// }

function imageZoomIn() {
  cropper.value.changeScale(1)
}

function imageZoomOut() {
  cropper.value.changeScale(-1)
  
}

function rotateLeft() {
  cropper.value.rotateLeft()
}

function rotateRight() {
  cropper.value.rotateRight()
}

function sureClip() {
  cropper.value.getCropBlob((result: any) => {
    blobToDataURI(result, function (res: any) {
      // console.log(res)
      // that.previewImg = res
      props.element.data = res
      contentBase64.value = res
      data.cropVisible = false
    })
  })
}

function blobToDataURI(blob: any, callback: any) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (e) {
    callback(e.target!.result);
  }
}

// function imgLoad() {
//
// }

function selectImg(event: any) {
  let file = event.target.files[0]
  if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(event.target.value)) {
    // this.$message({
    //   message: '图片类型要求：jpeg、jpg、png',
    //   type: "error"
    // });
    return false
  }
  // console.log('选择图片')
  //转化为blob
  let reader = new FileReader()
  reader.onload = (e) => {
    // console.log('选择图片1', e.target.result)
    if (typeof e.target!.result === 'object') {
      sourceBase64.value = window.URL.createObjectURL(new Blob([e.target!.result!]))
      // console.log('选择图片3')
    } else {
      sourceBase64.value = e.target!.result
      props.element.data = sourceBase64.value
      // console.log(sourceBase64.value)
      // console.log('选择图片2', props.element.data)
    }
    contentBase64.value = sourceBase64.value
  }
  //转化为base64
  reader.readAsDataURL(file)
}

function chooseImg(_ev: any) {
  if (data.dragFlag) {
    data.dragFlag = false
    return
  }
  uploadFileRef.value!.click()
}

const imgRef = ref<HTMLImageElement>()
onMounted(() => {
  if (!props.element.data) {
    return
  }
  fetch(props.element.data)
      .then(async res => {
        const blob = res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          // console.log(1)
          sourceBase64.value = reader.result
          contentBase64.value = reader.result
          // console.log(contentBase64.value)
        };
        reader.readAsDataURL(await blob);
      })
})

function loadImg() {
  const ratioTmp = imgRef.value!.width / imgRef.value!.height
  props.element.option.aspectRatio = ratioTmp
  handleAspectRatioHeight(props.element)
  return ratioTmp
}


</script>
<style scoped>
.choose-img_wrapper {
  width: 100%;
  height: 100%;
}

.img_wrapper {
  display: flex;
}

.img_wrapper:hover .img-tool_wrapper {
  visibility: visible;
}

.img-tool_wrapper {
  width: 50px;
  height: 30px;
  color: white;
  background: var(--drag-h-color);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 5px;
  right: 0;
  top: 0;
  z-index: 1;
  
  .img-tool-icon {
    font-size: 20px;
    margin: 0 2px;
  }
}

.avatar-uploader-icon {
  background-color: #fafafa;;
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  text-align: center;
}

.image-handle-wrapper {
  height: 44px;
  width: 200px;
  margin: 20px auto 0 auto;
  padding-left: 22px;
  padding-right: 22px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  display: flex;
  background: #606266;
  
  .image-handle-icon {
    color: white;
    font-size: 20px;
    margin: auto 10px;
  }
  
  .image-handle-icon-sure {
    color: #65DB79;
    font-size: 20px;
    margin: auto 10px;
  }
}
</style>
