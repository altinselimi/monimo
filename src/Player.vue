<template>
	<div class="player">
		<headerr />
		<!-- <iframe sandbox="allow-scripts"  :src="iframe_src" v-if="iframe_src" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"></iframe> -->
		<webview  :src="iframe_src" v-if="iframe_src" disablewebsecurity style="width:100%;height:100%"></webview>
	</div>
</template>
<script>
export default {
	beforeMount() {
		let link = this.$route.params.src;
		this.iframe_src = atob(this.$route.params.src);
	},
	mounted(){
		setTimeout(()=>{
			let webview = document.querySelector("webview");
			webview.sendInputEvent({type:'mouseDown', x:5, y: 230, button:'left', clickCount: 1});
			webview.sendInputEvent({type:'mouseUp', x:5, y: 230, button:'left', clickCount: 1});
			console.log("working");
		},3000)
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

iframe, webview {
	padding-top: 0px!important;
	width: 100%;
	height: 100%;
	border: none;
}
</style>