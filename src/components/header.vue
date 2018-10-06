<template>
    <header>
        <nav>
            <div style="cursor: pointer;" @click="$router.go(-1)" v-if="!isHome">
                <ArrowLeftIcon/>
            </div>
            <div class="logo-wrap">
                <a tabindex="0" @click="$router.push('/home')" class="logo">
                    <span style="font-size:80%; align-self: flex-end;">🦉</span>
                    <span style="position: relative;">MONIMO
                      <span class="version">v0.1.2</span>
                    </span>
                    <!-- <span class="sublogo">your anime best fren</span> -->
                </a>
            </div>
            <div class="search">
                <a tabindex="0" @click="showSearch()" :style="`opacity: ${!show_search ? 1 : 0}`">
                    <SearchIcon/>
                </a>
                <form v-show="show_search" @submit.prevent>
                    <input type="text" v-model="search" ref="searchInput" placeholder="Anime name" @blur="hideSearch()" @keydown.enter="searchAnimes()">
                    <button type="button" @click="searchAnimes()">
                        <SearchIcon/>
                    </button>
                </form>
            </div>
        </nav>
        <progress-bar v-if="downloaded_percentage" :progress="percentage"></progress-bar>
    </header>
</template>
<script>
import {
    mapActions,
    mapMutations,
    mapState
} from 'vuex';
import { SearchIcon,ArrowLeftIcon } from 'vue-feather-icons'
import progressBar from './progress-bar'
let timeouts = 0;
let timeout;
export default {
    props: ['isHome'],
    components:{
        ArrowLeftIcon,
        SearchIcon,
        progressBar
    },
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
        percentage() {
          return -100+this.downloaded_percentage;
        },
        ...mapState({
            window_mode: state => state.window_mode,
            downloaded_percentage: state => state.downloaded_percentage
        })
    },
    data: () => ({
        show_search: false
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
            if (this.search && this.search.length > 2 && this.$router.currentRoute.path !== `/results/${this.search}`) {
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
  // -webkit-app-region: drag;
  backdrop-filter: blur(21px);
  background-color: rgba(black, 0.75);
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
  .version {
    color: red;
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 100%;
  }
  form {
    display: flex;
    align-items: stretch;
    position: absolute;
    right: 0px;
    button {
      height: 100%;
      background: rgba(black, 0.8);
      svg {
        stroke: white;
      }
      border: none;
    }
  }
  input {
    background: rgba(black, 0.8);
    border: none;
    outline: dashed 1px rgba(white, 0.3);
    outline-offset: 2px;
    font-size: 1rem;
    padding: 5px;
    color: white;
  }
  nav {
    display: flex;
    align-items: center;
    flex: 1;
    > div.logo-wrap {
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
header + * {
  padding-top: 90px;
}
</style>