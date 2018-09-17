<template>
    <div class="player">
        <headerr v-show="show_header" />
        <div class="loader" v-if="isElectron && loading_player">
            <svg class="feather feather-loader sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="706">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        </div>
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
        <progress class="auto-next" :value="countdown" max="100" :style="`--progress:${countdown};`"></progress>
        <!-- <div v-if="isEpisodeNear" class="nextup">Next episode in: {{countdown}}</div> -->
    </div>
</template>
<script>
import {
    mapMutations,
    mapState,
    mapActions
} from 'vuex';

let global_timeout = null;
let timer = null;

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
    props: ['links', 'episode_number', 'anime_id'],
    components: {
        headerr: () =>
            import ('./components/header.vue'),
    },
    data: () => ({
        iframe_src: null,
        show_header: false,
        current_time: null,
        video_length: null,
        loading_player: true,
        countdown: 60,
        js_executed: false,
        internet_speed: null,
        anime_slug: null,
    }),
    created() {
        // this.$router.push('/');
        let links = JSON.parse(atob(this.links));
        this.anime_slug = links['slug'];
        links = links['subs'];
        let video;
        let medium_quality = links.find(link => link.quality === 720);
        let low_quality = links.find(link => link.quality === 480);
        let high_quality = links.find(link => link.quality === 1080);
        video = low_quality || medium_quality || high_quality;
        let internet_speed = navigator.connection.downlink; //navigator.connection.downlink not giving expected results
        if (internet_speed > 5 && medium_quality) {
            video = medium_quality;
        } else if (internet_speed > 8 && high_quality) {
            //  video = high_quality; //links from high_quality vids too slow.
        }
        this.internet_speed = internet_speed;
        this.iframe_src = video.link;
        if (!this.iframe_src) this.$router.push('/');
    },
    mounted() {
        if (!this.isElectron) return;
        let webview = document.querySelector("webview");
        webview.addEventListener('dom-ready', (e) => {
            if (this.js_executed) return;
            webview.insertCSS(video_player_style);
            webview.executeJavaScript(this.playEpisode(this.episodeCurrentTime || null));
            this.js_executed = true;
        });
        webview.addEventListener('console-message', (event) => {
            if (event.message === 'true') {
                this.loading_player = false;
                this.updateAnime(this.episode_number);
            }
            let msg = event.message.split(",");
            let current_time = Number(msg[0]);
            let length = Number(msg[1]);
            if (!this.video_length && !isNaN(length)) {
                this.video_length = length;
            }
            if (!isNaN(current_time)) this.setAnimeCurrentTime(current_time); //the actual time that is emmited using console-message
        });
    },
    computed: {
        ...mapState({
            animes_w_details: state => state.animes_w_details
        }),
        isElectron() {
            return true; //navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
        },
        animeDetails() {
            return this.animes_w_details && this.animes_w_details[this.anime_id];
        },
        episodeCurrentTime() {
            return this.animeDetails && this.currentEpisode.current_time;
        },
        currentEpisode() {
            return this.animeDetails && this.animeDetails.episodes[this.episode_number - 1];
        },
        isEpisodeNear() {
            return this.video_length && this.current_time + 60 >= this.video_length;
        }
    },
    methods: {
        ...mapMutations(['SET_CURRENT_TIME', 'UPDATE_DETAILED_ANIME']),
        ...mapActions(['getVideoLinks']),
        showHeader() {
            this.show_header = true;
            clearTimeout(global_timeout);
            global_timeout = setTimeout(() => {
                this.show_header = false;
            }, 3000);
        },
        setAnimeCurrentTime(time) {
            this.current_time = time;
            if (this.isEpisodeNear) {
                this.updateAnime(this.episode_number, true);
                let seconds_left = this.video_length - time;
                console.log('Seconds Left:', seconds_left);
                this.countdown = parseInt(seconds_left);
                if (seconds_left <= 0) this.goToNextEpisode(this.anime_id, this.episode_number);
            }
            this.SET_CURRENT_TIME({
                anime: this.anime_id,
                episode: this.episode_number,
                time: time
            });
        },
        goToNextEpisode(anime_id, episode_number) {
            if (this.animes_w_details[anime_id].episodes[episode_number]) {
                this.getVideoLinks({
                    slug: this.anime_slug,
                    episode: parseInt(episode_number) + 1,
                }).then(result => {
                    let links = JSON.stringify(result);
                    let router_link = `/anime/${anime_id}/watch/${episode_number}/${btoa(links)}`;
                    this.$router.replace({ path: router_link });
                }).catch(err => {
                    this.$router.go(-1);
                });
            } else {
                if (this.animeDetails.info.status > 0) { // if anime is still ongoing
                    this.updateAnime(episode_number, true); // set expecting_next to true
                }
            }
        },
        updateAnime(episode_number, expecting_next) {
            this.UPDATE_DETAILED_ANIME({
                anime_id: this.anime_id,
                new_data: { ...this.animeDetails, ['watching']: episode_number, ['expecting_next']: !!expecting_next },
            });
        },
        playEpisode(time) {
            return `
                    console.log('executing sum js');
                    var page_video = document.querySelector("video");
                    var video = document.createElement('video');
                    video.setAttribute('src', page_video.src);
                    video.setAttribute('autoplay', true);
                    video.setAttribute('controls', true);
                    video.setAttribute('preload', 'auto');
                    video.setAttribute('id', 'the-real-video');
                    let starting_point = ${time};
                    document.body.append(video);
                    console.log(true);
                    var timeout = setInterval(() => {
                        if(starting_point > video.currentTime){
                            video.currentTime = starting_point;
                        }
                        if(video.duration === video.currentTime) {
                            clearInterval(timeout);
                            timeout = 0;
                        };
                        console.log([video.currentTime, video.duration])
                    }, 3000);
                    video.play().then(video.currentTime === ${time});
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
.player {
    width: 100%;
    height: 100%;
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

.auto-next {
    &:after {
        content: "NEXT";
        position: absolute;
        top: 5px;
        right: 5px;
        bottom: 5px;
        left: 5px;
        border-radius: 0%;
        background: white;
        color: #ed4c7d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 700;
    }
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0%;
        background: conic-gradient(#8600c4, #ff007e calc(var(--progress) * 1%), rgba(0, 0, 0, 0.1) 0);
        -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 40px), red calc(100% - 40px + 1px));
        transition: background 1s;
    }
    position: fixed;
    bottom: 50px;
    right: 20px;
    width: 80px;
    height: 40px;
    text-align: center;
}

progress {
    -webkit-appearance: none;
    appearance: none;
}

::-webkit-progress-bar,
 ::-webkit-progress-value {
    display: none;
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
    svg {
        stroke: white;
        animation: spin 1s linear infinite;
    }
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