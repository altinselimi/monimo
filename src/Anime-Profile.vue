<template>
	<div class="wrapper" v-if="current_anime">
		<div class="background-wrap">
			<div class="background-top" :style="`background-image: url('${wallpaper}')`">
			</div>
			<div class="overlay"></div>
		</div>
		<headerr />
		<article>
			<div style="padding: 20px; flex: 1;">
				<div class="article-top">
					<h1>{{current_anime.info.title}}</h1>
					<p style="margin: 8px 0px;">{{current_anime.info.synopsis.slice(0,400)}}...</p>
					<div style="margin: 15px 0px;">
						<div class="info-sec">
							<h4>Genres</h4>
							<ul class="genres">
								<li class="genre" v-for="genre in current_anime.genres">{{genre.name}}</li>
							</ul>
						</div>
						<div class="info-sec">
							<h4>Rating</h4>
							<ul class="genres">
								<li class="genre">{{current_anime.info.score}}/5</li>
							</ul>
						</div>
						<div class="info-sec">
							<h4>Total Episodes</h4>
							<ul class="genres">
								<li class="genre">{{current_anime.info.episode_count}}</li>
							</ul>
						</div>
						<div class="info-sec">
							<h4>Status</h4>
							<ul class="genres">
								<li class="genre">{{current_anime.info.status === 0 ? 'Finished' : 'Ongoing'}}</li>
							</ul>
						</div>
						<div class="info-sec">
							<h4>Trailer</h4>
							<ul class="genres">
								<li class="genre trailer-link">
									<a :href="`https://youtube.com/watch?v=${current_anime.info.youtube_trailer_id}`">{{current_anime.info.title}}</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<button :class="{'is-favorite' : isFavorite}" class="favorite-btn" @click="addToFavorites()">
					<svg class="feather feather-heart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					</svg>
					FAVORITE
				</button>
				<div class="next-up" v-if="isCurrentlyWatching && isCurrentlyWatching.next_up">
					<h1>{{isCurrentlyWatching.next_not_aired || isCurrentlyWatching.finished ? 'Last Watched' : 'Next Up'}}</h1>
					<episode-card :episode="isCurrentlyWatching.next_up" @watchit="watchEpisode(episode, isCurrentlyWatching.next_up.last_watched_index++)" style="margin: 0px;"></episode-card>
				</div>
			</div>
			<div class="episodes-section">
				<div>
					<h1>Episodes</h1>
					<ul class="episodes">
						<li v-for="(episode, index) in current_anime.episodes">
							<episode-card :episode="episode" @watchit="watchEpisode(episode, index)" :current="isCurrentlyWatching && isCurrentlyWatching.next_up.last_watched_index === index"></episode-card>
						</li>
					</ul>
				</div>
			</div>
		</article>
	</div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
	name: 'anime-profile',
	components: {
		episodeCard: () =>
			import ('./components/episode-card'),
		headerr: () =>
			import ('./components/header.vue'),
	},
	beforeMount() {
		console.log('anime profile mounted', this.$route.params);
		if (!this.current_anime) {
			this.getAnimeDetails(this.$route.params.id);
		}
	},
	computed: {
		...mapState({
			current_anime: state => state.current_anime,
			favorite_animes: state => state.favorite_animes,
			watching_animes: state => state.watching_animes,
		}),
		isFavorite() {
			return this.favorite_animes.find(anime => anime.info.id === this.current_anime.info.id);
		},
		wallpaper() {
			let { wallpapers } = this.current_anime;
			if (!wallpapers || wallpapers.length === 0) return null;
			console.log('Wallpapers:', wallpapers);
			return this.current_anime && `https://cdn.masterani.me/wallpaper/0/${wallpapers[this.getRandomInt(wallpapers.length)].file}`;
		},
		isCurrentlyWatching() {
			return this.watching_animes.find(anime => anime.info.id === this.current_anime.info.id);
		},
	},
	methods: {
		...mapActions(['getAnimeDetails', 'getVideoLink']),
		...mapMutations(['ADD_TO_FAVORITES', 'REMOVE_FROM_FAVORITES', 'ADD_TO_WATCHING', 'REMOVE_FROM_WATCHING']),
		getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max));
		},
		watchEpisode(_episode, index) {
			let { slug, episode_count, status } = this.current_anime.info;
			let { episodes } = this.current_anime;
			let episode = _episode.info.episode;
			this.getVideoLink({ slug, episode }).then(result => {
				if (this.isCurrentlyWatching)
					this.REMOVE_FROM_WATCHING(this.current_anime);
				let next_up = episodes[index + 1];
				if (!next_up)
					next_up = episodes[index];
				next_up['last_watched_index'] = index;
				if (index < episode_count - 1)
					this.ADD_TO_WATCHING({ ...this.current_anime, ['next_up']: next_up })
				else if (status === 0 && index === episode_count - 1)
					this.ADD_TO_WATCHING({ ...this.current_anime, ['next_up']: next_up, ['finished']: true });
				else
					this.ADD_TO_WATCHING({ ...this.current_anime, ['next_up']: next_up, ['next_not_aired']: true })

				this.$router.push(`/anime/${this.current_anime.info.id}/watch/${btoa(result.data.src)}`);
			}).catch(err => {
				throw err;
			});
			console.log('Episode:', _episode);
		},
		addToFavorites(anime) {
			if (this.isFavorite) {
				this.REMOVE_FROM_FAVORITES(this.current_anime);
			} else {
				this.ADD_TO_FAVORITES(this.current_anime);
			}
		},
	},
}
</script>
<style lang="scss">
.wrapper {
	width: 100%;
	min-height: 100%;
	position: relative;
	display: flex;
	flex-direction: column; //justify-content: center;
	align-items: center;
	background-color: black;
	.background-top {
		height: 100vh;
		background-size: cover;
		background-position: center center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 0;
	}
	.overlay {
		background: linear-gradient(180deg, rgba(black, 0.34) 0, rgba(black, 0.85) 20%, black 70%);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
	article {
		position: relative;
		z-index: 1;
		color: white;
		width: 100%;
		padding: 50px;
		padding-top: 90px;
		display: flex;
		flex-wrap: wrap;
	}
	.article-top {
		max-width: 500px;
		.info-sec {
			display: flex;
			align-items: flex-start;
			margin: 0px;
			margin-bottom: 0px;
			h4 {
				margin: 5px 0px;
				margin-right: 15px;
				font-size: .8rem;
			}
		}
		.genres {
			list-style: none;
			padding: 0px;
			font-size: .8rem;
			margin: 0px;
			display: flex;
			flex-wrap: wrap;
			margin-left: -5px;
			margin-bottom: 10px;
			opacity: .75;
		}
	}
	.trailer-link {
		color: #2196F3;
	}
	.genre {
		padding: 0px 0px;
		border-radius: 20px; //border: solid 1px white;
		margin: 5px;
		&::after {
			content: '|';
			display: inline-block;
			margin-left: 8px;
		}
		&:last-child::after {
			content: '';
		}
	}
	.next-up {
		border-top: solid 1px rgba(white, .09);
		margin-top: 30px;
	}
	.episodes-section {
		border-left: solid 1px rgba(white, .09);
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 2;
		flex-shrink: 0;
	}
	.episodes {
		z-index: 3;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 350px));
		grid-column-gap: 15px;
		margin: 0px;
		padding: 0px;
		list-style: none;
	}
	.favorite-btn {
		display: flex;
		align-items: center;
		background-color: transparent;
		border-radius: 20px;
		border: solid 1px white;
		padding: 5px 10px;
		color: white;
		font-size: .8rem;
		svg {
			stroke: white;
			stroke-width: 2px;
			width: 20px;
			height: 20px;
			margin-right: 10px;
		}
		&.is-favorite {
			svg {
				stroke: red;
				fill: red;
			}
		}
	}
}
</style>