// 函数类型
export function isFunction(func:any) {
  return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
}

// 对齐栅格
export function snapToGrid(grid:any, pendingX:any, pendingY:any, scale = 1) {
  const x = Math.round(pendingX / scale / grid[0]) * grid[0];
  const y = Math.round(pendingY / scale / grid[1]) * grid[1];
  return [x, y];
}

export function computeWidth(parentWidth:any, left:any, right:any) {
  return parentWidth - left - right;
}

export function computeHeight(parentHeight:any, top:any, bottom:any) {
  return parentHeight - top - bottom;
}

// 边界限制
export function restrictToBounds(value:any, min:any, max:any) {
  if (min !== null && value < min) {
    return min;
  }
  if (max !== null && max < value) {
    return max;
  }
  return value;
}
