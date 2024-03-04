<template>
  
  <div ref="wrapperRef" class="drag-wrapper" :style="style"></div>

</template>

<script setup lang="ts">
import {Container} from "@cp-print/design/types/entity";
import {computed, CSSProperties, onMounted, ref} from "vue";

const props = withDefaults(defineProps<{
  data?: Container & { visible: boolean, opacity: number, transitionAnime: boolean }
}>(), {
  data: () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    transitionAnime: false
  } as Container & { visible: boolean, opacity: number, transitionAnime: boolean })
})

const wrapperRef = ref<HTMLElement>()

onMounted(() => {
  wrapperRef.value!.addEventListener('transitionend', function () {
    // console.log('动画结束');
    props.data.visible = false
    props.data.transitionAnime = false
    // 在这里执行你的代码
  }, false);
})

const style = computed(() => {
  // console.log(props.data.x)
  const iStyle = {
    left: props.data.x + 'px',
    top: props.data.y + 'px',
    width: props.data.width + 'px',
    height: props.data.height + 'px',
    opacity: props.data.opacity,
    // maxWidth: widthValueUnit(element),
    // maxHeight: heightValueUnit(element),
  } as CSSProperties
  if (props.data.transitionAnime) {
    iStyle.transition = 'left .32s cubic-bezier(0, 0, 0.02, 0.97) 0s, ' +
        'top .32s cubic-bezier(0, 0, 0.02, 0.97) 0s'
  }
  return iStyle
})
</script>

<style scoped lang="scss">
.drag-wrapper {
  position: absolute;
  background: #f0f2f5;
  //background: gray;
  border: 1px solid gray;
}
</style>
