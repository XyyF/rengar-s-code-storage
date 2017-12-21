/**
 * 对话框id
 */
export const DialogType = {
    NONE: '0',
    LOADING: '1',

    // 教材
    ADD_STORAGE: '101',
}

/**
 * 弹框样式
 */
export const DialogStyle = {
    TITLE_AT_LEFT: 'left-title-dialog',
    TITLE_AT_MIDDLE: 'middle-title-dialog',
    FLOAT_TITLE: 'float-title-dialog',
}

/**
 * 弹框配置
 * {number} type DialogType
 * {Function} loader 按需加载弹框内容的方法，同一模块下的弹框最好使用相同的trunk，一起加载
 * {string} dialogClass 弹框样式，默认为DialogStyle.TITLE_AT_LEFT
 * {boolean} closeOnClickOutside 是否在点击窗口以外区域或按下ESC时关闭窗口，默认不关闭
 */
export const componentConfigs = [{
    type: DialogType.ADD_STORAGE,
    loader: () => import(/* webpackChunkName: "workbench_dlg_add_storage" */'./content/add_storage.vue'),
    closeOnClickOutside: false,
    dialogClass: DialogStyle.FLOAT_TITLE,
}]
