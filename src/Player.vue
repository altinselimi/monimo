<template>
    <div class="player">
        <headerr v-show="show_header" />
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
    </div>
</template>
<script>
import {
    mapMutations,
    mapState
} from 'vuex';
let global_timeout = null;
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
        //this.$router.push('/');
        let links = JSON.parse(atob(this.links))['subs'];
        console.log('Links in player:', links);
        let video_link;
        let medium_quality = links.find(link => link.quality === 720);
        let low_quality = links.find(link => link.quality === 480);
        let high_quality = links.find(link => link.quality === 1080);
        video_link = low_quality || medium_quality || high_quality;
        let internet_speed = navigator.connection.downlink;
        if(internet_speed > 5 && medium_quality) {
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
        });
        webview.addEventListener('console-message', (event) => {
            console.log(event.message);
            let msg = event.message.split(",");
            if (!this.video_length && !isNaN(Number(msg[1]))) {
                // console.log(Number(message[1]));
                // console.log(typeof Number(message[1]));
                this.video_length = Number(msg[1]);
            }
            if (!isNaN(Number(msg[0]))) this.AnimeCurrentTime((Number(msg[0]))); //the actual time that is premmited using console-message
        });
    },
    computed: {
        ...mapState({
            animes_w_details: state => state.animes_w_details
        }),
        isElectron() {
            return navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
        },
        isEqual() {
            if (this.current_time === this.video_length);
        },
        episodeCurrentTime() {
            return this.animes_w_details[this.episode_id].episodes[this.episode_index - 1].current_time;
        },
    },
    methods: {
        ...mapMutations(['SET_CURRENT_TIME', 'SET_NEW_PROPERTY']),
        showHeader() {
            this.show_header = true;
            clearTimeout(global_timeout);
            global_timeout = setTimeout(() => {
                this.show_header = false;
            }, 3000);
        },
        AnimeCurrentTime(time) {
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
        qite(param) {
            return `
                    console.log('executing sum js');
                    var page_video = document.querySelector("video");
                    var video = document.createElement('video');
                    video.setAttribute('src', page_video.src);
                    video.setAttribute('autoplay', true);
                    video.setAttribute('controls', true);
                    video.setAttribute('id', 'the-real-video');
                    /*[...document.querySelectorAll('body>*')].forEach(element => {
                        element.remove();
                    });*/
                    let starting_point = ${param? param : 'null'}
                    console.log(['qka po di une ', ''+starting_point]);
                    document.body.append(video);
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
                `
        }
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
        js_executed: false,
        internet_speed: null,
    }),
}
</script>
<style lang="scss">
.player {
    width: 100%;
    height: 100%;
}

iframe,
webview {
    padding-top: 0px!important;
    width: 100%;
    height: 100%;
    border: none;
}
</style>