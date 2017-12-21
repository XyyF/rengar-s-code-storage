<template>
    <div class="loading-dialog" v-loading="true">
    </div>
</template>

<script>
    import contentMixin from '../dialog_content_mixin'

    export default {
        name: 'loading',
        mixins: [contentMixin],
        data() {
            return {};
        },
        mounted() {
            this.setDialogTitle('')
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .loading-dialog {
        height: 200px;
        margin-bottom: 65px;
    }
</style>
