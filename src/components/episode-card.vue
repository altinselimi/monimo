<template>
	<a class="episode-card" @click="$emit('watchit', episode)" tabindex="0" :class="{'currently-watching': current, 'sticker-overlay': current}">
		<div class="loader" v-if="showLoader">
			<LoaderIcon/>
		</div>
		<div class="holder">
			<image-bypasser :source="episode.thumbnail ? `https://cdn.masterani.me/episodes/${episode.thumbnail}` : poster"></image-bypasser>
		</div>
		<h4>Episode {{episode.info.episode}}</h4>
	</a>
</template>
<script>
import { LoaderIcon } from 'vue-feather-icons';
import ImageBypasser from './image';
export default {
	props: ['episode', 'current', 'showLoader', 'poster'],
	components: {
		LoaderIcon,
		ImageBypasser,
	},
}
</script>
<style lang="scss">
.episode-card {
	position: relative;
	display: flex;
	flex-direction: column;
	width: auto;
	position: relative;
	&.sticker-overlay::before {
		position: absolute;
		top: 5px;
		right: 5px;
		content: '';
		color: white;
		font-size: .8rem;
		z-index: 1;
		padding: 2px 5px;
	}
	/* 	&.finished::before {
		content: 'Finished';
		background-color: #4CAF50;
	} */
	// &.currently-watching::before {
	// 	content: 'Last Watched';
	// 	background-color: #2196F3;
	// }
	// &.finished_watching::after{
	// 	position:absolute;
	// 	bottom: 0px;
	// 	right: 5px;
	// 	font-size: .8rem;
	// 	z-index:1;
	// 	padding:2px 5px;
	// 	content: 'Finished';
	// 	background-color: red;
	// }
	h4 {
		margin: 0px;
		margin-top: 5px;
	}
	&:focus {
		display: flex;
	}
	margin: 15px;
}

.holder {
	position: relative;
	padding: 0 0 56.25%;
	background-color: black;
	position: relative;
	&::before {
		content: 'No thumbnail';
		display: block;
		color: black;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
	}
	overflow: hidden;
	img {
		z-index: 0;
		position: absolute;
		width: 100%;
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>