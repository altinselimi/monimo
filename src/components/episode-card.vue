<template>
	<a class="episode-card" @click="$emit('watchit', episode)" tabindex="0" :class="{'currently-watching': current, 'sticker-overlay': current}">
		<div class="holder">
			<img :src="wallpaper" v-if="wallpaper">
		</div>
		<h4>Episode {{episode.info.episode}}</h4>
	</a>
</template>
<script>
export default {
	props: ['episode', 'current'],
	computed: {
		wallpaper() {
			if (!this.episode.thumbnail) return null;
			return `https://cdn.masterani.me/episodes/${this.episode.thumbnail}`;
		},
	},
}
</script>
<style lang="scss">
.episode-card {
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
	&.currently-watching::before {
		content: 'Last Watched';
		background-color: #2196F3;
	}
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
	background-color: whitesmoke;
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
</style>