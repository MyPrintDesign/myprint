<template>
  <div
      :style="{maxWidth: valueUnit(element.width)}">
    <div v-if="element.data != null">
      <img
          ref="imgRef"
          draggable="false"
          @load="loadImg"
          :style="{maxWidth: valueUnit(element.width)}"
          :src="contentBase64" alt="s"/>
      
      <div class="img-tool_wrapper">
        工具
      </div>
    </div>
    <div class="choose-img_wrapper" v-else>
      <el-button @click="chooseImg">选择</el-button>
      <input type="file" ref="uploadFileRef" style="visibility: hidden"
             accept="image/png, image/jpeg, image/jpg" @change="selectImg($event)">
    </div>
    
    <vue-cropper ref="cropper" :img="option.img" :outputSize="option.outputSize" :outputType="option.outputType"
                 :info="option.info" :canScale="option.canScale" :autoCrop="option.autoCrop"
                 :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixed="option.fixed"
                 :fixedNumber="option.fixedNumber" :full="option.full" :fixedBox="option.fixedBox"
                 :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
                 :centerBox="option.centerBox" :height="option.height" :infoTrue="option.infoTrue"
                 :maxImgSize="option.maxImgSize" :enlarge="option.enlarge" :mode="option.mode" @realTime="realTime"
                 @imgLoad="imgLoad">
    </vue-cropper>
  
  </div>
</template>
<script setup lang="ts">
import { ElButton } from 'element-plus'
import {computed, onMounted, PropType, ref, toRaw} from "vue";
import {Element} from "@cp-print/design/types/entity";
import {useBase64} from "@vueuse/core";
import {aspectRatioHeight, handleAspectRatioHeight, valueUnit} from "@cp-print/design/utils/elementUtil";

const props = defineProps({
  element: {type: Object as PropType<Element>, default: () => ({} as Element)}
})
const uploadFileRef = ref<HTMLInputElement>()
const contentBase64 = ref()
const option = {
  img: '',             //裁剪图片的地址
  outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
  outputType: 'png',  //裁剪生成图片的格式（jpeg || png || webp）
  info: true,          //图片大小信息
  canScale: true,      //图片是否允许滚轮缩放
  autoCrop: true,      //是否默认生成截图框
  autoCropWidth: 200,  //默认生成截图框宽度
  autoCropHeight: 200, //默认生成截图框高度
  fixed: false,         //是否开启截图框宽高固定比例
  fixedNumber: [1.53, 1], //截图框的宽高比例
  full: false,         //false按原比例裁切图片，不失真
  fixedBox: false,      //固定截图框大小，不允许改变
  canMove: true,      //上传图片是否可以移动
  canMoveBox: true,    //截图框能否拖动
  original: false,     //上传图片按照原始比例渲染
  centerBox: true,    //截图框是否被限制在图片里面
  height: false,        //是否按照设备的dpr 输出等比例图片
  infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
  maxImgSize: 3000,    //限制图片最大宽度和高度
  enlarge: 1,          //图片根据截图框输出比例倍数
  mode: '340px 300px'  //图片默认渲染方式
}

function realTime(data) {
  console.log(data)
  // let that = this
  // that.previews = data
  this.$refs.cropper.getCropBlob(data => {
    blobToDataURI(data, function (res) {
      console.log(res)
      // that.previewImg = res
    })
  })
}

function blobToDataURI(blob, callback) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function (e) {
    callback(e.target.result);
  }
}

function imgLoad() {

}

function selectImg(event) {
  let file = event.target.files[0]
  if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(event.target.value)) {
    // this.$message({
    //   message: '图片类型要求：jpeg、jpg、png',
    //   type: "error"
    // });
    return false
  }
  //转化为blob
  let reader = new FileReader()
  reader.onload = (e) => {
    if (typeof e.target.result === 'object') {
      contentBase64.value = window.URL.createObjectURL(new Blob([e.target.result]))
    } else {
      contentBase64.value = e.target.result
    }
  }
  //转化为base64
  reader.readAsDataURL(file)
}

function chooseImg(ev) {
  uploadFileRef.value.click()
}

const imgRef = ref<HTMLImageElement>()
onMounted(() => {
  fetch(props.element.data)
      .then(async res => {
        const blob = res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          // console.log(1)
          contentBase64.value = reader.result
          // console.log(contentBase64.value)
        };
        reader.readAsDataURL(await blob);
      })
})

function loadImg() {
  const ratioTmp = imgRef.value.width / imgRef.value.height
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
</style>
