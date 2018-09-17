<template>
    <div class="player">
        <headerr v-show="show_header"/>
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
        <div v-if="isEpisodeNear" class="nextup">Next episode in: {{countdown}}</div>
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
    }`;
    export default {
        props: ['links', 'episode_index', 'episode_id'],
        created() {
            // this.$router.push('/');
            let links = JSON.parse(atob(this.links));
            this.anime_slug = links['slug'];
            links = links['subs'];
            console.log('Links in player:', links);
            let video_link;
            let medium_quality = links.find(link => link.quality === 720);
            let low_quality = links.find(link => link.quality === 480);
            let high_quality = links.find(link => link.quality === 1080);
            video_link = low_quality || medium_quality || high_quality;
            let internet_speed = navigator.connection.downlink;
            if (internet_speed > 5 && medium_quality) {
                video_link = medium_quality;
            } else if (internet_speed > 8 && high_quality) {
                video_link = high_quality;
            }
            this.internet_speed = internet_speed;
            this.iframe_src = video_link.link;
            if (!this.iframe_src) this.$router.push('/');
        },
        mounted() {
            if (!this.isElectron) return;
            let webview = document.querySelector("webview");
            webview.addEventListener('dom-ready', (e) => {
                // webview.openDevTools();
                if (this.js_executed) return;
                webview.insertCSS(video_player_style);
                webview.executeJavaScript(this.qite(this.episodeCurrentTime || null));
                this.js_executed = true;
                // this.player_ready = false;
            });
            webview.addEventListener('console-message', (event) => {
                console.log(event.message);
                if(event.message === 'true') this.loading_player = false;
                let msg = event.message.split(",");
                console.log(msg);
                console.log(msg[1]);
                if (!this.video_length && !isNaN(Number(msg[1]))) {
                    // console.log(Number(message[1]));
                    // console.log(typeof Number(message[1]));
                    this.video_length = Number(msg[1]);
                }
                if (!isNaN(Number(msg[0]))&&!timer) this.AnimeCurrentTime((Number(msg[0]))); //the actual time that is premmited using console-message
            });
            this.SET_LAST_WATCHED({
                anime: this.episode_id,
                episode: this.episode_index,
                last_watched: true
            })
        },
        computed: {
            ...mapState({
                animes_w_details: state => state.animes_w_details
            }),
            isElectron() {
                return navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
            },
            episodeCurrentTime() {
                return this.animes_w_details && this.animes_w_details[this.episode_id].episodes[this.episode_index - 1].current_time;
            },
            isEpisodeNear() {
                return this.video_length && this.current_time + 60 >= this.video_length;
            }
        },
        methods: {
            ...mapMutations(['SET_CURRENT_TIME', 'SET_NEW_PROPERTY', 'SET_LAST_WATCHED']),
            ...mapActions(['getVideoLinks']),
            showHeader() {
                this.show_header = true;
                clearTimeout(global_timeout);
                global_timeout = setTimeout(() => {
                    this.show_header = false;
                }, 3000);
            },
            AnimeCurrentTime(time) {
                this.current_time = time;
                if (this.isEpisodeNear && !timer) {
                    this.countDown();
                    console.log('called mofock')
                }
                this.SET_CURRENT_TIME({
                    anime: this.episode_id,
                    episode: this.episode_index,
                    time: time
                });
                if (time === this.video_length) this.episodeFinished();
            },
            episodeFinished() {
                this.AnimeCurrentTime(null);
                this.SET_NEW_PROPERTY({
                    anime: this.episode_id,
                    episode: this.episode_index - 1 + '',
                    finished: true
                });
            },
            goToNextEpisode(episode_id, episode_index) {
                this.episodeFinished();
                if (this.animes_w_details[episode_id].episodes[episode_index + 1]) {
                    this.getVideoLinks({
                        slug: this.anime_slug,
                        episode: episode_index + 1
                    }).then(result => {
                        let links = JSON.stringify(result);
                        let router_link = `/anime/${episode_id}/watch/${episode_index}/${btoa(links)}`;
                        this.$router.push({path: router_link});
                        // location.reload();
                        console.log('Pushed to:', router_link);
                    }).catch(err => { throw err });
                }
            },
            countDown(param) {
                timer = setInterval(() => {
                    if (this.countdown === 0) {
                        clearInterval(timer);
                        this.goToNextEpisode(this.episode_id,this.episode_index);
                        return;
                    } else {
                        console.log(this.countdown);
                        --this.countdown;
                    }
                }, 1000)
            },
            qite(param) {
                return `
                    console.log('executing sum js');
                    var page_video = document.querySelector("video");
                    var video = document.createElement('video');
                    video.setAttribute('src', page_video.src);
                    video.setAttribute('autoplay', true);
                    video.setAttribute('controls', true);
                    video.setAttribute('id', 'the-real-video');
                    let starting_point = ${param? param : 'null'}
                    document.body.append(video);
                    console.log(true);
                    ${param? 'video.currentTime === '+param :''}
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
                    video.play().then(video.currentTime === ${param});
                    window.onunload = () => {
                        clearInterval(timeout);
                    }
                `;
            }
        },
        beforeDestroy() {
            clearTimeout(global_timeout);
            clearInterval(timer);
            global_timeout = null;
            timer = null;
        },
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
            countdown: 10,
            js_executed: false,
            internet_speed: null,
            anime_slug: null,
        }),
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
    .loader {
        z-index: 2;
        height: 100%;
        width: 100%;
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        svg {
            stroke:white;
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