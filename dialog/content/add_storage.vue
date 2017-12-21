<template>
    <div class="add-storage-dialog">
        <el-form class="main-content"
                 :model="newStorage"
                 :rules="visitRules"
                 ref="visitForm"
                 label-width="80px">
            <dlg-edit-line label="物品名称"
                           prop="name"
                           short>
                <el-input v-model="newStorage.name"
                          :maxlength="15"></el-input>
            </dlg-edit-line>
            <dlg-edit-line label="采购单价"
                           prop="buyUnitPrice"
                           short>
                <el-input v-model="newStorage.buyUnitPrice"
                          :maxlength="10"></el-input>
                <span class="unit">元</span>
            </dlg-edit-line>
            <dlg-edit-line label="发放单价"
                           prop="sellUnitPrice"
                           short>
                <el-input v-model="newStorage.sellUnitPrice"
                          :maxlength="10"></el-input>
                <span class="unit">元</span>
            </dlg-edit-line>
            <dlg-edit-line label="备注"
                           prop="remark">
                <el-input v-model="newStorage.remark"
                          type="textarea"
                          :rows="7"
                          resize="none"
                          :maxlength="200"
                          placeholder="请记录下备注内容"></el-input>
                <span class="max-length">{{newStorage.remark.length}}/200</span>
            </dlg-edit-line>
            <dlg-edit-line for-submit-btns>
                <el-button type="primary"
                           :icon="loading?'loading':''"
                           :disabled="loading"
                           @click.native="saveAddStorage">
                    保存
                </el-button>
            </dlg-edit-line>
        </el-form>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapActions, mapGetters} from 'vuex'
    import {validateForm} from 'utils/common_utils'
    import {Message, Form} from 'meetin-sass-ui'
    import contentMixin from '../dialog_content_mixin'

    Vue.component(Message.name, Message)
    Vue.component(Form.name, Form)

    export default {
        name: 'add-storage',
        mixins: [contentMixin],
        data() {
            return {
                newStorage: {
                    name: '',
                    buyUnitPrice: '',
                    sellUnitPrice: '',
                    remark: '',
                },
                type: 'new',
                loading: false,
            }
        },
        props: {
            dialogData: {
                type: Object,
                default: () => {
                },
            },
        },
        computed: {
            ...mapGetters({
                vxStorageDetail: 'storage/storageDetail', // 物品数据
            }),
            visitRules() {
                return {
                    name: [
                        {type: 'string', required: true, none: '请输入物品名称', trigger: 'change', validator: this.repeatName.bind(this)},
                        {max: 15, message: '最长15个字符', trigger: 'blur'}
                    ],
                    buyUnitPrice: [
                        {type: 'number', required: true, trigger: 'change', none: '请输入采购单价', validator: this.priceValidator.bind(this)},
                        {max: 10, message: '最长10个字符', trigger: 'blur'}
                    ],
                    sellUnitPrice: [
                        {type: 'number', required: true, none: '请输入发放单价', trigger: 'change', validator: this.priceValidator.bind(this)},
                        {max: 10, message: '最长10个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '请输入备注内容', trigger: 'change'},
                        {max: 200, message: '最长200个字符', trigger: 'blur'}
                    ],
                }
            },
        },
        methods: {
            ...mapActions({
                vxAddStorage: 'storage/createStorage',
                vxEditStorage: 'storage/editStorage',
            }),
            priceValidator(rule, value, callback) {
                if (!value) {
                    callback(new Error(rule.none));
                }
                // 单价必须为数字
                if (!/^(([1-9]\d*)|0)(\.\d*)?$/.test(value)) {
                    if (value <= 0) {
                        callback(new Error('请输入大于0的数字'));
                    }
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            },
            repeatName(rule, value, callback) {
                if (!value) {
                    callback(new Error(rule.none));
                }
                // 名称不能重复
                if (this.vxStorageDetail.find(storage => storage.name === value)) {
                    if (this.dialogData.type === 'edit' && value === this.dialogData.storage.name) {
                        callback();
                    }
                    callback(new Error('已存在该物品名'));
                } else {
                    callback();
                }
            },
            async saveAddStorage() {
                try {
                    await validateForm(this.$refs.visitForm)
                    this.loading = true
                    let storage = {}
                    if (this.dialogData.type === 'edit') { // 编辑物品
                        storage = {
                            storageId: this.dialogData.storageId,
                            changedInfo: {
                                ...this.newStorage,
                                buyUnitPrice: this.newStorage.buyUnitPrice * 100,
                                sellUnitPrice: this.newStorage.sellUnitPrice * 100,
                            },
                        }
                        this.vxEditStorage(storage)
                    } else { // 新增物品
                        storage = {
                            ...this.newStorage,
                            category: Number(this.dialogData.category),
                            buyUnitPrice: this.newStorage.buyUnitPrice * 100,
                            sellUnitPrice: this.newStorage.sellUnitPrice * 100,
                        }
                        this.vxAddStorage(storage)
                    }
                    Message.success('保存成功')
                    this.closeDialog({
                        isGone: this.showGone,
                        done: true,
                    })
                } catch (e) {
                    // 保存成功时不用取消loading状态，否则在做dialog消失动画的时候还是可以点到提交按钮
                    this.loading = false
                }
            },
        },
        mounted() {
            this.setDialogTitle('新增物品')
            if (this.dialogData.type === 'edit') {
                this.newStorage = {
                    name: this.dialogData.storage.name,
                    buyUnitPrice: this.dialogData.storage.buyUnitPrice.replace(/¥|,/gi, ''),
                    sellUnitPrice: this.dialogData.storage.sellUnitPrice.replace(/¥|,/gi, ''),
                    remark: this.dialogData.storage.remark,
                }
                this.setDialogTitle('编辑物品')
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../../../../components/pc/styles/basic_const";

    .add-storage-dialog {
        display: flex;
        width: 540px;

        .el-select,
        .el-input,
        .el-textarea {
            max-width: 100% !important;
        }
        .main-content {
            padding: 80px 30px 30px;
        }
        .el-form {
            width: 100%;
            padding-left: 24px;
        }
        .max-length {
            font-size: 12px;
            display: block;
            text-align: right;
            padding-right: 31px;
            position: absolute;
            width: 100%;
            padding-top: 0;
            line-height: 21px;
            color: $text-hint;
        }
    }
</style>
