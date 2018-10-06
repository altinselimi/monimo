<template>
    <div class="progress-button" :style="`height: ${height}px; width: ${width}px`">
        <div class="progress-btn-wrapper">
            <svg class="progress" :width="width" :height="height">
                <rect class="progress__meter" :width="width" :height="height" fill="transparent" :stroke-width="strokeWidth" />
                <rect class="progress__value" :style="stringifiedStyle" :width="width" :height="height" fill="transparent" :stroke-width="strokeWidth" />
            </svg>
            <div class="progress-btn-content">
                <slot>NEXT</slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        progressValue: {
            default: 0,
            required: false,
            type: Number,
        },
        strokeWidth: {
            type: Number,
            default: 3,
        },
        width: {
            type: Number,
            default: 160,
        },
        height: {
            type: Number,
            default: 50,
        },
    },
    computed: {
        length() {
            return (this.width + this.height) * 2;
        },
        remainingValue(baseValue, valueToBeDeducted) {
            let maxValue = parseInt(this.length);
            let value = parseInt(this.progressValue);
            let relativeValue = (value / 100) * maxValue;
            return maxValue - relativeValue;
        },
        stringifiedStyle() {
            let styles = {
                'stroke-dasharray': this.length,
                'stroke-dashoffset': this.remainingValue,
            }
            return Object.keys(styles).map(key => `${key}: ${styles[key]}`).join(';');
        },
    },
};
</script>
<style lang="scss">
$blue: #03a9f4;

.progress-button {
    .progress-btn-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .progress-btn-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        position: relative;
        z-index: 1;
    }

    .progress__meter,
    .progress__value {
        fill: none;
    }

    .progress__meter {
        stroke: transparent;//rgba(white, .2);
    }

    .progress__value {
        stroke: red;
        //stroke-linecap: round;
        transition: 1s linear;
    }
}
</style>