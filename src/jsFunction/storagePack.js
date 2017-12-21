/**
 * 调用 import storage from './storagePack'
 * storage.localStorage.IMGDATA = [...]  // setter
 * storage.localStorage.IMGDATA // getter
 */
export default {
    localStorage: initStorage(localStorage, {
        // 键名代表属性名，键值代表是否在getter后删除
        // 每次需要向Storage存入新的属性时，这里需要同步更新
        IMGDATA: false,
    }),
    sessionStorage: initStorage(sessionStorage, {
        IMGDATA: true,
    }),
}

/**
 * 初始化包装
 * @param storage object,类型，localStorage/sessionStorage
 * @param params object,参数，保存入Storage的所有参数
 * @returns {{}}
 */
function initStorage(storage, params) {
    let result = {}
    for (let param in params) {
        if (params.hasOwnProperty(param)) {
            definedProperty(param, params[param])
        }
    }
    return result

    function definedProperty(key, isOneShot) {
        Object.defineProperty(result, key, {
            set(val) {
                try {
                    if (val === undefined) {
                        storage.removeItem(key)
                    } else {
                        storage.setItem(key, JSON.stringify(val))
                    }
                } catch (e) {
                    // 空间不足，localStorage超出限额
                    if (e.name === 'QuotaExceededError' && storage.length) {
                        storage.clear()
                        storage.setItem(key, JSON.stringify(val))
                    } else {
                        console.log(e)
                    }
                }
            },
            get() {
                let value = storage.getItem(key)
                try {
                    value = JSON.parse(value)
                } catch(e) {
                    // 语法错误
                    if (e.name === 'SyntaxError') {
                        console.log(`can't parse ${key}: ${value}`)
                        value = undefined
                    } else {
                        console.log(e)
                    }
                }
                if (isOneShot) {
                    storage.removeItem(key)
                }
                return value
            },
        })
    }
}