<template>
	<div class="player">
		<headerr />
		<iframe sandbox="allow-scripts"  :src="iframe_src" v-if="iframe_src" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"></iframe>
	</div>
</template>
<script>
export default {
	beforeMount() {
		let link = this.$route.params.src;
		this.iframe_src = atob(this.$route.params.src);
	},
	components: {
		headerr: () =>
			import ('./components/header.vue'),
	},
	data: () => ({
		iframe_src: null,
	}),
}
</script>
<style lang="scss">
.player {
	width: 100%;
	height: 100%;
}

iframe {
	padding-top: 0px!important;
	width: 100%;
	height: 100%;
	border: none;
}
</style>