
export class Math {
    constructor() {}

    /* *******************************检测方法**************************** */
    isNumber(num) {
        if (typeof num === String) {
            const regExp = new RegExp('/d*(\./d*)?');
            return regExp.test(num)
        } else {
            return typeof num === 'number' && isFinite(num)
        }
    }

    /* ******************************Math方法**************************** */
    // 四舍五入
    toFixed(num, decimals) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return num.toFixed(decimals)
    }
    // 上舍入
    ceil(num) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return Math.ceil(num)
    }
    // 下舍入
    floor(num) {
        if (!this.isNumber(num)) {
            console.error('Unknown number', num);
            return
        }
        return Math.floor(num)
    }
}

export default new Math()