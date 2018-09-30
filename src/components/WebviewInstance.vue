<template>
	<webview :src="source" style="width:100%;height:100%"></webview>
</template>
<script>
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
	props: ['source', 'preferredQuality', 'episodeCurrentTime'],
	mounted() {
		this.addWebViewHooks();
	},
	name: 'videoInstance',
	methods: {
		addWebViewHooks() {
			const debug = process.env.NODE_ENV !== 'production';
			webview = document.querySelector('webview');
			webview.addEventListener('dom-ready', () => {
				webview.openDevTools();
			});
			const webviewLoaded = (e) => {
				/*                if(!webview.webContents) {
				                    webview.removeEventListener('did-finish-load', webviewLoaded);
				                    return;
				                }*/
				webview.webContents && webview.openDevTools();
				console.log(`Candidate did finish load`);
				webview.insertCSS(video_player_style);
				webview.executeJavaScript(this.playEpisode(this.episodeCurrentTime || null));
				webview.removeEventListener('did-finish-load', webviewLoaded);
			};

			const webviewStartedLoading = e => {
				webview.executeJavaScript(`
                    document.querySelectorAll('script').forEach(el => { 
                        let src = el.getAttribute('src');
                        let is_popads = src && src.includes('popads');
                        //if(is_popads) el.remove();
                    });
                    window.console.clear = () => {console.log('tried clearing')};`);
				webview.removeEventListener('did-start-loading', webviewStartedLoading);
			};

			const consoleHandlers = event => {
				let { message } = event;
				if (message === 'failed') {
					webview.removeEventListener('console-message', consoleHandlers);
					this.$destroy();
					//document.querySelector(candidate).remove();
				}
				if (message === 'started_playing') {
					this.$emit('startedPlaying');
					this.loading_player = false;
					this.$emit('updateAnime');
					this.$emit('addToWatching');
					//this.updateAnime(this.episode_number);
					//this.ADD_TO_WATCHING(this.animeDetails);
					return;
				}
				if (message === 'fullscreen' || message === 'normal') {
					this.$emit('windowModeChange', message); //this.SET_WINDOW_MODE(message);
					return;
				}
				let msg = message.split(",");
				let current_time = Number(msg[0]);
				let length = Number(msg[1]);
				if (!this.video_length && !isNaN(length)) {
					this.video_length = length;
				}
				if (!isNaN(current_time)) this.$emit('setCurrentTime', current_time); //the actual time that is emmited using console-message
			};


			webview.addEventListener('did-start-loading', webviewStartedLoading);
			webview.addEventListener('did-finish-load', webviewLoaded);
			webview.addEventListener('console-message', consoleHandlers);
		},
		playEpisode(time) {
			return `
                    console.log('executing js');
                    var page_video = document.querySelector("video");
                    if(!page_video) console.log('failed');
                    if(!!page_video) {
                        var video = document.createElement('video');
                        console.log('Page video:', page_video);
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
                    }
                `;
		}
	}
}
</script>