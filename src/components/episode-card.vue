<template>
	<a class="episode-card" @click="$emit('watchit', episode)" tabindex="0" :class="{'currently-watching': current, 'sticker-overlay': current}">
		<div class="loader" v-if="showLoader">
            <svg class="feather feather-loader sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="706">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        </div>
		<div class="holder">
			<img :src="wallpaper" v-if="wallpaper">
		</div>
		<h4>Episode {{episode.info.episode}}</h4>
	</a>
</template>
<script>
export default {
	props: ['episode', 'current', 'showLoader'],
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
 .loader {
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
        overflow: hidden;
        svg {
        	stroke:white;
            animation: spin 1s linear infinite;
        }
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
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>