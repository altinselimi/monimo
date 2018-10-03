<template>
	<webview :src="source" :style="isUnwanted ? 'width: 0; height: 0;' : 'width: 100%; height: 100%;'" :id="elementId"></webview>
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

    video::-webkit-media-controls-play-button {
    	color: red;
    	transform: scale(1.2);
    }

    video::-webkit-media-controls-fullscreen-button, video::-webkit-media-controls-volume-slider,
    video::-webkit-media-controls-fullscreen-button {
    	display: none;
    }

    video::-webkit-media-controls-panel {
	    background-color: rgba(255,255,255,.8);
	    backdrop-filter: blur(15px);
	}

	video::-webkit-media-controls-timeline {
	    background-color: grey;
	}
`;

export default {
	props: ['source', 'preferredQuality', 'episodeCurrentTime', 'loadedIndex', 'loadingPlayer', 'index'],
	mounted() {
		console.log('Mounted!');
		this.webview = document.querySelector('webview');
		this.addWebViewHooks();
	},
	data: () => ({
		webview: null,
		js_loaded: false,
	}),
	name: 'videoInstance',
	computed: {
		elementId() {
			return `video-${this.index}`;
		},
		isUnwanted() {
			return this.loadedIndex && this.loadedIndex !== this.index;
		},
	},
	methods: {
		addWebViewHooks() {
			const debug = process.env.NODE_ENV !== 'production';
			this.webview.addEventListener('dom-ready', () => {
				//this.webview.openDevTools();
			});
			const webviewLoaded = (e) => {
				/*                if(!this.webview.webContents) {
				                    this.webview.removeEventListener('did-finish-load', webviewLoaded);
				                    return;
				                }*/
				if (this.js_loaded) return;
				//this.webview.webContents && this.webview.openDevTools();
				console.log(`Candidate did finish load`);
				this.webview.insertCSS(video_player_style);
				this.webview.executeJavaScript(this.playEpisode(this.episodeCurrentTime || null));
				this.js_loaded = true;
				this.webview.removeEventListener('did-finish-load', webviewLoaded);
			};

			const webviewStartedLoading = e => {
				this.webview.executeJavaScript(`
                    document.querySelectorAll('script').forEach(el => { 
                        let src = el.getAttribute('src');
                        let is_popads = src && src.includes('popads');
                        //if(is_popads) el.remove();
                    });
                    window.console.clear = () => {console.log('tried clearing')};`);
				this.webview.removeEventListener('did-start-loading', webviewStartedLoading);
			};

			const consoleHandlers = event => {
				let { message } = event;
				if (message === 'failed') {
					this.webview.removeEventListener('console-message', consoleHandlers);
					this.$destroy();
					//document.querySelector(candidate).remove();
				}
				if (message === 'started_playing') {
					if (this.loadedIndex !== null) {
						this.$destroy();
						return;
					}
					this.$emit('update:loadingPlayer', false);
					this.$emit('update:loadedIndex', this.index);
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


			this.webview.addEventListener('did-start-loading', webviewStartedLoading);
			this.webview.addEventListener('did-finish-load', webviewLoaded);
			this.webview.addEventListener('console-message', consoleHandlers);
		},
		playEpisode(time) {
			return `
                    console.log('executing js', ${time});
                    var page_video = document.querySelector("video");
                    var real_video = document.querySelector("#the-real-video");
                    if(!page_video) console.log('failed');
                    if(!!page_video) {
                        var video = document.createElement('video');
                        video.setAttribute('src', page_video.src);
                        video.setAttribute('autoplay', true);
                        video.setAttribute('controls', false);
                        video.setAttribute('preload', 'auto');
                        video.setAttribute('id', 'the-real-video');
                        video.setAttribute('controlsList', 'nofullscreen nodownload');
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
	},
	watch: {
		loadedIndex(val) {
			console.log('loaded index updated:', val);
			console.log('my index:', this.index);
			if (val && val !== this.index) {
				console.log('Destroying this');
				this.webview.executeJavaScript('document.querySelector("video").remove()');
				//this.$destroy();
			}
		}
	},
}
</script>