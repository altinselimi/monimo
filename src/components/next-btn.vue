<template>
	<div class="next-progress-button">
		<div class="progress-btn-wrapper">
			<svg class="progress" width="120" height="120" viewBox="0 0 120 120">
				<circle class="progress__meter" cx="60" cy="60" :r="radius" :stroke-width="strokeWidth" />
				<circle :style="circle_stringified_style" class="progress__value" cx="60" cy="60" :r="radius" :stroke-width="strokeWidth" />
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
		radius: {
			type: Number,
			default: 34,
		},
		strokeWidth: {
			type: Number,
			default: 10,
		},
	},
	computed: {
		circumference() {
			return 2 * Math.PI * this.radius;
		},
		dashoffset() {
			return this.circumference * (1 - this.progressValue / 100);
		},
		circle_stringified_style() {
			let styles = {
				'stroke-dasharray': this.circumference,
				'stroke-dashoffset': this.dashoffset,
			}
			return Object.keys(styles).map(key => `${key}: ${styles[key]}`).join(';');
		},
	},
};
</script>
<style lang="scss">
$blue: #03a9f4;

.next-progress-button {
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
	.progress {
		transform: rotate(-90deg);
		>circle:first-child {
			fill: rgba(black, .4);
		}
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