<template>
    <div class="player">
        <headerr v-show="show_header" />
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
    </div>
</template>
<script>
    import { mapMutations } from 'vuex';
    let global_timeout = null;
    const video_player_style = `
    body,html {
        background-color:black;
    }
    video {
        height: 100%;
        width: 100%;
        border: none;
    }`;
    const to_be_executed = `
        var video = document.querySelector("video");
        video.setAttribute('autoplay', true);
        video.setAttribute('controls', true);
        [...document.querySelectorAll('body>*')].forEach(element => {
            element.remove();
        });
        document.body.append(video);
        var timeout = setInterval(() => {
            if(video.duration === video.currentTime) {
            clearInterval(timeout);
            timeout = 0;
        };
            console.log([video.currentTime, video.duration])
        }, 3000);
        video.play();`;
    export default {
        created() {
            let link = this.$route.params.src;
            this.iframe_src = atob(this.$route.params.src);
            if (!this.iframe_src) this.$router.push('/');
        },
        updated() {
            if (!this.isElectron) return;
            let webview = document.querySelector("webview");
            webview.addEventListener('dom-ready', (e) => {
                webview.openDevTools();
                /* webview.sendInputEvent({
                     type: 'mouseDown',
                     x: 5,
                     y: 230,
                     button: 'left',
                     clickCount: 1
                 });
                 webview.sendInputEvent({
                     type: 'mouseUp',
                     x: 5,
                     y: 230,
                     button: 'left',
                     clickCount: 1
                 });*/
                webview.insertCSS(video_player_style);
                webview.executeJavaScript(to_be_executed);
            });
            webview.addEventListener('console-message', (e) => {
                let message = e.message.split(",");
                if (!this.video_length && !isNaN(Number(message[1]))) {
                    // console.log(Number(message[1]));
                    // console.log(typeof Number(message[1]));
                    this.video_length = Number(message[1]);
                }
                if (!isNaN(Number(message[0]))) this.AnimeCurrentTime((Number(message[0]))); //the actual time that is premmited using console-message
            })
        },
        computed: {
            isElectron() {
                return navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
            },
            isEqual() {
                if (this.current_time === this.video_length);
            },
        },
        methods: {
            ...mapMutations(['SET_CURRENT_TIME','SET_NEW_PROPERTY']),
            showHeader() {
                this.show_header = true;
                clearTimeout(global_timeout);
                global_timeout = setTimeout(() => {
                    this.show_header = false;
                }, 3000);
            },
            AnimeCurrentTime(time) {
                this.SET_CURRENT_TIME({
                    anime: this.$route.params.id,
                    episode: this.$route.params.episode,
                    time: time
                });

                if(time === this.video_length) this.episodeFinished();
            },
            episodeFinished(){
                this.AnimeCurrentTime(null);
                this.SET_NEW_PROPERTY({
                    anime: this.$route.params.id,
                    episode: this.$route.params.episode - 1 + '',
                    finished : true});
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
            video_length: null
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