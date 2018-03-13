
export class Math {
    constructor() {}

    /* *******************************检测方法**************************** */
    /**
     * 是否是数字(正数、负数、小数)
     * @param num
     */
    isNumber(num) {
        if (typeof num === 'string') {
            const regExp = new RegExp('^(-)?\\d*(\\.\\d{1,})?$', 'g');
            return regExp.test(num)
        } else {
            return typeof num === 'number' && isFinite(num)
        }
    }
    /**
     * 转换为number类型
     * @param num
     */
    toNumber(num) {
        if (typeof num === 'string') {
            return Number(num)
        }
        return num
    }
    /**
     * 是否是整数(正数、负数)
     * @param num
     */
    isInterger(num) {
        if (typeof num === String) {
            const regExp = new RegExp('^(-)?\\d*$', 'g');
            return regExp.test(num)
        } else {
            return Number.isInteger(num)
            // 源码实现：注意此方法 5.0 -> true
            // typeof num === 'number' && isFinite(num) && this.floor(num) === num
        }
    }
    /**
     * 是否是固定位数小数
     * @param num
     * @param decimals
     */
    isFixDecimals(num, decimals) {
        const sNumber = String(num);
        if (typeof sNumber === String) {
            const regExp = new RegExp(`^(-)?\\d*\\.\\d{${decimals}}$`, 'g');
            return regExp.test(sNumber)
        }
    }
    /**
     * 是否是最多几位数小数
     * @param num
     * @param decimals
     */
    isMaxDecimals(num, decimals) {
        const sNumber = String(num);
        if (typeof sNumber === String) {
            const regExp = new RegExp(`^(-)?\\d*\\.\\d{1,${decimals}}$`, 'g');
            return regExp.test(sNumber)
        }
    }

    /* ******************************Math方法**************************** */
    /**
     * 固定小数(四舍五入)
     * @param num 数字
     * @param decimals 几位小数
     */
    toFixed(num, decimals) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return num.toFixed(decimals)
    }
    /**
     * 上舍入
     * @param num 数字
     */
    ceil(num) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return Math.ceil(num)
    }
    /**
     * 下舍入
     * @param num 数字
     */
    floor(num) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return Math.floor ? Math.floor(num) : parseInt(num, 10)
    }
    /**
     * 绝对值
     * @param num 数字
     */
    abs(num) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        const number = this.toNumber(num);
        return Math.abs
            ? Math.abs(number)
            : String(number).replace(/^-/, function(value) {
                return value ? -number : number
            })
    }

    /* ******************************封装扩展方法**************************** */
}

export default new Math()