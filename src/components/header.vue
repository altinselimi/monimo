<template>
    <header>
        <nav>
            <div style="cursor: pointer;" @click="$router.go(-1)" v-if="!isHome">
                <svg class="feather feather-arrow-left sc-iwsKbI cnlcoQ" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="121">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </div>
            <div class="logo-wrap">
                <a tabindex="0" @click="$router.push('/home')" class="logo">
                    <span style="font-size:80%; align-self: flex-end;">🦉</span>
                    <span>MONIMO</span>
                    <!-- <span class="sublogo">your anime best fren</span> -->
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
export default {
    props: ['isHome'],
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
            return true; //navigator.userAgent.toLowerCase().indexOf('electron/') > -1;
        },
        ...mapState({
            window_mode: state => state.window_mode
        })
    },
    data: () => ({
        show_search: false,
    }),
    methods: {
        showSearch() {
            if (timeouts) clearTimeout(timeout);
            this.show_search = true;
            setTimeout(() => {
                this.$refs.searchInput.focus();
            });
        },
        hideSearch() {
            timeout = setTimeout(() => {
                this.show_search = false
            }, 1000);
            timeouts++;
        },
        ...mapActions(['getAnimes']),
        ...mapMutations(['UPDATE_SEARCH_QUERY', 'SET_WINDOW_MODE']),
        searchAnimes() {
            // this.getAnimes({
            //     order: 'relevance_desc',
            //     search: this.search
            // })
            if (this.search && this.$router.currentRoute.path !== `/results/${this.search}`) {
                this.$router.push({ path: `/results/${this.search}` });
                //console.log(this.$router.currentRoute);
            }
        },
    },
}
</script>
<style lang="scss">
header {
    //-webkit-user-select: none;
    -webkit-app-region: drag;
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
            align-items: center;
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
</style>