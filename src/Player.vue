<template>
    <div class="player" @mousemove="showUi">
        <div class="top-buttons">
            <div class="buttons-left">
                <button class="unstyled back-btn" @click="$router.go(-1)">
                    <ArrowLeftIcon style="stroke: white;" />
                </button>
                <p>{{`${animeDetails.info.title} - Episode ${episode_number}`}}</p>
            </div>
            <div class="buttons-right">
                <option-picker style="margin-left: 15px;" :left="true" class="type-picker" :options="[{label: 'Subbed', value: 0}, {label: 'Dubbed', value: 1}]" :model.sync="anime_type">
                    <subs-icon slot="activator"></subs-icon>
                </option-picker>
                <option-picker class="type-picker" :left="true" :model.sync="requested_quality" :options="[{label: 'Low', value: 480}, {label: 'Medium', value: 720}, {label: 'High', value: 1080}]">
                    <droplet-icon slot="activator" style="fill: white;"></droplet-icon>
                </option-picker>
            </div>
        </div>
        <div class="loader" v-if="loading_player || !video_length">
            <LoaderIcon/>
            <span>Go grab the 🍿, this might take a while.</span>
        </div>
        <webview v-for="(video, index) in video_links" :key="index" :id="`candidate-${index + 1}`" :src="video.link" style="width:100%;height:100%"></webview>
        <!-- <player-controls :class="{'is-near-end': isEpisodeNear, 'show-ui': show_ui}" @next="navigateToEpisode(anime_id, episode_number)" @pause="pauseVideo()" @backwards="videos(15)"></player-controls> -->
    </div>
</template>
<script>
import {
    mapMutations,
    mapState,
    mapActions,
    mapGetters
} from 'vuex';
import { LoaderIcon, ArrowLeftIcon, DropletIcon } from 'vue-feather-icons'
import OptionPicker from '@/components/picker';
import PlayerControls from '@/components/player-controls';
import SubsIcon from '@/assets/sub-icon.vue';

let global_timeout = null;
let timer = null;
let webview; //defined here so all lifehooks have access to it

const video_player_style = `
    body,html {
        background-color:black;
    }
    body > * {
        display: none!important;
    }
    video#the-real-video {
        display: block!important;
    }
    body > video {
        height: 100%;
        width: 100%;
        border: none;
        display: block;
    }
`;

