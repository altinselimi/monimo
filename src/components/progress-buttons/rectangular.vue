<template>
	<div class="progress-button">
		<div class="progress-btn-wrapper">
			<svg class="progress" :width="width" :height="width">
				<rect class="progress_meter" width="100" height="20" fill="transparent" stroke-width="1" stroke-dasharray="240" stroke-dashoffset="240" />
				<rect class="progress__value" width="100" height="20" fill="transparent" stroke-width="1" stroke-dasharray="240" stroke-dashoffset="240" />
			</svg>
			<div class="progress-btn-content">
				<slot></slot>
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
			default: 10,
		},
		width: {
			type: Number,
			default: 50,
		},
		height: {
			type: Number,
			default: 150,
		},
	},
	computed: {
		dashoffset() {
			return this.circumference * (1 - this.progressValue / 100);
		},
		stringifiedStyle() {
			let styles = {
				'stroke-dasharray': (this.width + this.height) * 2,
				'stroke-dashoffset': (this.width + this.height) * 2,
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

	.progress__meter,
	.progress__value {
		fill: none;
	}

	.progress__meter {
		stroke: rgba(white, .2);
	}

	.progress__value {
		stroke: $blue;
		stroke-linecap: round;
		transition: 1s linear;
	}
}
</style>