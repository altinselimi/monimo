<template>
	<div class="player-controls">
		<button class="btn-plain play" :stroke-width="5" @click.native="$emit('play')">
			<PlayIcon />
		</button>
		<button class="btn-plain backwards" :stroke-width="5" @click.native="$emit('backwards')">
			<fast-forward-icon style="transform: rotate(180deg)" />
		</button>
		<div class="video-progress"></div>
		<button>
			<svg class="progress-rectangle">
			</svg>
		</button>
	</div>
</template>
<script>
import {
	FastForwardIcon,
	PlayIcon
} from 'vue-feather-icons';
import CircularProgressButton from './progress-buttons/circular.vue';

export default {
	props: ['videoLength', 'videoPosition', 'videoStatus'],
	components: {
		PlayIcon,
		FastForwardIcon,
		CircularProgressButton,
	},
}
</script>
<style lang="scss">
.player-controls {
	position: fixed;
	bottom: 40px;
	left: 0px;
	width: 100%;
	display: flex;
	justify-content: center;
	opacity: 0;
	.play {
		transform: scale(1.4);
		svg {
			fill: red;
			stroke: transparent;
		}
	}
	.backwards svg {
		transform: rotate(90deg);
		fill: white;
		stroke: transparent;
	}
	.btn-plain {
		background: transparent;
		border: none;
	}
}
</style>