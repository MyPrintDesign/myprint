const MathCalc = {

    toFixed(x: number, scale = 2) {
        return parseFloat(x.toFixed(scale));
    },
    ceil(x: number, scale = 2) {
        let pow = Math.pow(10, scale)
        return Math.ceil(x * pow) / pow;
    },
    /**
     ** 加法函数，用来得到精确的加法结果
     ** 说明：javascript 的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
     ** 调用：sum(arg1,arg2)
     ** 返回值：arg1 加上 arg2 的精确结果
     **/
    sumScale(arg1: number, arg2: number, scale = 2) {
        return this.sum(this.toFixed(arg1, scale), this.toFixed(arg2, scale))
    },
    sum(arg1: number, arg2: number) {
        let r1, r2
        try {
            r1 = arg1.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        const c = Math.abs(r1 - r2)
        const m = Math.pow(10, Math.max(r1, r2))
        if (c > 0) {
            const cm = Math.pow(10, c)
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace('.', ''))
                arg2 = Number(arg2.toString().replace('.', '')) * cm
            } else {
                arg1 = Number(arg1.toString().replace('.', '')) * cm
                arg2 = Number(arg2.toString().replace('.', ''))
            }
        } else {
            arg1 = Number(arg1.toString().replace('.', ''))
            arg2 = Number(arg2.toString().replace('.', ''))
        }
        return (arg1 + arg2) / m
    },
    /**
     ** 减法函数，用来得到精确的减法结果
     ** 说明：javascript 的减法结果会有误差，在两个浮点 g2)会比较明显。这个函数返回较为精确的减法结果。
     ** 调用：sub(arg1,arg2)
     ** 返回值：arg1 加上 arg2 的精确结果
     **/
    subScale(arg1: number, arg2: number, scale = 2) {
        return this.sub(this.toFixed(arg1, scale), this.toFixed(arg2, scale))
    },
    sub(arg1: number, arg2: number) {
        let r1, r2
        try {
            r1 = arg1.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        const c = Math.abs(r1 - r2)
        const m = Math.pow(10, Math.max(r1, r2))
        if (c > 0) {
            const cm = Math.pow(10, c)
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace('.', ''))
                arg2 = Number(arg2.toString().replace('.', '')) * cm
            } else {
                arg1 = Number(arg1.toString().replace('.', '')) * cm
                arg2 = Number(arg2.toString().replace('.', ''))
            }
        } else {
            arg1 = Number(arg1.toString().replace('.', ''))
            arg2 = Number(arg2.toString().replace('.', ''))
        }
        return (arg1 - arg2) / m
    },
    /**
     ** 乘法函数，用来得到精确的乘法结果
     ** 说明：javascript 的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
     ** 调用：mul(arg1,arg2)
     ** 返回值：arg1 乘以 arg2 的精确结果
     **/
    mul(arg1: number, arg2: number) {
        let m = 0
        const s1 = arg1.toString()
        const s2 = arg2.toString()
        try {
            m += s1.split('.')[1].length
        } catch (e) {
            // console.log('🚀85 行 e ➡️', e)
        }
        try {
            m += s2.split('.')[1].length
        } catch (e) {
            // console.log('🚀90 行 e ➡️', e)
        }
        return ((Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
            Math.pow(10, m)
        )
    },
    /**
     ** 除法函数，用来得到精确的除法结果
     ** 说明：javascript 的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
     ** 调用：div(arg1,arg2)
     ** 返回值：arg1 除以 arg2 的精确结果
     **/
    div(arg1: number, arg2: number) {
        let t1 = 0,
            t2 = 0
        try {
            t1 = arg1.toString().split('.')[1].length
        } catch (e) {
            // console.log('🚀109 行 e ➡️', e)
        }
        try {
            t2 = arg2.toString().split('.')[1].length
        } catch (e) {
            // console.log('🚀114 行 e ➡️', e)
        }
        const r1 = Number(arg1.toString().replace('.', ''))
        const r2 = Number(arg2.toString().replace('.', ''))
        return (r1 / r2) * Math.pow(10, t2 - t1)
    },
}
export default MathCalc

export function _default<T = any>(val: T, _default: T) {
    return val ? val : _default
}

export function _defaultNum(val: number, _default: number) {
    return !val || isNaN(val) ? _default : val
}
