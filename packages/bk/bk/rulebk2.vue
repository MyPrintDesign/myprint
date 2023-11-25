<template>
  <!-- 刻度尺容 -->
    <canvas
        class="verticalRule"
        :style="{width: (ruleWidth/2)+'px',height: ruleHeight/2+'px'
  }" :class="{ruleRotate: direction == 'vertical', 'sticky-top': direction != 'vertical',
  'sticky-left': direction == 'vertical',
  }"
        ref="canvas" :width="ruleWidth" :height="ruleHeight"/>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, PropType, provide, ref, watch, watchEffect} from "vue";
import {getRatio, unit2px} from "../../design/src/utils/utils";

const props = defineProps({
  direction: {type: String, default: 'horizontal'},
  highlight: {type: Array, default: () => ([])},
  length: {default: 0},
})
const canvas = ref(null)

let height = 50;
const width = ref(0);

const ruleWidth = ref(0);
const ruleHeight = ref(0);
// const width = computed(() => {
//   console.log(Number.parseInt(props.length.toString()))
//   return
// })

// 可以直接侦听一个 ref
watch(() => props.highlight, (newQuestion, oldQuestion) => {
  drawRuler(0)
})

watchEffect(() => {
  
  width.value = unit2px(Number.parseInt(props.length.toString()) * 2) + 20
  if (width.value != 0) {
    // console.log(Number.parseInt(props.length.toString()))
    nextTick(() => {
      drawRuler(0)
    })
  }
  
  if (props.direction == 'horizontal') {
    ruleWidth.value = width.value
    ruleHeight.value = height
  } else {
    ruleWidth.value = height
    ruleHeight.value = width.value
  }
  
})

function drawRuler(count) {
  let cxt = canvas.value.getContext("2d");
  
  let division = getRatio() * 2; //每个刻度的距离 分割线
  
  let initParams = {
    height: height,
    background: true,
    color: true,
    markColor: "#FFCC33"
  };
  //刻度值数组
  let scaleValueList = [];
  for (let i = 0; i <= props.length; i += 10) {
    scaleValueList.push(i);
  }
  console.log(scaleValueList)
  
  //清空画布
  cxt.clearRect(0, 0, props.length, initParams.height);
  if(props.direction == 'vertical'){
    cxt.translate(0,  0);
    cxt.rotate(270 * Math.PI / 180)
  }

  //刻度尺背景
  if (initParams.background) {
    cxt.fillStyle = initParams.background;
    cxt.fillRect(0, 0, canvas.width, initParams.height);
  }
  
  //画刻度线
  for (let i = 0; i < props.length; i++) {
    cxt.beginPath();
    cxt.save();
    cxt.strokeStyle = initParams.color ? initParams.color : "#bbb";
    cxt.lineWidth = 2;
    cxt.lineCap = "round";
    let x
    if (props.direction === 'horizontal') {
      x = division * i - count * division + 10
    } else {
      x = props.length - (division * i - count * division) - 10
    }
    cxt.moveTo(x, 0);
    cxt.lineTo(x, Math.floor(initParams.height * 0.3));

    if (i % 2 === 0) {
      cxt.strokeStyle = initParams.color ? initParams.color : "#999";
      cxt.lineTo(x, Math.floor(initParams.height * 0.35));
    }
    if (i % 10 === 0) {
      cxt.strokeStyle = initParams.color ? initParams.color : "#666";
      cxt.lineTo(x, Math.floor(initParams.height * 0.52));
    }

    cxt.stroke();
    cxt.restore();
    cxt.closePath();
  }
  
  //添加体重数字
  cxt.beginPath();
  cxt.font = "14px Arial";
  cxt.fillStyle = initParams.color ? initParams.color : "#333";
  cxt.textAlign = "center";
  cxt.textBaseline = "middle";
  scaleValueList.forEach(function (num, i) {
    let x = ((division * i * 10) - (count * division))
    cxt.fillText(num.toString(), props.direction === 'horizontal' ? x + 10 : (props.length - x - 150), Math.floor(initParams.height * 0.78));
  });
  cxt.closePath();
  
  
  if (props.highlight?.length > 0) {
    props.highlight?.filter(val => {
      return val != null
    }).forEach(val => {
      //高亮
      cxt.beginPath();
      cxt.save();
      cxt.strokeStyle = initParams.markColor;
      cxt.lineWidth = 7;
      cxt.lineCap = "round";
      let highlightX = val * 2 + 9
      if (props.direction === 'horizontal') {
        // highlightX = highlightX
      } else {
        highlightX = props.length - highlightX
      }
      cxt.moveTo((highlightX), 0);
      cxt.lineTo((highlightX), Math.floor(initParams.height * 0.52));
      cxt.stroke();
      cxt.restore();
      cxt.closePath();
    })
    
  }
  
  
}

onMounted(() => {
  // console.log(canvas)
  if (window.devicePixelRatio) {
    // canvas.value.style.transform = "scale(" + 1 / window.devicePixelRatio + ")";
    // canvas.value.style.transformOrigin = "left top";
  }
  drawRuler(0);
})


</script>

<!--//transform-origin: 140px 140px;
  transform-origin: 290px 290px;


-->

<style scoped>
.verticalRule {

}

.sticky-left {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
}

.sticky-top {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
}

.ruleRotate {
  //transform: rotateZ(270deg);
}
</style>
