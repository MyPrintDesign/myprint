<template>
    <my-text v-if="element.type == 'Text'" :element="element" />
    <my-text v-else-if="element.type == 'TextTime'" :element="element" />
    <my-text v-else-if="element.type == 'PageNum'" :element="element" />
    <my-image v-else-if="element.type === 'Image'" :element="element" />
    <my-rect v-else-if="element.type === 'Rect'" :element="element" />
    <my-horizontal-line v-else-if="element.type === 'HorizontalLine'" :element="element" />
    <my-vertical-line v-else-if="element.type === 'VerticalLine'" :element="element" />
    <my-dotted-horizontal-line v-else-if="element.type === 'DottedHorizontalLine'" :element="element" />
    <my-dotted-vertical-line v-else-if="element.type === 'DottedVerticalLine'" :element="element" />
    <svg-polygon-line v-else-if="element.type === 'SvgPolygonLine'" :element="element" />
    <svg-circle v-else-if="element.type === 'SvgCircle'" :element="element" />
    <svg-ellipse v-else-if="element.type === 'SvgEllipse'" :element="element" />
    <svg-line v-else-if="element.type === 'SvgLine'" :element="element" />
    <svg-bezier-curve v-else-if="element.type === 'SvgBezierCurve'" :element="element" />
    <svg-bezier-curve-three v-else-if="element.type === 'SvgBezierCurveThree'" :element="element" />
    <draw-panel v-else-if="element.type === 'DrawPanel'" :element="element" />
</template>
<script setup lang="ts">
import MyText from './text';
import MyImage from './image';
import { MyDottedHorizontalLine, MyDottedVerticalLine, MyHorizontalLine, MyVerticalLine, MyRect } from './shape';

import { MyElement } from '@myprint/design/types/entity';
import SvgPolygonLine from '@myprint/design/components/design/svg/svg-polygon-line.vue';
import SvgCircle from '@myprint/design/components/design/svg/svg-circle.vue';
import DrawPanel from '@myprint/design/components/design/svg/draw-panel.vue';
import SvgLine from '@myprint/design/components/design/svg/svg-line.vue';
import SvgBezierCurve from '@myprint/design/components/design/svg/svg-bezier-curve.vue';
import SvgBezierCurveThree from '@myprint/design/components/design/svg/svg-bezier-curve-three.vue';
import SvgEllipse from '@myprint/design/components/design/svg/svg-ellipse.vue';

withDefaults(defineProps<{
    element?: MyElement
}>(), {
    element: () => ({} as MyElement)
});
</script>
