<script setup lang="ts">
// import {onMounted, ref} from 'vue'
//
// import * as d3Path from "d3-path";
// import * as d3Array from "d3-array";
// import * as d3Selection from "d3-selection";
// import * as d3Darg from "d3-drag";
//
// const path = d3Path.path();
//
// const chartRef = ref()
//
// function aa() {
//   const x0 = 40,
//       y0 = 100,
//
//       x1 = 100,
//       y1 = 100,
//       x2 = 100,
//       y2 = 200,
//       x3 = 40,
//       y3 = 200;
//
//   const path = d3Path.path();
//   path.moveTo(x0, y0);
//   path.moveTo(x1, y1);
//   path.moveTo(y2, y2);
//   path.moveTo(x3, y3);
//   // path.rect(cpx, cpy, x, y);
//
//   // return chart;
//
//   /**
//    *  Add control elements and prepare interactions
//    */
//
//   const points = [[x0, y0], [x1, y1], [x2, y2], [x3, y3]],
//       // labels = ["Start", "Control", "End", '123'],
//       labels = [],
//       // lines = [[points[0], points[1]], [points[1], points[2]]],
//       lines = [],
//       draw = () => {
//         const path = d3Path.path();
//         path.moveTo(...points[0]);
//         path.lineTo(...points[1]);
//         path.lineTo(...points[2]);
//         path.lineTo(...points[3]);
//         // path.moveTo(...points[0]);
//         // path.rect(...points[1], ...points[2]);
//         path.closePath()
//
//         return path;
//       };
//
//   draggable(chartRef.value, points, labels, lines, draw);
// }
//
// onMounted(() => {
//   console.log(aa())
// })
//
// // function drag() {
// //
// //   function dragstarted(event, d) {
// //     console.log(d)
// //     // d3Selection.select(this).raise().attr("stroke", "black");
// //   }
// //
// //   function dragged(event, d) {
// //     console.log(d)
// //     // d3Selection.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
// //   }
// //
// //   function dragended(event, d) {
// //     // d3Selection.select(this).attr("stroke", null);
// //   }
// //
// //   return d3Darg.drag()
// //       .on("start", dragstarted)
// //       .on("drag", dragged)
// //       .on("end", dragended);
// // }
//
// function update(chart, points, labels, lines, draw) {
//   d3Selection.select(chart)
//       .select(".u-path")
//       .style("stroke", "orange")
//       .style("fill", "orange")
//       .attr("d", draw())
//   // .attr("transform", "rotate(45,100,100)")
//   // .call(drag)
//   ;
//
//   d3Selection.select(chart)
//       .selectAll(".u-point")
//       .style("stroke", "orange")
//
//       .data(points)
//       .join(enter =>
//           enter
//               .append("g")
//               .classed("u-point", true)
//               .call(g => {
//                 g.append("circle").attr("r", 3);
//                 g.append("text")
//                     .text((_d, i) => labels[i])
//                     .attr("dy", d => (d[1] > 100 ? 15 : -5));
//               })
//       )
//       .attr("transform", d => `translate(${d})`);
//
//   d3Selection.select(chart)
//       .selectAll(".u-line")
//       .style("stroke", "#aaa")
//       .style("stroke-dasharray", "2 2")
//       .data(lines)
//       .join("line")
//       .attr("x1", d => d[0][0])
//       .attr("y1", d => d[0][1])
//       .attr("x2", d => d[1][0])
//       .attr("y2", d => d[1][1])
//       .classed("u-line", true);
// }
//
// function draggable(chart, points, labels, lines, draw) {
//   update(chart, points, labels, lines, draw);
//
//   const dist = (p, m) => {
//     return Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2);
//   };
//
//   var subject, dx, dy;
//
//   function dragSubject(event) {
//     console.log('asdf')
//     const p = d3Selection.pointer(event.sourceEvent, chart);
//     subject = d3Array.least(points, (a, b) => dist(p, a) - dist(p, b));
//     if (dist(p, subject) > 48) subject = null;
//     if (subject)
//       d3Selection.select(chart)
//           .style("cursor", "hand")
//           .style("cursor", "grab");
//     else d3Selection.select(chart).style("cursor", null);
//     return subject;
//   }
//
//   d3Selection.select(chart)
//       // .on("mousemove", event => dragSubject({sourceEvent: event}))
//       .call(
//           d3Darg
//               .drag()
//               .subject(dragSubject)
//               .on("start", event => {
//                 if (subject) {
//                   d3Selection.select(chart).style("cursor", "grabbing");
//                   dx = subject[0] - event.x;
//                   dy = subject[1] - event.y;
//                 }
//               })
//               .on("drag", event => {
//                 if (subject) {
//                   subject[0] = event.x + dx;
//                   subject[1] = event.y + dy;
//                   console.log(123)
//                 } else {
//                   console.log(345)
//                 }
//               })
//               .on("end", () => {
//                 const width = d3Selection.select(chart)
//                     .select(".u-path")
//                     .node().getBoundingClientRect();
//                 console.log(width)
//                 d3Selection.select(chart).style("cursor", "grab");
//               })
//               .on("start.render drag.render end.render", () =>
//                   update(chart, points, labels, lines, draw)
//               )
//       );
// }
</script>

<template>
  <svg ref="chartRef" viewBox="0 0 450 300" class="chart">
<!--    <path class="u-path" :d="path"/>-->
    <line class="u-line"/>
    <line class="u-line"/>
  </svg>
</template>

<style scoped>
.chart {
  box-sizing: border-box;
  border: 1px black dashed;
  background: gray;
  width: 500px;
  height: 300px;
  overflow: visible;
}
</style>
