<template>
	<div class="movie-card">
		<div class="loading" v-show="loading"></div>
		<div class="contents" v-if="!loading">
			<div class="background">
				<img :src="movie.poster">
				<div class="overlay">
					<div class="score">
						<svg class="feather feather-star sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1101">
							<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
						</svg>
						<span>{{movie.score}}</span>
					</div>
				</div>
			</div>
			<h4>{{movie.title.slice(0,22)}}</h4>
		</div>
	</div>
</template>
<script>
export default {
	props: ['movie', 'loading'],
}
</script>
<style lang="scss">
$yellow: #fbbd08;
.movie-card {
	width: 240px;
	height: 385.6px;
	display: flex;
	background-color: white;
	border-radius: 25px;
	overflow: hidden;
	margin: 15px;
	.loading {
		flex: 1;
		background-repeat: no-repeat;
		background-image: linear-gradient( 90deg,
		rgba(lightgrey, 0) 0,
		rgba(lightgrey, .8) 50%,
		rgba(lightgrey, 0) 100%), //loading animation
		linear-gradient(#fdfdfd 40px, transparent 0),
		linear-gradient(#e4e4e4 100%, transparent 0);
		background-size: 100% calc(100% - 35px), 100% 35px, 100% 100%;
		background-position: -150% 0, 0px 100%;
		animation: loading 1.5s infinite;
	}
	.contents {
		display: flex;
		flex-direction: column;
	}
	.background {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		img {
			height: auto;
			width: 100%;
		}
	}
	.score {
		position: absolute;
		bottom:8px;
		left: 8px;
		padding: 2px 8px;
		border-radius: 15px;
		display: flex;
		align-items: center;
		font-size: .75rem;
		background-color: rgba(black, .8);
		color: white;
		svg {
			fill: $yellow;
			stroke: transparent;
			width: 14px;
			height: 14px;
			margin-right: 3px;
		}
	}
	h4 {
		margin: 0px;
		padding: 10px 13px;
		text-transform: uppercase;
		font-weight: 600;
		font-size: .8rem;
		overflow-x: hidden;
		height: 50px;
		display: inline-flex;
		align-items: center;
		position: relative;
		background-color: white;
	}
}

@keyframes loading {
	to {
		background-position: 350% 0,
		0px 100%;
	}
}
</style>