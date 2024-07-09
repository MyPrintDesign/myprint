import { MyElement, Line, Point } from '@myprint/design/types/entity'
import * as d3Selection from 'd3-selection'

// import {unit2px} from "@myprint/design/utils/devicePixelRatio";

// export function computeLineAngle(lineA: Line, lineB: Line) {
//     // controlLineStart
//     // 线段1的起点和终点坐标
//     // var line1Start = {x: 0, y: 0};
//     // var line1End = {x: 1, y: 1};
//
// // 线段2的起点和终点坐标
// //     var line2Start = {x: 0, y: 0};
// //     var line2End = {x: 1, y: -1};
//     if (true) {
//         return calculateAngleBetweenSegments(lineA.start.x, lineA.start.y,
//             lineA.end.x, lineA.end.y,
//             lineB.start.x, lineB.start.y,
//             lineB.end.x, lineB.end.y
//         )
//     }
//
// // 计算线段1的方向向量
//     var vec1 = {x: lineA.end.x! - lineA.start.x!, y: lineA.end.y! - lineA.start.y!};
//
// // 计算线段2的方向向量
//     var vec2 = {x: lineB.end.x - lineB.start.x, y: lineB.end.y - lineB.start.y};
//
// // 计算向量的点积
//     var dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
//
// // 计算向量的模长
//     var length1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
//     var length2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
//
// // 计算夹角的余弦值
//     var cosine = dotProduct / (length1 * length2);
//
// // 将余弦值转换为角度值
//     var rad = Math.acos(cosine);
//     var angle = rad * (180 / Math.PI);
//
//     console.log("两条线段的夹角为：" + angle + "度");
//
//     return rad
// }

// 计算两个线段之间的夹角（支持到360度）
export function computeLineAngle(lineA: Line, lineB: Line) {
    var dx1 = lineA.end.x - lineA.start.x
    var dy1 = lineA.end.y - lineA.start.y
    var dx2 = lineB.end.x - lineB.start.x
    var dy2 = lineB.end.y - lineB.start.y

    var angle1 = Math.atan2(dy1, dx1)
    var angle2 = Math.atan2(dy2, dx2)

    var angle = angle2 - angle1
    if (angle < 0) {
        angle += 2 * Math.PI
    }
    return angle
    // return angle * (180 / Math.PI);
}

// 弧度转角度
export function rad2Ang(angle: number) {
    return angle * (180 / Math.PI)
}


export function rotatePoint(centerX, centerY, x, y, angle) {
    // console.log(centerX, centerY, x, y, angle)
    return {
        x: centerX + Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY),
        y: centerY + Math.sin(angle) * (x - centerX) + Math.cos(angle) * (y - centerY)
    }
}

export function dist(p, m) {
    if (!m) {
        return 0
    }
    return Math.sqrt((p[0] - m.x) ** 2 + (p[1] - m.y) ** 2)
}


export function updateSvg(chart, svgOptions, draw) {
    // console.log(draw())
    const element = svgOptions.element as MyElement
    const chartSvg = d3Selection.select(chart)
    const path = draw(chartSvg)
    if (path) {
        chartSvg.select('.u-path')
            // .style('stroke', 'white')
            .style('stroke', element.option.color ? element.option.color : 'black')
            // .style("stroke", element.option.color ? element.option.color : "white")
            .style('fill', element.option.background ? element.option.background : 'none')
            // .attr("stroke-width", 1.9)
            .attr('opacity', element.option.opacity != undefined ? element.option.opacity : 1)
            .attr('d', path)
    }

    // .attr("transform", "rotate(45,100,100)")
    // .call(drag)


    // 辅助线/点
    if (svgOptions.drawAuxiliary) {
        if (svgOptions.allPoint) {
            chartSvg
                .selectAll('.u-point')
                .style('stroke', 'var(--drag-h-color)')
                .style('fill', 'var(--drag-h-color)')
                .style('display', null)

                .data(svgOptions.allPoint)
                .join(enter =>
                    enter
                        .append('g')
                        .classed('u-point', true)
                        .style('fill', 'white')
                        .call(g => {
                            g.append('circle').attr('r', 3)

                        })
                )
                .attr('transform', (d: Point) => `translate(${[d.x, d.y]})`)
        }

        if (svgOptions.virtualPoint) {
            chartSvg
                .selectAll('.uv-point')
                .style('stroke', 'var(--dnb-highlight-color)')
                .style('fill', 'var(--dnb-highlight-color)')
                .style('display', null)

                .data(svgOptions.virtualPoint)
                .join(enter =>
                    enter
                        .append('g')
                        .classed('uv-point', true)
                        .style('fill', 'white')
                        .call(g => {
                            g.append('circle').attr('r', 3)
                        })
                )
                .attr('transform', (d: Point) => `translate(${[d.x, d.y]})`)
        }

        if (svgOptions.controlLine) {
            chartSvg
                .selectAll('.u-line')
                .style('stroke', '#aaa')
                .style('display', null)
                .style('stroke-dasharray', '2 2')
                .data(svgOptions.controlLine)
                .join('line')
                .attr('x1', (d: Line) => d.start.x)
                .attr('y1', (d: Line) => d.start.y)
                .attr('x2', (d: Line) => d.end.x)
                .attr('y2', (d: Line) => d.end.y)
                .classed('u-line', true)
        }

    } else {
        chartSvg
            .selectAll('.u-point')
            .style('display', 'none')
        chartSvg.selectAll('.uv-point')
            .style('display', 'none')
        chartSvg.selectAll('.u-line')
            .style('display', 'none')
    }
    // console.log(JSON.stringify(points))

}
