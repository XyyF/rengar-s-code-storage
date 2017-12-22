<template>
    <el-dialog
            class="normal-dialog"
            :class="dialogClass"
            :visible.sync="visible"
            :close-on-click-modal="closeOnClickOutside"
            :close-on-press-escape="closeOnClickOutside"
            :title="dialogTitle"
            @close="onClosed"
            ref="dialog">
        <component :is="contentComponentName"
                   :dialog-data="dialogData"
                   v-if="mountContent"
                   @set-title="setTitle"
                   @set-close-bundle="setCloseBundle"
                   @complete="close"
                   ref="dialogContent"
        ></component>
    </el-dialog>
</template>

<script>
    /**
     * 配置：
     * 需要在app中引入dialog组件，并且添加ref="dialog"
     * 在mounted中：Vue.prototype.$dialog = this.$refs.dialog
     *
     * @example 示例
     * const dlg = this.$dialog.showDialog(DialogType.XXX, {studentId: 'aaabbc', studentName: '李小花'})
     * dlg.onOpen((dialogType) => {
     *     // do something ...
     * })
     * dlg.onClose((dialogType, {newName, otherData}) => {
     *     if (newName) {
     *         // do something ...
     *     }
     * })
     * 在content里添加弹窗的内容
     * 在dialog_const.js中添加弹窗的ID和基本信息
     */
    import {Dialog} from 'meetin-sass-ui'
    import {DialogType, DialogStyle, componentConfigs} from './dialog_configs'
    import loadingDialog from './content/loading.vue'

    // 如果加载弹框内容超过了这个时间还没加载好，就显示loading
    const LOADING_DIALOG_PENDDING_TIME = 300
    const STATE_CLOSED = 1
    // 正在加载内容组件，此时时限还没到，不展示任何弹框
    const STATE_LOAD_PENNDING = 2
    // 正在加载内容组件，此时展示loading状态
    const STATE_LOADING = 3
    const STATE_SHOWN = 4
    const STATE_CLOSING = 5

    // 在加载弹框js文件时显示的loading状态，需要提前加载好
    componentConfigs.push({
        type: DialogType.LOADING,
        loader: () => Promise.resolve(loadingDialog),
        closeOnClickOutside: true,
        dialogClass: DialogStyle.TITLE_AT_MIDDLE,
    })

    export default {
        name: 'normal-dialog',
        data() {
            return {
                // content目录下组件名
                contentComponentName: '',
                // this.$showDialog传入的数据
                dialogData: {},
                // dialog标题
                dialogTitle: '',
                dialogClass: DialogStyle.TITLE_AT_LEFT,
                currentDialogType: DialogType.NONE,
                closeOnClickOutside: false,
                // 是否正在加载内容组件js文件
                dialogState: STATE_CLOSED,
                // 弹窗从隐藏到展示成功的事件，不包括已经展示出来了，又showDialog切换到另一个框的情况
                // 参数为展示的弹框type
                openListeners: [],
                // 弹窗关闭动画开始的事件
                // 参数为关闭时的弹框type，和closeBundle对象
                closeListeners: [],
                // showDialog时返回出去用于注册回调方法的对象
                showDialogResult: {
                    onOpen: callback => this.openListeners.push(callback),
                    onClose: callback => this.closeListeners.push(callback),
                },
                // 关闭弹框时传入回调函数的数据
                closeBundle: {},
                // 是否显示弹窗，双向绑定到el-dialog上的变量
                visible: false,
            }
        },
        computed: {
            // 确认已挂载content下的组件
            mountContent() {
                // 异步pendding状态结束后才挂载组件，这样可以确保pendding状态中（contentComponentName是上次的值，loader还未回调），内容组件不会过早地触发了mounted事件
                return this.dialogState !== STATE_CLOSED && this.dialogState !== STATE_LOAD_PENNDING
            },
        },
        components: {
            [Dialog.name]: Dialog,
            [loadingDialog.name]: loadingDialog,
        },
        methods: {
            // 关闭弹窗
            close() {
                this.visible = false
            },
            /**
             * 显示指定弹框
             * @param {string} dialogType 定义在dialog_configs中的DialogType
             * @param {object?} dialogData 要传递给窗口内容组件的数据
             */
            showDialog(dialogType, dialogData = {}) {
                const config = componentConfigs.find(item => item.type === dialogType)
                if (!config) {
                    console.error(`找不到弹窗类型${dialogType}对应的组件`)
                    return this.showDialogResult
                }
                if (dialogType !== DialogType.LOADING) {
                    this.showLoadingAfterAWhile()
                }
                this.dialogState = STATE_LOAD_PENNDING
                config.loader().then((component) => {
                    // 在loading状态下用户关闭了弹框
                    if (this.dialogState !== STATE_LOAD_PENNDING && this.dialogState !== STATE_LOADING) {
                        return
                    }
                    this.currentDialogType = dialogType
                    this.dialogState = STATE_SHOWN
                    this.setupComponent(config, component.default, dialogData)
                    this.visible = true

                    this.callOpenListeners(dialogType)
                })

                return this.showDialogResult
            },
            // 设置弹窗标题
            setTitle(title) {
                this.dialogTitle = title
            },
            setCloseBundle(bundle) {
                if (typeof bundle !== 'object') {
                    console.error(`expected a object, but the bundle is ${bundle}`)
                }
                this.closeBundle = bundle
            },
            // 延迟一下，如果还没加载好，再显示加载动画
            showLoadingAfterAWhile() {
                // 如果当前窗口已经显示出来了，可以直接显示loading，否则pendding状态下会显示一个无内容的弹框。setTimeout期间如果要显示的对话框已经加载过，会在timeout之前就先完成loader的
                const duration = this.dialogState === STATE_SHOWN ? 0 : LOADING_DIALOG_PENDDING_TIME
                setTimeout(() => {
                    if (this.dialogState !== STATE_LOAD_PENNDING) {
                        return
                    }
                    this.dialogState = STATE_LOADING
                    const config = componentConfigs.find(item => item.type === DialogType.LOADING)
                    this.setupComponent(config, loadingDialog)
                    this.visible = true
                }, duration)
            },
            setupComponent(config, component, dialogData) {
                Vue.component(component.name, component)
                this.dialogData = dialogData
                this.closeOnClickOutside = !!config.closeOnClickOutside
                this.dialogClass = config.dialogClass || DialogStyle.TITLE_AT_LEFT
                this.contentComponentName = component.name
            },
            // 关闭弹窗并且销毁组件内容
            async onClosed() {
                this.dialogState = STATE_CLOSING
                // 等待关闭动画结束。进入STATE_CLOSED状态，并销毁内容组件，下次再弹同一个框时才会调用内容组件的mounted
                await Promise.all([
                    timeoutPromise(320),
                    () => {
                        if (this.dialogState === STATE_CLOSING) {
                            this.dialogState = STATE_CLOSED

                            const currentDialogType = this.currentDialogType
                            this.currentDialogType = DialogType.NONE;
                            this.callCloseListeners(currentDialogType)
                        }
                    }
                ])
            },
            callOpenListeners(dialogType) {
                if (dialogType !== DialogType.LOADING) {
                    const listeners = this.openListeners.slice()
                    this.openListeners = []
                    listeners.forEach(fn => fn(dialogType))
                }
            },
            callCloseListeners(dialogType) {
                const listeners = this.closeListeners.slice()
                this.closeListeners = []

                const closeBundle = this.closeBundle
                this.closeBundle = {};

                listeners.forEach(fn => fn(dialogType, closeBundle))
            },
        },
    }

    function timeoutPromise(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration)
        })
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "./styles/basic_const";

    .normal-dialog {
        $input-space: 12px;

        .el-dialog {
            margin-bottom: 20px !important;
            top: 5% !important;
            overflow: hidden;
            height: auto;
            &.el-dialog--small {
                width: 540px;
            }
        }
        @media (min-height: 800px) {
            display: flex;
            align-items: center;
            justify-content: center;
            .el-dialog {
                margin-bottom: 0 !important;
                position: relative;
                transform: none;
                top: 0 !important;
                left: 0;
            }
        }
        .el-dialog__body > div {
            transition: height 0.5s;
        }
        .el-dialog__title {
            color: $text-strong;
            word-break: break-all;
        }
        .el-dialog__headerbtn {
            background-color: inherit;
            margin-right: 20px;
        }

        .el-form-item > label, .el-radio__label {
            color: $text-normal;
        }
        .el-radio-group {
            .el-radio-button + .el-radio-button {
                margin-left: $input-space;
            }
            .el-radio-button__inner {
                min-width: 80px;
                line-height: 24px;
                border-radius: 4px !important;
                color: $text-normal;
                border: 1px solid $line-border;
                text-align: center;
                &:hover {
                    border-color: $basic-primary;
                }
            }
            .is-active .el-radio-button__inner {
                background-color: transparent !important;
                border-color: $basic-primary !important;;
                color: $basic-primary !important;
                box-shadow: none;
            }

            .el-radio + .el-radio {
                margin-left: 32px;
            }
            .el-radio__input {
                margin-top: -1px;
            }
            .el-radio__inner, .el-radio__label {
                line-height: 36px;
            }
            .el-radio__label {
                padding-left: 5px;
            }
        }
        .el-button {
            height: 36px;
            padding-left: 30px;
            padding-right: 30px;
            &.el-button--small {
                height: 28px;
                padding-left: 14px;
                padding-right: 14px;
            }
        }
        .el-input + .el-select {
            margin-left: $input-space;
        }
        .el-input__inner {
            color: $text-strong;
        }
        // 解决数字输入框底部多出一个margin的问题
        .el-input-number {
            overflow: visible;
        }

        // 标题居中，无标题底部分隔线的样式。参照导入导出样式
        &.middle-title-dialog {
            .el-dialog__header {
                height: 65px;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: flex-end;
            }
            .el-dialog__headerbtn {
                position: absolute;
                top: 20px;
                right: 0;
            }
            .el-dialog__body {
                padding: 0;
            }
            .bottom-buttons {
                margin-top: 30px;
                margin-bottom: 40px;
                text-align: center;
                button {
                    width: 250px;
                    height: 40px;
                    padding: 11px 45px;
                    font-size: 16px;
                    border-radius: 4px;
                }
            }
        }

        // 标题居左，有标题底部分隔线的样式。参照新增学员样式
        &.left-title-dialog {
            $dlg-padding-top: 20px;
            $dlg-padding-left: 24px;

            .el-dialog__header {
                $title-size: 16px;
                height: $dlg-padding-top * 2 + $title-size;
                font-size: $title-size;
                padding: 0;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-dialog__title {
                    margin-left: $dlg-padding-left;
                }
            }
            .el-dialog__body {
                padding: 0 20px 30px $dlg-padding-left;
            }
        }

        // title浮动，body部分可覆盖到整个对话框面板的样式。参照添加跟进记录样式
        &.float-title-dialog {
            .el-dialog.el-dialog--small {
                width: auto;
            }
            .el-dialog__header {
                position: absolute;
                width: 100%;
                height: 60px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-dialog__title {
                    margin-left: 24px;
                }
            }
            .el-dialog__body {
                padding: 0;
            }
        }
    }
</style>
