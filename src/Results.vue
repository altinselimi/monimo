<template>
	<div class="results">
		<headerr></headerr>
		<movie-carousel :showLoader="getting_anime_info" :movies="getting_animes ? [1,2,3,4,5,6,7]: results" :title="result()" :filteredSeries="selected_genre_names" @navigate="openAnime" :loading="getting_animes" :isResult="true"></movie-carousel>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
	name: 'Results',
	props: ['query'],
	data: () => ({
		back_button: false,
		getting_anime_info: null,
		getting_animes: false,
		selected_genre_names: [],
		results: null,
	}),
	components: {
		headerr: () =>
			import ('./components/header'),
		movieCarousel: () =>
			import ('./components/movie-carousel')
	},
	mounted() { //order=score_desc&page=1
		this.getting_animes = true;
		this.getAnimes({
			search: this.query,
		}).then(res => {
			console.log('Res:', res);
			this.getting_animes = false;
			this.results = res;
		}).catch(err => {
			this.getting_animes = false;
			throw err;
		});
	},
	computed: {
		...mapState({
			animes_w_details: state => state.animes_w_details,
		})
	},
	methods: {
		...mapActions(['getAnimes', 'getAnimeDetails']),
		...mapMutations(['SET_CURRENT_ANIME']),
		openAnime(anime) {
			if (this.animes_w_details[anime.id]) {
				this.SET_CURRENT_ANIME(this.animes_w_details[anime.id]);
				this.$router.push(`/anime/${anime.id}`);
			} else {
				this.getting_anime_info = anime.id;
				this.getAnimeDetails(anime.id).then(res => {
					this.$router.push(`/anime/${anime.id}`);
					this.getting_anime_info = null;
				}).catch(err => {
					throw err;
				});
			}
		},
		result() {
			return `Result for: ${this.query}`;

		}
	}
}
</script>
<style lang="scss">
.results {
	min-height: 100vh;
	padding-top: 90px;
	h1,
	h2 {
		color: white;
	}
}
</style>