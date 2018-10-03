<template>
	<div class="image-wrapper" :class="{'loading': region_blocked && is_loading}">
		<img :src="source" v-if="!region_blocked">
		<img :src="base64_img" v-else>
	</div>
</template>
<script>
import { bypassWallpaper } from '../utils';
import { mapState } from 'vuex';
import { LoaderIcon } from 'vue-feather-icons'

export default {
	props: ['source'],
	components: {
		LoaderIcon
	},
	mounted() {
		if (this.region_blocked) {
			this.is_loading = true;
			this.getWallpaper();
		}
	},
	computed: {
		...mapState({
			region_blocked: state => state.blocked_region,
		}),
	},
	data: () => ({
		is_loading: false,
		base64_img: null,
	}),
	methods: {
		getWallpaper() {
			console.log('Getting wallpaper');
			bypassWallpaper(this.source).then(response => {
				this.is_loading = false;
				this.base64_img = response;
			});
		}
	}
}
</script>
<style lang="scss">
.image-loader {
	position: absolute;
	z-index: 1;
	height: 100%;
	width: 100%;
	background: rgba(black, .8);
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden; //border: 1px dashed white;
	svg {
		stroke: white;
		animation: spin 1s linear infinite;
	}
}

.image-wrapper.loading {
	background-color: rgba(gray, .1);
	flex: 1;
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-image: linear-gradient( 90deg,
	rgba(lightgrey, 0) 0,
	rgba(lightgrey, .8) 50%,
	rgba(lightgrey, 0) 100%);
	background-size: 50% calc(100% - 35px), 100% 35px, 100% 100%;
	background-position: -150% 0, 0 100%; //animation: loading 1.5s infinite;   
	animation: loading 1.5s linear infinite;
}

img {
	min-width: 100%;
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