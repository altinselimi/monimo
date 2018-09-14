<template>
	<div class="home">
		<headerr :ifHome="back_button"></headerr>
		<categories-section :categories="_genres" @addCategory="addCategory"></categories-section>
		<movie-carousel :movies="currently_watching" title="Continue Watching" @navigate="openAnime" v-if="currently_watching.length" :isResult="false" :filteredSeries="selected_genre_names"></movie-carousel>
		<movie-carousel :showLoader="getting_anime_info" :movies="animes" :title="'Trending'" :filteredSeries="selected_genre_names" @navigate="openAnime" :loading="getting_animes"
		:isResult="false"></movie-carousel>
		<movie-carousel :movies="favorite_animes" title="Favorites" @navigate="openAnime" v-if="favorite_animes.length > 0" :isResult="false" :filteredSeries="selected_genre_names"></movie-carousel>
		<doggo></doggo>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
	name: 'Home',
	components: {
		headerr: () =>
			import ('./components/header'),
		movieCarousel: () =>
			import ('./components/movie-carousel'),
		doggo: () =>
			import ('./components/doggo'),
		categoriesSection: () =>
			import ('./components/categories'),
	},
	mounted() { //order=score_desc&page=1
		// this.$http.get('https://www.masterani.me/api/anime/filter?page=1')
		// .then(res => { console.log('response:', res)}).catch(err => console.error(err));
		if (!this.animes) {
			this.getting_animes = true;
			this.getAnimes().then(res => {
				this.getting_animes = false;
			}).catch(err => {
				this.getting_animes = false;
				throw err;
			});
		}
	},
	computed: {
		...mapGetters(['filtered_animes', 'favorite_animes', 'currently_watching']),
		...mapState({
			animes: state => state.animes,
			animes_w_details: state => state.animes_w_details,
			preferred_genres: state => state.preferred_genres,
			search_query: state => state.search_query,
		}),
		_genres() {
			return this.genres.map(genre => ({ ...genre, ['selected']: this.preferred_genres.includes(genre.id) }))
		},
		resultsTitle() {
			console.log(this.preferred_genres);
			return this.search_query ? 'Results' : 'Trending';
		},
	},
	data: () => ({
		back_button : true, 
		getting_anime_info: null,
		getting_animes: false,
		genres: [{ "name": "action", "id": 57 }, { "name": "adventure", "id": 58 }, { "name": "drama", "id": 60 }, { "name": "fantasy", "id": 77 }, { "name": "horror", "id": 71 }, { "name": "kids", "id": 95 }, { "name": "mystery", "id": 63 }, { "name": "psychological", "id": 73 }, { "name": "romance", "id": 67 }, { "name": "school", "id": 78 }, { "name": "sci-fi", "id": 61 }, { "name": "sports", "id": 65 }, { "name": "thriller", "id": 74 }],
		selected_genre_names: [],
	}),
	methods: {
		...mapActions(['getAnimes', 'getAnimeDetails']),
		...mapMutations(['SET_CURRENT_ANIME', 'ADD_PREFERRED_GENRE', 'REMOVE_PREFERRED_GENRE']),
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
		addCategory(genre) {
			if (genre.selected) {
				this.REMOVE_PREFERRED_GENRE(genre.id);
				this.selected_genre_names.splice(this.selected_genre_names.findIndex(name => genre.name === name),1);
			} else {
				this.ADD_PREFERRED_GENRE(genre.id);
				this.selected_genre_names.push(genre.name);
			}
			this.getting_animes = true;
			this.getAnimes().then(res => {
				this.getting_animes = false;
			}).catch(err => {
				this.getting_animes = false;
				throw err;
			});
		}
	},
}
</script>
<style lang="scss">
.home {
	background-image: url('./assets/doggo.jpg');
	background-position: center center;
	background-size: cover;
	min-height: 100vh;
	background-color: rgba(black, 0.65);
	background-blend-mode: overlay;
	padding-top: 90px;
	.movie-carousel {
		display: flex;
		overflow-x: auto;
		padding-bottom: 20px;
	}
}

h1,
h2 {
	font-family: 'Arvo';
}
</style>