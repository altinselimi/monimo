<template>
	<div class="carousel-wrapper">
		<h3 v-if="title">{{title}}</h3>
		<ul class="movie-carousel">
			<li v-for="movie in movies" v-if="movies">
				<a tabindex="0">
					<movie-card :movie="movie" @click.native="$emit('navigate', movie)" :showLoader="movie.id === showLoader" :loading="loading">
					</movie-card>
				</a>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: ['movies', 'loading', 'title', 'showLoader'],
	components: {
		movieCard: () =>
			import ('./movie-card.vue'),
	},
};
</script>
<style lang="scss">
.carousel-wrapper {
	display: flex;
	flex-direction: column;
	padding: 20px 0px;
	h3 {
		font-size: 1.2rem;
		margin: 0px;
		color: white;
		margin-left: 20px;
		align-self:flex-start;
		padding: 5px;
		text-transform: uppercase;
		text-shadow: 1px 2px black;
	}
}
ul.movie-carousel {
	padding: 0px;
	margin: 0px;
	list-style: none;
	display: flex;
	align-items: center;
	>li {
		width: auto;
	}
	flex-wrap: nowrap;
}
</style>