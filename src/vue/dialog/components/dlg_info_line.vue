<template>
    <div class="dlg-info-line float-container"
         :class="{'dlg-info-line--btns':forSubmitBtns}">
        <label class="dlg-info-line__label">{{label}}</label>
        <div class="dlg-info-line__content float-container">
            <slot></slot>
            <div class="dlg-info-line__right" v-if="showRightContainer">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 信息展示类表单中的一行。左右结构，左边为label，右边为内容
     */
    export default {
        name: 'dlg-info-line',
        props: {
            label: {
                type: String,
                default: '',
            },
            // 是否只有提交按钮等内容
            forSubmitBtns: {type: Boolean, default: false},
        },
        computed: {
            showRightContainer() {
                return !!this.$slots.right
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../components/pc/styles/basic_const";

    .dlg-info-line {
        // 4个字的宽度
        $label-width: 78px;
        margin-bottom: 14px;
        &--btns {
            margin: 30px 4px 0 0;
            &:after, &:before {
                display: table;
                content: "";
            }
            &:after {
                clear: both;
            }
            button {
                margin-right: 12px;
                &.float-right {
                    margin-right: 0;
                    margin-left: 12px;
                }
            }
        }
        &__label {
            color: $text-normal;
            padding-right: 20px;
            width: $label-width;
            display: inline-block;
            text-align: right;
            float: left;
        }
        &__content {
            margin-left: $label-width;
            position: relative;
            font-size: 14px;
        }
        &__right {
            position: absolute;
            right: 4px;
            top: 0;
            .el-button--small {
                margin-top: -4px;
                padding: 0 14px;
            }
        }
        .el-button.el-button--small.el-button--text {
            padding: 0 10px;
            height: auto;
        }
    }
</style>
