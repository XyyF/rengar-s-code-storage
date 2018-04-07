// 订阅发布模式
class EventEmitter {
    constructor() {
        // 监听列表
        this._events = this._events || new Map()
        // 最大监听数量
        this._maxEvents = this._maxEvents || 10
    }
}

// 监听
EventEmitter.prototype.$on = function(type, fn) {
    const handle = this._events.get(type)
    if (handle) {
        handle.push(fn)
    } else {
        this._events.set(type, [fn])
    }
}

// 发布
EventEmitter.prototype.$emit = function(type, ...args) {
    const handle = this._events.get(type)
    for (let i = 0; i < handle.length; i++) {
        handle[i].apply(null, args)
    }
}

// 取消监听
EventEmitter.prototype.$off = function(type, fn) {
    const handle = this._events.get(type)
    for (let i = 0; i < handle.length; i++) {
        handle[i].apply(null, args)
    }
}


// test
const emitter = new EventEmitter()

emitter.$on('rengar', man => {
    console.log(`expel ${man}`);
});
emitter.$on('rengar', man => {
    console.log(`save ${man}`);
});

emitter.$on('rengar', man => {
    console.log(`kill ${man}`);
});

// 触发事件
emitter.$emit('rengar', 'low-end');