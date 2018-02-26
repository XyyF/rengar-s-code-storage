import {on, off} from '../../jsFunction/attach_event'
/**
 * vue单页应用中，directives引入，v-clickoutside自定义指令调用
 * <div v-clickoutside="handleClose">
 * created by rengar 2017/12/3
 */
const nodeList = [];
const ctx = '@clickoutside';

let startClick;
let seed = 0;

const down = (e) => {
    startClick = e
}
const up = (e) => {
    nodeList.forEach(node => node[ctx].handleClickOutSide(startClick, e))
}

/**
 * 这里有个问题,不同的场景使用不同的修改
 * 问题是：unbind后，是否需要解绑document的事件,避免不必要的开销,取决与你的场景
 * 如果需要解绑,那么将on绑定放入bind中好些
 */
on(document, 'mousedown', down)
on(document, 'mouseup', up)

export default {
    /**
     * 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
     * @param el 指令绑定的元素
     * @param binding 一个对象，用来存储传入指令的值,expression传入值的字符串形式，value传入的值
     * @param vnode 一个类，存储节点信息，其中context存储VueComponent的信息
     */
    bind(el, binding, vnode) {
        nodeList.push(el)
        const id = seed++
        const handleClickOutSide = (mousedown = {}, mouseup = {}) => {
            if (!vnode.context
                || !mouseup.target
            || !mousedown.target
            || el.contains(mouseup.target)
            || el.contains(mousedown.target)
            || el === mouseup.target
            || el === mousedown.target) {
                return
            }
            if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
                vnode.context[el[ctx].methodName]()
            } else {
                el[ctx].method()
            }
        }
        el[ctx] = {
            id,
            handleClickOutSide,
            method: binding.value,
            methodName: binding.expression,
        }
    },
    update(el, binding) {
        el[ctx].method = binding.value
        el[ctx].methodName = binding.expression
    },
    unbind(el) {
        const len = nodeList.length
        for (let i = 0; i< len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1)
                break;
            }
        }
        // 解绑，避免不必要的开销
        // off(document, 'mousedown', down)
        // off(document, 'mouseup', up)
    },
};
