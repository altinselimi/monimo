<template>
    <div class="player">
        <headerr v-show="show_header" />
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
        <div v-if="isEpisodeNear" class="nextup">Next episode in: {{countdown}}</div>
    </div>
</template>
<script>
    import {
        mapMutations,
        mapState
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
        created() {
            let link = this.$route.params.src;
            this.iframe_src = atob(this.$route.params.src);
            if (!this.iframe_src) this.$router.push('/');
            console.log(this.animes_w_details[this.$route.params.id].episodes[this.$route.params.episode - 1].current_time);
        },
        mounted() {
            if (!this.isElectron) return;
            let webview = document.querySelector("webview");
            webview.addEventListener('dom-ready', (e) => {
                // webview.openDevTools();
                if (this.js_executed) return;
                webview.insertCSS(video_player_style);
                webview.executeJavaScript(this.qite(this.animes_w_details[this.$route.params.id].episodes[this.$route.params.episode - 1].current_time));
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
            isEpisodeNear() {              
                return this.video_length && this.current_time+60 >= this.video_length;
            }
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
                this.current_time = time;
                if(this.isEpisodeNear){ this.countDown(); console.log('called mofock')}
                this.SET_CURRENT_TIME({
                    anime: this.$route.params.id,
                    episode: this.$route.params.episode,
                    time: time
                });
                if (time === this.video_length) this.episodeFinished();
            },
            episodeFinished() {
                this.AnimeCurrentTime(null);
                this.SET_NEW_PROPERTY({
                    anime: this.$route.params.id,
                    episode: this.$route.params.episode - 1 + '',
                    finished: true
                });
            },
            countDown(param){
                    timer = setInterval(()=> {
                    if(this.countdown === 0) {
                    clearInterval(timer);
                    return;
                }else{
                    console.log(this.countdown);
                    --this.countdown;
                }}, 1000)
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
            countdown: 60,
            video_length: null,
            js_executed: false,
        }),
        beforeDestroy(){
            clearTimeout(global_timeout);
            clearInterval(timer);
            global_timeout = null;
            timer = null;
        }
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
    .nextup{
        position:absolute;
        bottom:100px;
        right: 20px;
        padding: 2px 5px;
        color:white;
        background-color:#2196f3;
        z-index:30;
    }
</style>