<template>
    <el-form-item
        :label="label"
        :prop="prop"
        :label-width="labelWidth"
        :required="required"
        :rules="rules"
        :error="error"
        :show-message="showMessage"
        class="dlg-edit-line"
        :class="{
            'dlg-edit-line--short':short,
            'dlg-edit-line--long':long,
            'dlg-edit-line--btns':forSubmitBtns,
            'dlg-edit-line--only-text':onlyText,
        }">
        <slot></slot>
        <p class="dlg-edit-line__tips" v-if="showTips">
            <slot name="tips"></slot>
        </p>
    </el-form-item>
</template>

<script>
    /**
     * 编辑类表单中的一行。实际是FormItem组件的封装
     * 内部包裹的元素中，支持以下style样式
     * short    宽度较短，大约占半行
     * price    红色的价格文字
     * unit     跟在输入框等元素后面的浅色文字，表示单位
     */
    import {FormItem} from 'element'

    export default {
        name: 'dlg-edit-line',
        props: {
            // 是否让内容中的输入框显示为较短的样式
            short: {type: Boolean, default: false},
            long: {type: Boolean, default: false},
            // 是否只有提交按钮等内容
            forSubmitBtns: {type: Boolean, default: false},
            // 是否只有文字内容
            onlyText: {type: Boolean, default: false},

            // FormItem的属性
            label: {type: String},
            prop: {type: String},
            labelWidth: {type: String},
            required: {type: Boolean},
            rules: {type: Object},
            error: {type: String},
            showMessage: {type: Boolean, default: undefined},
        },
        computed: {
            showTips() {
                return !!this.$slots.tips
            },
        },
        components: {
            [FormItem.name]: FormItem,
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../components/pc/styles/basic_const";

    .dlg-edit-line {
        $tip-size: 12px;
        $normal-width: 360px;
        $short-width: 172px;
        margin-top: 20px;
        margin-bottom: 0px;
        &:first-child {
            margin-top: 0px;
        }
        .el-input, .el-date-editor.el-input, .el-input-number, .el-textarea {
            width: $normal-width;
        }
        &--short {
            .el-input, .el-date-editor.el-input, .el-input-number, .el-textarea {
                width: $short-width;
            }
        }
        &--long {
            .el-input, .el-select, .el-date-editor.el-input, .el-input-number, .el-textarea {
                width: 100%;
            }
        }
        // 子元素上也可以加short样式
        .short {
            width: $short-width;
            &.el-input, &.el-date-editor.el-input, &.el-input-number, &.el-textarea {
                width: $short-width;
            }
        }
        .long {
            width: 100%;
            &.el-input, &.el-select, &.el-date-editor.el-input, &.el-input-number, &.el-textarea {
                width: 100%;
            }
        }
        &--only-text .el-form-item__content {
            line-height: 36px;
        }
        &--btns {
            margin: 30px 0 0;
        }
        &__tips {
            width: $normal-width;
            font-size: 14px;
            color: $text-hint;
            padding-top: 10px;
        }
        .unit {
            margin-left: 6px;
            font-size: $tip-size;
            color: $text-normal;
        }
        .price {
            color: #ff6d24;
        }
        // 报名优惠输入框那种样式
        br + .el-input {
            margin-top: 2px;
        }
    }
</style>
