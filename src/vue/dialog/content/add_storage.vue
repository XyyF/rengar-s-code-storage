<template>
    <div class="add-storage-dialog">
    </div>
</template>

<script>
    import contentMixin from '../dialog_content_mixin'

    export default {
        name: 'add-storage',
        mixins: [contentMixin],
        data() {
            return {
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
        mounted() {
            this.setDialogTitle('新增物品')
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .add-storage-dialog {
    }
</style>
