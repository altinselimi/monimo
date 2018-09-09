<template>
    <header>
        <div class="fullscreen">
            <button class="buttons" @click="fullscreen()">
                <svg v-if="window_mode !== 'fullscreen'" class="feather feather-maximize-2 sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <svg v-else class="feather feather-minimize-2 sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
            </button>
            <button @click="close()" v-if="isElectron" class="buttons">
                <svg class="feather feather-x-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1326">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </button>
        </div>
        <nav>
            <div style="cursor: pointer;" @click="$router.go(-1)" v-if="!ifHome">
                <svg class="feather feather-arrow-left sc-iwsKbI cnlcoQ" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="121">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </div>
            <div class="logo-wrap">
                <a tabindex="0" @click="$router.push('/home')" class="logo">
                    <span>MONIMO</span>
                    <span class="sublogo">your anime best fren</span>
                </a>
            </div>
            <div class="search">
                <a tabindex="0" @click="showSearch()" :style="`opacity: ${!show_search ? 1 : 0}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </a>
                <form v-show="show_search" @submit.prevent>
                    <input type="text" v-model="search" ref="searchInput" placeholder="Anime name" @blur="hideSearch()" @keydown.enter="searchAnimes()">
                    <button type="button" @click="searchAnimes()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>
        </nav>
    </header>
</template>
<script>
    import {
        mapActions,
        mapMutations,
        mapState
    } from 'vuex';
    let timeouts = 0;
    let timeout;
    let app;
    export default {
        props: ['ifHome'],
        computed: {
            search: {
                get() {
                    return this.$store.state.search_query;
                },
                set(value) {
                    this.UPDATE_SEARCH_QUERY(value);
                },
            },
            isElectron() {
                return navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
            },
            ...mapState({
                window_mode: state => state.window_mode
            })
        },
        data: () => ({
            show_search: false,
        }),
        beforeMount() {
            if (this.isElectron) {
                import ('electron')
                .then((electro) => {
                    app = electro.remote.getCurrentWindow();
                });
            }
        },
        methods: {
            showSearch() {
                if (timeouts) clearTimeout(timeout);
                this.show_search = true;
                setTimeout(() => {
                    this.$refs.searchInput.focus();
                });
            },
            showButton() {
                this.goBack = true;
            },
            hideSearch() {
                timeout = setTimeout(() => {
                    this.show_search = false
                }, 1000);
                timeouts++;
            },
            surpriseMe() {
                this.$http.get('/surprise-anime').then(res => {
                    console.log('Result:', res);
                }).catch(err => {
                    throw err;
                });
            },
            ...mapActions(['getAnimes']),
            ...mapMutations(['UPDATE_SEARCH_QUERY', 'SET_WINDOW_MODE']),
            searchAnimes() {
                this.getAnimes({
                    order: 'relevance_desc',
                    search: this.search
                });
                if (this.$router.currentRoute.path !== '/home') {
                    this.$router.push('/home');
                }
            },
            fullscreen() {
                if (this.window_mode === 'normal') {
                    document.body.requestFullscreen();
                    this.SET_WINDOW_MODE('fullscreen');
                } else {
                    document.exitFullscreen();
                    this.SET_WINDOW_MODE('normal');
                }
            },
            close() {
                app.close();
            }
        },
    }
</script>
<style lang="scss">
    header {
        backdrop-filter: blur(21px);
        background-color: rgba(black, .75);
        padding: 20px;
        color: white;
        stroke: white;
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        height: 90px;
        width: 100%;
        z-index: 10;
        .search {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        form {
            display: flex;
            align-items: stretch;
            position: absolute;
            right: 0px;
            button {
                height: 100%;
                background: rgba(black, .8);
                svg {
                    stroke: white;
                }
                border: none;
            }
        }
        input {
            background: rgba(black, .8);
            border: none;
            outline: dashed 1px rgba(white, .3);
            outline-offset: 2px;
            font-size: 1rem;
            padding: 5px;
            color: white;
        }
        nav {
            display: flex;
            align-items: center;
            flex: 1;
            >div.logo-wrap {
                flex: 1;
                display: inline-flex;
                justify-content: center;
                flex-shrink: 0;
            }
            .logo {
                text-align: center;
                font-size: 1.5rem;
                font-weight: bold;
                display: flex;
                flex-direction: column;
            }
            .sublogo {
                font-size: 1rem;
                line-height: 1;
                font-weight: 400;
            }
        }
    }

    header+* {
        padding-top: 90px;
    }

    .fullscreen {
        position: absolute;
        width: 100%;
        top: 0px;
        background-color: #333;
        right: 0px;
        margin: 0px;
        padding: 0px;
        display: flex;
        /* align-items: flex-end; */
        justify-content: flex-end;
        opacity: 0;
    }

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

    .fullscreen:hover {
        opacity: 0.8!important;
        transition: 0.3s ease-in-out;
    }
</style>