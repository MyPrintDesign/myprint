<template>
    
    <div ref="wrapperRef" class="drag-wrapper" :style="style"></div>

</template>

<script setup lang="ts">
import { Container } from '@myprint/design/types/entity';
import { computed, CSSProperties, onMounted, ref } from 'vue-demi';

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
});

const wrapperRef = ref<HTMLElement>();

onMounted(() => {
    wrapperRef.value!.addEventListener('transitionend', function() {
        // console.log('动画结束');
        props.data.visible = false;
        props.data.transitionAnime = false;
    }, false);
});

const style = computed(() => {
    // console.log(props.data.x)
    const iStyle = {
        left: props.data.x + 'px',
        top: props.data.y + 'px',
        width: props.data.width + 'px',
        height: props.data.height + 'px',
        opacity: props.data.opacity
        // maxWidth: widthValueUnit(element),
        // maxHeight: heightValueUnit(element),
    } as CSSProperties;
    if (props.data.transitionAnime) {
        iStyle.transition = 'left .42s cubic-bezier(0, 0, 0.02, 0.97) 0s, ' +
            'top .42s cubic-bezier(0, 0, 0.02, 0.97) 0s';
    }
    return iStyle;
});
</script>
