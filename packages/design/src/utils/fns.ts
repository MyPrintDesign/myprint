// 函数类型
export function isFunction(func) {
  return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
}

// 对齐栅格
export function snapToGrid(grid, pendingX, pendingY, scale = 1) {
  const x = Math.round(pendingX / scale / grid[0]) * grid[0];
  const y = Math.round(pendingY / scale / grid[1]) * grid[1];
  return [x, y];
}

export function computeWidth(parentWidth, left, right) {
  return parentWidth - left - right;
}

export function computeHeight(parentHeight, top, bottom) {
  return parentHeight - top - bottom;
}

// 边界限制
export function restrictToBounds(value, min, max) {
  if (min !== null && value < min) {
    return min;
  }
  if (max !== null && max < value) {
    return max;
  }
  return value;
}
