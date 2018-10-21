<template>
	<div class="home">
		<div class="home-background" :style="`background-image: url('${random_wallpaper}')`"></div>
		<headerr :is-home="true"></headerr>
		<categories-section :categories="store_genres" @addCategory="addCategory"></categories-section>
		<div class="movie-carousels">
			<movie-carousel @changeOrder="SET_SECTION_ORDER" :section-order="sections_order['trending']" :showLoader="getting_anime_info" :movies="animes" :selected-genres="selected_genres_name" :title="'Trending'" @navigate="openAnime" :loading="getting_animes"></movie-carousel>
			<movie-carousel @changeOrder="SET_SECTION_ORDER" :section-order="sections_order['continue']" :movies="currently_watching" title="Continue Watching" @navigate="openAnime" message="You'll find here animes you are currently watching" :will-appear="!currently_watching" @remove="removeFromCurrentlyWatching" :removable="true"></movie-carousel>
			<movie-carousel @changeOrder="SET_SECTION_ORDER" :section-order="sections_order['fresh']" :movies="last_releases" title="Fresh Off The Oven" @navigate="openAnime($event, false)"></movie-carousel>
			<movie-carousel @changeOrder="SET_SECTION_ORDER" :section-order="sections_order['staff']" :movies="staff_picks" title="Staff Picks" @navigate="openAnime"></movie-carousel>
			<movie-carousel @changeOrder="SET_SECTION_ORDER" :section-order="sections_order['favorites']" :movies="favorite_animes" title="Favorites" @navigate="openAnime" message="This is a sacred place for only your most favorite ones!" :will-appear="!favorite_animes" @remove="removeFromFavorites" :removable="true"></movie-carousel>
		</div>
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
		...mapGetters(['filtered_animes', 'favorite_animes', 'currently_watching', 'sections_order']),
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
		random_wallpaper() {
			return './wallpapers/' + this.wallpapers[Math.floor(Math.random() * this.wallpapers.length)];
		},
	},
	data: () => ({
		getting_anime_info: null,
		wallpapers: ['doggo.jpg', 'boygirl.jpg', 'sunset.png'],
		getting_last_releases: false,
		getting_animes: false,
		genres: [{ "name": "action", "id": 57 }, { "name": "adventure", "id": 58 }, { "name": "comedy", "id": 59 }, { "name": "drama", "id": 60 }, { "name": "fantasy", "id": 77 }, { "name": "horror", "id": 71 }, { "name": "kids", "id": 95 }, { "name": "mystery", "id": 63 }, { "name": "psychological", "id": 73 }, { "name": "romance", "id": 67 }, { "name": "school", "id": 78 }, { "name": "sci-fi", "id": 61 }, { "name": "sports", "id": 65 }, { "name": "thriller", "id": 74 }],
		selected_genre_names: [],
	}),
	methods: {
		...mapActions(['getAnimes', 'getAnimeDetails', 'getLastReleases']),
		...mapMutations(['SET_CURRENT_ANIME', 'ADD_PREFERRED_GENRE', 'REMOVE_PREFERRED_GENRE', 'SET_NOTIFICATION', 'REMOVE_FROM_FAVORITES', 'REMOVE_FROM_WATCHING', 'SET_SECTION_ORDER']),
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
		},
		removeFromFavorites(anime) {
			this.REMOVE_FROM_FAVORITES(anime);
		},
		removeFromCurrentlyWatching(anime) {
			this.REMOVE_FROM_WATCHING(anime);
		},
	},
}
</script>
<style lang="scss">
.home {
	padding-top: 90px;

	.home-background {
		position: fixed;
		z-index: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transform: scaleX(-1);
        filter: FlipH;
		background-position: center center;
		background-size: cover;
		min-height: 100vh;
		background-color: rgba(black, 0.75);
		background-blend-mode: overlay;
	}

	.movie-carousels {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

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

.home-background~* {
	z-index: 1;
	position: relative;
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