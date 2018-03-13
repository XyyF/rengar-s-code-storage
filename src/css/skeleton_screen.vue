<template>
    <div class="timeline-item">
        <div class="animated-background">
            <div class="background-masker header-top"></div>
            <div class="background-masker header-left"></div>
            <div class="background-masker header-bottom"></div>
            <div class="background-masker subheader-left"></div>
            <div class="background-masker subheader-right"></div>
            <div class="background-masker subheader-bottom"></div>
        </div>
        <div class="tip">tip: 宽度和高度只需要修改$width和$height即可</div>
    </div>
</template>

<script>
    export default {
        name: 'skeleton-screen',
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    $height: 40px;
    $width: 300px;

    .tip {
        font-size: 14px;
    }

    .timeline-item {
        background: #fff;
        padding: 12px;
        margin: 0 auto;
        width: $width;
        min-height: 200px;

        @keyframes placeHolderShimmer {
            0% {
                background-position: -468px 0
            }
            100% {
                background-position: 468px 0
            }
        }

        .animated-background {
            animation-duration: 1s;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;
            animation-name: placeHolderShimmer;
            animation-timing-function: linear;
            background: #f6f7f8;
            background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
            background-size: 800px 104px;
            height: $height;
            position: relative;
        }

        .background-masker {
            background: #fff;
            position: absolute;
        }

        /* Every thing below this is just positioning */

        .background-masker.header-top,
        .background-masker.header-bottom,
        .background-masker.subheader-bottom {
            top: 0;
            left: $height;
            right: 0;
            height: $height/4;
        }

        .background-masker.header-left,
        .background-masker.subheader-left,
        .background-masker.header-right,
        .background-masker.subheader-right {
            top: $height/4;
            left: $height;
            height: $height/5;
            width: $width/30;
        }

        .background-masker.header-bottom {
            top: $height*9/20;
            height: $height*3/20;
        }

        .background-masker.subheader-left,
        .background-masker.subheader-right {
            top: $height*3/5;
            height: $height*3/20;
        }

        .background-masker.header-right,
        .background-masker.subheader-right {
            width: auto;
            left: $width;
            right: 0;
        }

        .background-masker.subheader-right {
            left: $width*23/30;
        }

        .background-masker.subheader-bottom {
            top: $height*3/4;
            height: $height/4;
        }
    }
</style>
