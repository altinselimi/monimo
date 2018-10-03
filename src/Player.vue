<template>
    <div class="player" @mousemove="showUi">
        <div class="top-buttons" v-show="show_ui">
            <div class="buttons-left">
                <button class="unstyled back-btn" @click="$router.go(-1)">
                    <ArrowLeftIcon style="stroke: white;" />
                </button>
                <p v-if="animeDetails.info.episode_count > 1">{{`${animeDetails.info.title} - Episode ${episode_number}`}}</p>
                <p v-else>{{`${animeDetails.info.title}`}}</p>
            </div>
            <div class="buttons-right">
                <option-picker :left="true" class="type-picker" :options="linkOptions" :model.sync="videoLink">
                    <link-icon slot="activator" style="stroke: white;"></link-icon>
                </option-picker>
                <option-picker :left="true" class="type-picker" :options="animeTypes" :model.sync="anime_type">
                    <subs-icon slot="activator"></subs-icon>
                </option-picker>
                <option-picker class="type-picker" :left="true" :model.sync="requested_quality" :options="[{label: 'Low', value: 480}, {label: 'Medium', value: 720}, {label: 'High', value: 1080}]">
                    <droplet-icon slot="activator" style="fill: white;"></droplet-icon>
                </option-picker>
                <button @click="setWindowMode()" class="unstyled" v-if="window_mode === 'normal'"><maximize style="stroke: white" /></button>
                <button @click="setWindowMode()" class="unstyled" v-else><minimize style="stroke: white"/></button>
            </div>
        </div>
        <div class="loader" v-if="failed_links.includes(videoLink)">
            <triangle-icon style="stroke: red; animation: none; width: 40px; height: 40px;"/>
            <span>We are sorry, this link does not seem to be working 😔.</span>
        </div>
        <div class="loader" v-if="loading_player">
            <LoaderIcon/>
            <span>Go grab the 🍿, this might take a while.</span>
        </div>
        <video-instance class="vid-instance" :key="videoLink" :loading-player.sync="loading_player" :episode-current-time="episodeCurrentTime" :preferred-quality="requested_quality" :source="videoLink" style="width:100%; height:100%;" @updateAnime="updateAnime(episode_number)" @addToWatching="ADD_TO_WATCHING(animeDetails)" @windowModeChange="SET_WINDOW_MODE" @setCurrentTime="setAnimeCurrentTime" @failed="linkFailed(videoLink)"></video-instance>
        <!--         <webview v-for="(video, index) in video_links" :key="index" :id="`candidate-${index + 1}`" :src="video.link" style="width:100%;height:100%"></webview>
 -->
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
import { LoaderIcon, ArrowLeftIcon, DropletIcon, Maximize2Icon, Minimize2Icon, LinkIcon, AlertTriangleIcon } from 'vue-feather-icons'
import OptionPicker from '@/components/picker';
import PlayerControls from '@/components/player-controls';
import SubsIcon from '@/assets/sub-icon.vue';
import videoInstance from '@/components/WebviewInstance.vue';

let global_timeout = null;

export default {
    props: ['episode_number', 'anime_id', 'anime_slug'],
    name: 'Player',
    components: {
        LoaderIcon,
        ArrowLeftIcon,
        OptionPicker,
        SubsIcon,
        DropletIcon,
        Maximize: Maximize2Icon,
        Minimize: Minimize2Icon,
        TriangleIcon: AlertTriangleIcon,
        PlayerControls,
        videoInstance,
        LinkIcon,
    },
    data: () => ({
        show_ui: false,
        current_time: null,
        video_length: null,
        loading_player: true,
        countdown: 60,
        internet_speed: null,
        loaded_index: null,
        preferred_link: null,
        failed_links: [],
    }),
    mounted() {
        if (!this.video_links) {
            this.getVideoLinks({
                slug: this.anime_slug,
                episode: this.episode_number,
            }).then(result => {
                this.SET_CURRENT_VIDEO_LINKS(result);
            }).catch(err => {
                console.log('error');
                //this.$router.go(-1);
            });
        }
    },
    computed: {
        ...mapState({
            animes_w_details: state => state.animes_w_details,
            current_anime_video_links: state => state.current_anime_video_links,
            preferred_anime_type: state => state.preferred_anime_type,
            preferred_quality: state => state.preferred_quality,
            window_mode: state => state.window_mode,
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
        linkOptions() {
            return this.video_links ? this.video_links.reduce((b, a) => {
                b.push({...a, ['label']: a.name, ['value']: a.link});
                return b;
            }, []) : [];
        },
        videoLink: {
            get() {
                return this.preferred_link || this.linkOptions[0].link;
            },
            set(value) {
                console.log('Setting loading player to true');
                this.loading_player = true;
                this.preferred_link = value;
            },
        },
        animeTypes() {
            let options = [{label: 'Subbed', value: 0, field: 'subs'}, {label: 'Dubbed', value: 1, field:'dubs'}];
            return options.filter(option => this.current_anime_video_links[option.field].length > 0);
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
        setWindowMode(){
            if(this.window_mode === 'normal'){
                this.SET_WINDOW_MODE('full');
                document.body.requestFullscreen()
            }else{
                this.SET_WINDOW_MODE('normal');
                document.exitFullscreen();
            }
        },
        setAnimeCurrentTime(time) {
            if(this.current_time === time) return;
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
        linkFailed(link) {
            this.failed_links.push(link);
        },
    },
    beforeDestroy() {
        clearTimeout(global_timeout);
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