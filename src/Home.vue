<template>
	<div class="home">
		<headerr :is-home="true"></headerr>
		<categories-section :categories="store_genres" @addCategory="addCategory"></categories-section>
		<movie-carousel :showLoader="getting_anime_info" :movies="animes" :selected-genres="selected_genres_name" :title="'Trending'" @navigate="openAnime" :loading="getting_animes"></movie-carousel>
		<movie-carousel :movies="currently_watching" title="Continue Watching" @navigate="openAnime" v-if="currently_watching.length"></movie-carousel>
		<div class="two-in-one">
			<movie-carousel style="flex: 1;" :movies="last_releases" title="Fresh Off The Oven" @navigate="openAnime($event, false)"></movie-carousel>
			<movie-carousel style="flex: 1;" :movies="staff_picks" title="Staff Picks" @navigate="openAnime"></movie-carousel>
		</div>
		<movie-carousel :movies="favorite_animes" title="Favorites" @navigate="openAnime" v-if="favorite_animes.length > 0"></movie-carousel>
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
			this.loadAnimes();
		}
		this.loadLastReleases();

	},
	computed: {
		...mapGetters(['filtered_animes', 'favorite_animes', 'currently_watching']),
		...mapState({
			animes: state => state.animes,
			last_releases: state => state.last_releases,
			animes_w_details: state => state.animes_w_details,
			preferred_genres: state => state.preferred_genres,
			search_query: state => state.search_query,
			staff_picks: state => state.staff_picks,
		}),
		store_genres() {
			return this.genres.map(genre => ({ ...genre, ['selected']: this.preferred_genres.includes(genre.id) }))
		},
		selected_genres_name() {
			return this.store_genres.filter(genre => genre.selected).map(genre => genre.name);
		},

	},
	data: () => ({
		getting_anime_info: null,
		getting_last_releases: false,
		getting_animes: false,
		genres: [{ "name": "action", "id": 57 }, { "name": "adventure", "id": 58 }, { "name": "drama", "id": 60 }, { "name": "fantasy", "id": 77 }, { "name": "horror", "id": 71 }, { "name": "kids", "id": 95 }, { "name": "mystery", "id": 63 }, { "name": "psychological", "id": 73 }, { "name": "romance", "id": 67 }, { "name": "school", "id": 78 }, { "name": "sci-fi", "id": 61 }, { "name": "sports", "id": 65 }, { "name": "thriller", "id": 74 }],
		selected_genre_names: [],
	}),
	methods: {
		...mapActions(['getAnimes', 'getAnimeDetails', 'getLastReleases']),
		...mapMutations(['SET_CURRENT_ANIME', 'ADD_PREFERRED_GENRE', 'REMOVE_PREFERRED_GENRE']),
		loadAnimes() {
			this.getting_animes = true;
			this.getAnimes().then(res => {
				this.getting_animes = false;
			}).catch(err => {
				this.getting_animes = false;
				throw err;
			});
		},
		loadLastReleases() {
			this.getting_last_releases = true;
			this.getLastReleases().then(res => {
				this.getting_last_releases = false;
			}).catch(err => {
				this.getting_last_releases = false;
				throw err;
			});
		},
		openAnime(anime, set_current = true) {
			if (this.animes_w_details[anime.id]) {
				this.getAnimeDetails(anime.id);
				if (set_current) this.SET_CURRENT_ANIME(this.animes_w_details[anime.id]);
				else {
					this.SET_CURRENT_ANIME(null);
				}
				this.$router.push(`/anime/${anime.id}`);
			} else {
				this.getting_anime_info = anime.id;
				this.getAnimeDetails(anime.id).then(res => {
					console.log('Got details for', anime.id);
					this.SET_CURRENT_ANIME(res);
					this.$router.push(`/anime/${anime.id}`);
					this.getting_anime_info = false;
				}).catch(err => {
					throw err;
				});
			}
		},
		addCategory(genre) {
			if (genre.selected) {
				this.REMOVE_PREFERRED_GENRE(genre.id);
				this.selected_genre_names.splice(this.selected_genre_names.findIndex(name => genre.name === name), 1);
			} else {
				this.ADD_PREFERRED_GENRE(genre.id);
				this.selected_genre_names.push(genre.name);
			}
			this.loadAnimes();
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
	background-color: rgba(black, 0.75);
	background-blend-mode: overlay;
	padding-top: 90px;
	.movie-carousel {
		display: flex;
		overflow-x: auto;
		padding-bottom: 10px;
	}
	.carousel-wrapper {
		//flex: 1;
		overflow-x: auto;
	}
	.two-in-one {
		display: grid;
		grid-template-columns: 1fr;
		grid-column-gap: 20px;
	}
	.categories-carousel,
	.carousel-wrapper {
		//margin-left: 10px;
	}
}


/* @media screen and (max-width: 1000px) {
	.two-in-one {
		grid-template-columns: auto;
	}
} */

h1,
h2 {
	font-family: 'Arvo';
}
</style>