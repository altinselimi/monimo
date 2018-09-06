<template>
    <div class="player">
        <headerr v-show="show_header"/>
        <webview :src="iframe_src" @mousemove="showHeader" v-if="isElectron" disablewebsecurity style="width:100%;height:100%"></webview>
        <iframe sandbox="allow-scripts" @mousemove="showHeader" :src="iframe_src" v-else width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">
        </iframe>
    </div>
</template>
<script>
	let global_timeout = null;
    export default {
        created() {
            let link = this.$route.params.src;
            this.iframe_src = atob(this.$route.params.src);
            if (!this.iframe_src) this.$router.push('/');
        },
        mounted() {
        	if(!this.isElectron) return;
            setTimeout(() => {
                let webview = document.querySelector("webview");
                webview.sendInputEvent({
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
                });
                console.log("working");
            }, 3000)
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