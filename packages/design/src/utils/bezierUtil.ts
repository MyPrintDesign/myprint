export function bezier2(p0, p1, p2) {

    var bounds = {
        minX: Math.min(p0.x, p2.x),
        maxX: Math.max(p0.x, p2.x),
        minY: Math.min(p0.y, p2.y),
        maxY: Math.max(p0.y, p2.y)
    };

    // 对于二次贝塞尔曲线，我们可以通过求导并找到导数为0的点来找到最小和最大的 x 和 y 值
    var tForX = (p0.x - p1.x) / (p0.x - 2 * p1.x + p2.x);
    var tForY = (p0.y - p1.y) / (p0.y - 2 * p1.y + p2.y);

    // 需要确保 t 在 [0, 1] 范围内，因为贝塞尔曲线的参数范围是 [0, 1]
    if (tForX > 0 && tForX < 1) {
        var xAtT = (1 - tForX) * (1 - tForX) * p0.x + 2 * (1 - tForX) * tForX * p1.x + tForX * tForX * p2.x;
        bounds.minX = Math.min(bounds.minX, xAtT);
        bounds.maxX = Math.max(bounds.maxX, xAtT);
    }

    if (tForY > 0 && tForY < 1) {
        var yAtT = (1 - tForY) * (1 - tForY) * p0.y + 2 * (1 - tForY) * tForY * p1.y + tForY * tForY * p2.y;
        bounds.minY = Math.min(bounds.minY, yAtT);
        bounds.maxY = Math.max(bounds.maxY, yAtT);
    }

    // console.log("左边界: " + bounds.minX);
    // console.log("右边界: " + bounds.maxX);
    // console.log("上边界: " + bounds.minY);
    // console.log("下边界: " + bounds.maxY);
    return {
        x: bounds.minX,
        y: bounds.minY,
        width: bounds.maxX - bounds.minX,
        height: bounds.maxY - bounds.minY
    }
}

export function bezier3(p0, p1, p2, p3) {
    let minX = Math.min(p0.x, p3.x);
    let minY = Math.min(p0.y, p3.y);
    let maxX = Math.max(p0.x, p3.x);
    let maxY = Math.max(p0.y, p3.y);

    for (let t = 0; t <= 1; t += 0.01) {
        let x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        let y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    // console.log(p0, p1, p2, p3)
    // console.log("左边界: " + minX);
    // console.log("右边界: " + maxX);
    // console.log("上边界: " + minY);
    // console.log("下边界: " + maxY);
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    }

}
