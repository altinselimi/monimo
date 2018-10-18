<template>
    <div id="app" tabindex="0">
        <div class="fullscreen" style="display: none;">
            <button class="buttons" @click="fullscreen()">
                <Maximize2Icon v-if="window_mode !== 'fullscreen'" />
                <Minimize2Icon v-else />
            </button>
            <button @click="close()" class="buttons">
                <XCircleIcon />
            </button>
        </div>
        <div>
            <alert :visibility.sync="notificationVisibility" :persistent="notification.persist" type="alert">
                {{notification.message}}
                <div slot="buttons" class="buttons">
                    <button style="width: 80px;" @click="updateApp()">Now</button>
                    <button @click="notificationVisibility = false">Later</button>
                </div>
            </alert>
            <alert :visibility.sync="helpUs" :persistent="true">
                Want to help keep Monimo alive?
                <div slot="buttons" class="buttons">
                    <button style="width: 80px;" @click="openHelpLink()">Sure 🙂</button>
                    <button @click="helpUs = false">Nope</button>
                </div>
            </alert>
            <alert :visibility="blocked_region" :persistent="false" :duration="80" type="alert">
                Your region is blocked from the anime servers. Please try a VPN solution and set country as US/Europe until we fix this.
                <div slot="buttons"></div>
            </alert>
        </div>
        <transition name="fade" mode="out-in">
            <router-view :key="$route.fullPath"></router-view>
        </transition>
    </div>
</template>
<script>
import { router } from './routes';
import store from './store';
import { mapMutations, mapState } from 'vuex';
import { Maximize2Icon, Minimize2Icon, XCircleIcon } from 'vue-feather-icons'
import Alert from '@/components/alert';
import { shell, ipcRenderer } from 'electron';
import VuexRouterSync from 'vuex-router-sync';
VuexRouterSync.sync(store, router);
export default {
    name: 'monimo',
    components: {
        Maximize2Icon,
        Minimize2Icon,
        XCircleIcon,
        Alert,
    },
    data: () => ({
        update_available: false,
        update_finished: false
    }),
    mounted() {
        this.SET_NOTIFICATION({ message: null, type: null });
    },
    created() {
        ipcRenderer.on('download-progress', (event, progressObj) => {
            this.SET_DOWNLOADED_PERCENTAGE(progressObj.percent);
        });
    },
    computed: {
        ...mapState({
            window_mode: state => state.window_mode,
            notification: state => state.notification,
            downloaded_percentage: state => state.downloaded_percentage,
            help_us: state => state.help_us,
            blocked_region: state => state.blocked_region,
        }),
        notificationVisibility: {
            get() {
                return !!this.notification.message;
            },
            set(val) {
                if (!val) this.SET_NOTIFICATION({ message: null, type: null })
            },
        },
        newVersionAvailable() {
            return this.downloaded_percentage === 100
        },
        helpUs: {
            get() {
                return this.help_us === null;
            },
            set(value) {
                this.HELP_US(value);
            }
        },
    },
    methods: {
        ...mapMutations(['UPDATE_SEARCH_QUERY', 'SET_WINDOW_MODE', 'SET_NOTIFICATION', 'SET_DOWNLOADED_PERCENTAGE', 'HELP_US']),
        getBack() {
            this.$router.go(-1);
        },
        updateApp() {
            this.SET_DOWNLOADED_PERCENTAGE(0);
            this.notificationVisibility = false;
            ipcRenderer.send('installUpdate');
        },
        openHelpLink() {
            shell.openExternal('http://monimoapp.com/#help-us');
            this.helpUs = true;
        },
    },
    watch: {
        newVersionAvailable(value) {
            if(value) this.SET_NOTIFICATION({ message: 'New version available. Want to update ?', type: 'info', persist: true });
        },
    },
    router,
    store,
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Arvo');

#app {
    font-family: 'Lato', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;

    &::before {
        content: '';
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 25px;
        -webkit-app-region: drag;
    }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .3s
}

.fade-enter, .fade-leave-to {
    opacity: 0
}

a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

a:focus {
    outline: dashed 1px whitesmoke;
    outline-offset: 2px; //display: inline-block;
}

a:focus:hover {
    outline: none;
}

body * {
    box-sizing: border-box;
}

body,
html {
    box-sizing: border-box;
    margin: 0px;
    height: 100%;
    width: 100%;
    font-size: calc(16px + .1vw);
    background-color: #353535;
}



.fullscreen {
    position: fixed;
    width: 100%;
    top: 0px;
    background-color: #333;
    right: 0px;
    margin: 0px;
    padding: 0px;
    display: flex;
    z-index: 20;
    cursor: pointer;
    /* align-items: flex-end; */
    justify-content: flex-end;
    opacity: 0; //-webkit-user-select: none;
    -webkit-app-region: drag;

    .buttons {
        color: white;
        background-color: #333;
        border: none;

        svg {
            width: 20px;
            height: 20px;
        }

        outline:none;
    }

    &:hover {
        opacity: 0.8 !important;
        transition: 0.3s ease-in-out;
    }
}







/* add vertical min-height & horizontal min-width */

::-webkit-scrollbar-thumb:vertical {
    min-height: 10px;
}

::-webkit-scrollbar-thumb:horizontal {
    min-width: 10px;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    -webkit-border-radius: 100px;
}

::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.5);
    -webkit-border-radius: 100px;
}

::-webkit-scrollbar-thumb:active {
    background: rgba(0, 0, 0, 0.61);
    -webkit-border-radius: 100px;
}
:-webkit-full-screen {
  overflow: auto;
}
</style>