export default {
    props: ['episode_number', 'anime_id', 'anime_slug'],
    name: 'Player',
    components: {
        LoaderIcon,
        ArrowLeftIcon,
        OptionPicker,
        SubsIcon,
        DropletIcon,
        PlayerControls,
    },
    data: () => ({
        show_ui: false,
        current_time: null,
        video_length: null,
        loading_player: true,
        countdown: 60,
        js_executed: false,
        internet_speed: null,
        winner: '#candidate_1',
    }),
    mounted() {
        let links = this.video_links;
        if (!links) {
            this.getVideoLinks({
                slug: this.anime_slug,
                episode: this.episode_number,
            }).then(result => {
                this.SET_CURRENT_VIDEO_LINKS(result);
                this.setVideoQuality(this.video_links);
            }).catch(err => {
                console.log('error');
                //this.$router.go(-1);
            });
        } else {
            this.setVideoQuality(this.video_links);
        }
    },
    computed: {
        ...mapState({
            animes_w_details: state => state.animes_w_details,
            current_anime_video_links: state => state.current_anime_video_links,
            preferred_anime_type: state => state.preferred_anime_type,
            preferred_quality: state => state.preferred_quality,
        }),
        ...mapGetters(['video_links']),
        isElectron() {
            return true; //navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
        },
        animeDetails() {
            return this.animes_w_details && this.animes_w_details[this.anime_id];
        },
        episodeCurrentTime() {
            return this.animeDetails && this.currentEpisode && this.currentEpisode.current_time;
        },
        currentEpisode() {
            return this.animeDetails && this.animeDetails.episodes[this.episode_number - 1];
        },
        nextEpisodeExists() {
            return !!this.animeDetails.episodes[this.episode_number];
        },
        isEpisodeNear() {
            return this.video_length && this.current_time + 60 >= this.video_length;
        },
        progressValue() {
            return parseInt(100 - (100 * this.countdown / 60));
        },
        anime_type: {
            get() {
                return this.preferred_anime_type;
            },
            set(value) {
                this.SET_PREFERRED_TYPE(value);
                location.reload();
            },
        },
        requested_quality: {
            get() {
                return this.preferred_quality;
            },
            set(value) {
                this.SET_PREFERRED_QUALITY(value);
                location.reload();
            },
        },
        candidates() {
            return this.video_links && this.video_links.filter(link => link.quality === this.requested_quality).map((link, index) => `#candidate-${index+1}`);
        },
    },
    methods: {
        ...mapMutations(['SET_CURRENT_TIME', 'UPDATE_DETAILED_ANIME', 'SET_CURRENT_VIDEO_LINKS', 'SET_WINDOW_MODE', 'ADD_TO_WATCHING', 'SET_PREFERRED_TYPE', 'SET_PREFERRED_QUALITY']),
        ...mapActions(['getVideoLinks']),
        showUi() {
            this.show_ui = true;
            clearTimeout(global_timeout);
            global_timeout = setTimeout(() => {
                this.show_ui = false;
            }, 3000);
        },
        setAnimeCurrentTime(time) {
            this.current_time = time;
            if (this.isEpisodeNear) {
                this.updateAnime(this.episode_number, true);
                let seconds_left = this.video_length - time;
                this.countdown = parseInt(seconds_left);
                this.SET_CURRENT_TIME({
                    anime: this.anime_id,
                    episode: this.episode_number,
                    time: 0 //reset time so next time user is here, they start from beginning
                });
                if (seconds_left <= 0) this.navigateToEpisode(this.anime_id, this.episode_number);
            } else {
                this.SET_CURRENT_TIME({
                    anime: this.anime_id,
                    episode: this.episode_number,
                    time: time
                });
            }
        },
        navigateToEpisode(anime_id, episode_number, forwards = true) {
            if (this.animes_w_details[anime_id].episodes[episode_number]) {
                let next_episode_index = parseInt(episode_number + 1) // + (forwards ? 1 : -1);
                this.getVideoLinks({
                    slug: this.anime_slug,
                    episode: next_episode_index,
                }).then(result => {
                    this.SET_CURRENT_TIME({
                        anime: this.anime_id,
                        episode: this.episode_number,
                        time: 0 //reset time so next time user is here, they start from beginning
                    });
                    this.SET_CURRENT_VIDEO_LINKS(result);
                    let router_link = `/anime/${anime_id}/watch/${next_episode_index}`;
                    this.$router.replace({ path: router_link });
                }).catch(err => {
                    this.$router.go(-1);
                });
            } else {
                if (this.animeDetails.info.status > 0) { // if anime is still ongoing
                    this.updateAnime(episode_number, true); // set expecting_next to true
                }
                this.$router.go(-1);
            }
        },
        updateAnime(episode_number, expecting_next) {
            this.UPDATE_DETAILED_ANIME({
                anime_id: this.anime_id,
                new_data: { ...this.animeDetails, ['watching']: episode_number, ['expecting_next']: !!expecting_next },
            });
        },
        addWebViewHooks(candidate, role) {
            const debug = process.env.NODE_ENV !== 'production';
            webview = document.querySelector(candidate);
            webview.addEventListener('did-start-loading', e => {
                webview.executeJavaScript(`
                    document.querySelectorAll('script').forEach(el => { 
                        let src = el.getAttribute('src');
                        let is_popads = src && src.includes('popads');
                        //if(is_popads) el.remove();
                    });
                    window.console.clear = () => {console.log('tried clearing')};`);
            });
            webview.addEventListener('did-finish-load', (e) => {
                webview.openDevTools();
                console.log(`Candidate ${candidate} did finish load`);
                if (this.js_executed) return;
                webview.insertCSS(video_player_style, role);
                webview.executeJavaScript(this.playEpisode(this.episodeCurrentTime || null));
                this.js_executed = true;
            });
            webview.addEventListener('console-message', (event) => {
                let { message } = event;
                if (message === 'started_playing') {
                    console.log('Loaded player', candidate);
                    this.loading_player = false;
                    this.removeFailures(candidate);
                    this.updateAnime(this.episode_number);
                    this.ADD_TO_WATCHING(this.animeDetails);
                    return;
                }
                if (message === 'fullscreen' || message === 'normal') {
                    this.SET_WINDOW_MODE(message);
                    return;
                }
                let msg = message.split(",");
                let current_time = Number(msg[0]);
                let length = Number(msg[1]);
                if (!this.video_length && !isNaN(length)) {
                    this.video_length = length;
                }
                if (!isNaN(current_time)) this.setAnimeCurrentTime(current_time); //the actual time that is emmited using console-message
            });
        },
        setVideoQuality(video_links) {
            let links = video_links;
            console.log('Setting video stuff with links:', links);
            this.candidates.forEach(candidate => {
                this.addWebViewHooks(candidate);
            });
        },
        removeFailures(winner) {
            console.log('Removing failures. Winner is:', winner);
            this.candidates.forEach(candidate => {
                if (candidate !== winner) {
                    console.log('Removing ', candidate);
                    document.querySelector(candidate).remove();
                }
            });
        },
        playEpisode(time, secondary) {
            return `
                    console.log('executing js');
                    var page_video = document.querySelector("video");
                    var video = document.createElement('video');
                    video.setAttribute('src', page_video.src);
                    video.setAttribute('autoplay', true);
                    video.setAttribute('controls', false);
                    video.setAttribute('preload', 'auto');
                    video.setAttribute('id', 'the-real-video');
                    video.addEventListener('webkitfullscreenchange', () => {
                        console.log(document.webkitFullscreenElement !== null ? 'fullscreen' : 'normal_window');
                    });
                    let starting_point = ${time};
                    document.body.append(video);
                    video.play().then(() => {
                        video.currentTime = ${time};
                        console.log('started_playing');
                        var timeout = setInterval(() => {
                            if(video.duration === video.currentTime) {
                                clearInterval(timeout);
                            };
                            console.log([video.currentTime, video.duration])
                        }, 1000);
                    }).catch(err => {
                        console.log('playing_failed');
                    });
                    window.onunload = () => {
                        clearInterval(timeout);
                    }
                `;
        }
    },
    beforeDestroy() {
        clearTimeout(global_timeout);
        clearInterval(timer);
    },
};
</script>
<style lang="scss">
button.unstyled {
    border: none;
    background-color: transparent;
}

.player {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    .top-buttons {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        top: 20px;
        left: 0;
        padding: 40px 25px;
        width: 100%;
        z-index: 2;
        >div {
            display: flex;
            align-items: center;
        }
        button:not(:last-child) {
            margin-right: 10px;
        }
        .buttons-right {
            margin-left: auto;
        }

        svg {
            stroke: rgba(black, .3);
        }

        .buttons-left p {
            color: white;
            text-shadow: 0px 0px 1px rgba(black, .3);
            font-weight: 700;
            font-size: 22px;
            margin: 0px;
        }
    }
}

webview {
    padding-top: 0px!important;
    width: 100%;
    height: 100%;
    border: none;
}

.nextup {
    position: absolute;
    bottom: 100px;
    right: 20px;
    padding: 2px 5px;
    color: white;
    background-color: #2196f3;
    z-index: 2;
}

.player-controls {
    &.show-ui {
        opacity: 1;
    }
    &.is-near-end {
        opacity: 1!important;
    }
}

.loader {
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;
    background: black;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    flex-direction: column;
    color: white;
    span {
        margin-top: 10px;
        opacity: .8;
    }
    svg {
        stroke: white;
        animation: spin 1s linear infinite;
    }
}

svg {
    stroke: white;
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