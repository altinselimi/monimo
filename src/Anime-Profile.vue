<template>
    <div class="wrapper" v-if="current_anime">
        <div class="background-wrap">
            <div class="background-top" :style="{backgroundImage: `url('${wallpapertest}')`}">
            </div>
            <div class="overlay"></div>
        </div>
        <headerr />
        <article>
            <div style="padding: 20px; flex: 1;">
                <div class="article-top" v-if="current_anime.info">
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
                            <ul class="genres" style="margin: 0px; align-self: center;">
                                <li>
                                    <button @click="show_trailer = true" class="trailer-link">{{current_anime.info.title}}</button>
                                </li>
                            </ul>
                            <div class="trailer-wrapper" @click="show_trailer = false" v-if="show_trailer">
                                <iframe :src="`https://youtube.com/embed/${current_anime.info.youtube_trailer_id}`" frameborder="0"></iframe>
                                <button class="close-trailer">CLOSE TRAILER</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button :class="{'is-favorite' : isFavorite}" class="favorite-btn" @click="addToFavorites()">
                    <heart-icon /> FAVORITE
                </button>
                <div class="finished-anime" v-if="finishedAnime">
                    <h3>You have finished this anime. 🥂</h3>
                </div>
                <div class="next-up" v-if="expectingNext && !finishedAnime">
                    <h1>Next Up ⚠️</h1>
                    <episode-card v-if="nextEpisode" :poster="animeWithDetails.poster" :episode="nextEpisode" @watchit="watchEpisode(nextEpisode)" style="margin: 0px;"></episode-card>
                    <h3 v-else>Upcoming episode has not been released yet. ☹️</h3>
                </div>
                <div class="next-up" v-if="wasWatching && !expectingNext">
                    <h1>Continue Watching 🍿</h1>
                    <episode-card :poster="animeWithDetails.poster" :episode="wasWatching" @watchit="watchEpisode(wasWatching)" style="margin: 0px;"></episode-card>
                </div>
            </div>
            <div class="episodes-section">
                <div>
                    <h1>Episodes</h1>
                    <ul class="episodes">
                        <li v-for="(episode, index) in current_anime.episodes">
                            <episode-card :poster="animeWithDetails.poster" :showLoader="index === start_episode" :episode="episode" @watchit="watchEpisode(episode)"></episode-card>
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { HeartIcon } from 'vue-feather-icons'
import { bypassWallpaper } from './utils';
export default {
    name: 'anime-profile',
    data: () => ({
        start_episode: null,
        show_trailer: false,
        wallpapertest: ''
    }),
    components: {
        episodeCard: () =>
            import ('./components/episode-card'),
        headerr: () =>
            import ('./components/header.vue'),
        HeartIcon
    },
    beforeMount() {
        console.log('anime profile mounted', this.$route.params);
        this.getAnimeDetails(this.$route.params.id); //fetch the anime details again. this includes episodes.
    },
    // mounted() {
    //   //do something after mounting vue instance
    //   let { wallpapers } = this.current_anime;
    //   if (this.region_blocked) {
    //     if (!wallpapers || wallpapers.length === 0) {
    //       bypassWallpaper(this.animeWithDetails.poster).then(response => {
    //         this.wallpapertest = response;
    //       });
    //     }
    //     const selectedWallpaper = `https://cdn.masterani.me/wallpaper/0/${wallpapers[this.getRandomInt(wallpapers.length)].file}`;
    //     bypassWallpaper(selectedWallpaper).then(response => {
    //       this.wallpapertest = response;
    //     });
    //   } else {
    //     if (!wallpapers || wallpapers.length === 0) this.wallpapertest = this.animeWithDetails.poster;
    //     this.wallpapertest = `https://cdn.masterani.me/wallpaper/0/${wallpapers[this.getRandomInt(wallpapers.length)].file}`;
    //   }
    // },
    computed: {
        ...mapState({
            region_blocked: state => state.blocked_region,
            current_anime: state => state.current_anime,
            favorite_animes: state => state.favorite_animes,
            animes_w_details: state => state.animes_w_details,
        }),
        isFavorite() {
            return this.favorite_animes.find(anime => anime.info.id === this.current_anime.info.id);
        },
        animeWithDetails() {
            return this.animes_w_details && this.animes_w_details[this.current_anime.info.id];
        },
        wallpaper() {
            let retURL = ''
            let { wallpapers } = this.current_anime;
            if (this.region_blocked) {
              if (!wallpapers || wallpapers.length === 0) {
                bypassWallpaper(this.source).then(response => {
                  return response;
          			});
              }
              const selectedWallpaper = `https://cdn.masterani.me/wallpaper/0/${wallpapers[this.getRandomInt(wallpapers.length)].file}`;
              bypassWallpaper(selectedWallpaper).then(response => {
                console.log('I am being called!');
                retURL = response;
                this.wallpapertest = retURL;
              });
              // const res = bypassWallpaper(selectedWallpaper);
              // retURL = res;
            } else {
              if (!wallpapers || wallpapers.length === 0) return this.animeWithDetails.poster;
              return this.current_anime && `https://cdn.masterani.me/wallpaper/0/${wallpapers[this.getRandomInt(wallpapers.length)].file}`;
            }
          console.log(retURL);
          return retURL
        },
        wasWatching() {
            let { watching, episodes } = this.animeWithDetails;
            return watching && episodes[parseInt(watching) - 1];
        },
        expectingNext() {
            return this.animeWithDetails.expecting_next;
        },
        nextEpisode() {
            let { episodes, watching } = this.animeWithDetails;
            return this.expectingNext && episodes[watching] || null;
        },
        finishedAnime() {
            let { episodes, watching, info } = this.animeWithDetails;
            if (!watching) return;
            return !episodes[watching] && info.status === 0 && this.wasWatching.current_time === 0;
        },
    },
    methods: {
        ...mapActions(['getAnimeDetails', 'getVideoLinks']),
        ...mapMutations(['ADD_TO_FAVORITES', 'REMOVE_FROM_FAVORITES', 'ADD_TO_WATCHING', 'REMOVE_FROM_WATCHING', 'SET_CURRENT_VIDEO_LINKS']),
        getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        },
        watchEpisode(_episode) {
            let { slug, status } = this.current_anime.info;
            let episode = _episode.info.episode;
            this.getVideoLinks({ slug, episode }).then(result => {
                console.log('Links:', result);
                this.SET_CURRENT_VIDEO_LINKS(result);
                if (this.isCurrentlyWatching) this.REMOVE_FROM_WATCHING(this.current_anime);
                this.$router.push(`/anime/${this.current_anime.info.id}/${this.current_anime.info.slug}/watch/${episode}`);
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
        padding-right: 0px;
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
        border: none;
        font-size: .8rem;
        padding: 0px;
        background: transparent;
        margin: 0px;
    }

    .trailer-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.89);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 10;

        iframe {
            width: 500px;
            height: 300px;
        }

        .close-trailer {
            background: transparent;
            border: none;
            border-bottom: solid 1px white;
            color: white;
        }
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
        justify-content: flex-start;
        flex: 2;
        flex-shrink: 0;
    }

    .episodes {
        z-index: 3;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 350px));
        margin: 0px;
        padding: 0px;
        list-style: none;
        grid-column-gap: 20px;
        grid-row-gap: 20px;
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

        &:focus {
            outline: none;
        }
    }
}
</style>
