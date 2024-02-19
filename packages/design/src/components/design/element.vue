<template>
  <cp-text v-if="element.type == 'Text'" :element="element"/>
  <cp-text v-else-if="element.type == 'TextTime'" :element="element"/>
  <cp-text v-else-if="element.type == 'PageNum'" :element="element"/>
  <cp-image v-else-if="element.type === 'Image'" :element="element"/>
  <cp-rect v-else-if="element.type === 'Rect'" :element="element"/>
  <cp-horizontal-line v-else-if="element.type === 'HorizontalLine'" :element="element"/>
  <cp-vertical-line v-else-if="element.type === 'VerticalLine'" :element="element"/>
  <cp-dotted-horizontal-line v-else-if="element.type === 'DottedHorizontalLine'" :element="element"/>
  <cp-dotted-vertical-line v-else-if="element.type === 'DottedVerticalLine'" :element="element"/>
  <svg-polygon-line v-else-if="element.type === 'SvgPolygonLine'" :element="element"/>
  <svg-circle v-else-if="element.type === 'SvgCircle'" :element="element"/>
  <svg-ellipse v-else-if="element.type === 'SvgEllipse'" :element="element"/>
  <svg-line v-else-if="element.type === 'SvgLine'" :element="element"/>
  <svg-bezier-curve v-else-if="element.type === 'SvgBezierCurve'" :element="element"/>
  <svg-bezier-curve-three v-else-if="element.type === 'SvgBezierCurveThree'" :element="element"/>
  <draw-panel v-else-if="element.type === 'DrawPanel'" :element="element"/>
</template>
<script setup lang="ts">
import CpText from './text'
import CpImage from "./image";
import {CpDottedHorizontalLine, CpDottedVerticalLine, CpHorizontalLine, CpVerticalLine, CpRect} from "./auxiliary";

import {CpElement} from "@cp-print/design/types/entity";
import SvgPolygonLine from "@cp-print/design/components/design/svg/svgPolygonLine.vue";
import SvgCircle from "@cp-print/design/components/design/svg/svgCircle.vue";
import DrawPanel from "@cp-print/design/components/design/svg/drawPanel.vue";
import SvgLine from "@cp-print/design/components/design/svg/svgLine.vue";
import SvgBezierCurve from "@cp-print/design/components/design/svg/svgBezierCurve.vue";
import SvgBezierCurveThree from "@cp-print/design/components/design/svg/svgBezierCurveThree.vue";
import SvgEllipse from "@cp-print/design/components/design/svg/svgEllipse.vue";

withDefaults(defineProps<{
  element?: CpElement
}>(), {
  element: () => ({} as CpElement)
})
</script>
