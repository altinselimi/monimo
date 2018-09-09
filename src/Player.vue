<template>
    <div class="player">
        <headerr v-show="show_header" />
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
    </div>
</template>
<script>
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
		setInterval(() => {
    		console.log(video.currentTime)
    	},10000);
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
                console.log(e.message);//the actual time that is premmited using console-message
            })
        },
        computed: {
            isElectron() {
                return navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
            },
        },
        methods: {
            showHeader() {
                this.show_header = true;
                clearTimeout(global_timeout);
                global_timeout = setTimeout(() => {
                    this.show_header = false;
                }, 3000);
            },
        },
        components: {
            headerr: () =>
                import ('./components/header.vue'),
        },
        data: () => ({
            iframe_src: null,
            show_header: false,
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