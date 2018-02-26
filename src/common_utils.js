export default {
    transNameStyle, // 转为命名风格
    setUrlQuery, // 修改url中的指定query参数
}

/**
 * 转为驼峰命名
 * @param {string} str 以短横线-命名的string
 * @returns {{transToHump: (function(*))}}
 */
transNameStyle = (str) => {
    const transToHump = (str) => {
        if (str.indexOf('-') < 0 && str.indexOf('') < 0) {
            return str; // 判断是否是连字符形式
        }

        str.replace(/-[^-]/g, (match) => {
            return match.slice(1).toUpperCase()
        })
    }

    const transToUnderLine = (str) => {
        return str.replace(/([A-Z])([a-z\d])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    }

    const daSherize = (str) => {
        return transToUnderLine(str).replace(/_/g, '-')
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    return {
        transToHump, // 转化为驼峰命名(连字符为界)
        transToUnderLine, // 转化为下划线命名(大写字母为界)
        daSherize, // 转化为连字符命名
        capitalize, // 首字母大写
    }
};

/**
 * 修改url中的指定query参数
 * @param {string} url 需要修改的url
 * @param {string} name 修改的key
 * @param {string} value 修改的value
 * @return  {string} 修改后的url
 */
setUrlQuery = (url, name, value) => {
    const reg = new RegExp(`${name}=`)
    if (url.match(reg)) {
        // 判断 https://rengar/?name=
        return url.replace(reg, `${name}=${value}`)
    } else if (url.match(/\?/g)) {
        // 判断 https://rengar/?name1=value1&name2=value2
        return `${url}&${name}=${value}`
    } else {
        // 无query情况
        return `${url}?${name}=${value}`
    }
};