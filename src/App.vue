<template>
  <div id="app" tabindex="0">
    <div class="fullscreen" style="display: none;">
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
      <button @click="close()" class="buttons">
        <svg class="feather feather-x-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1326">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </button>
    </div>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
<script>
import { router } from './routes';
import store from './store';
import { mapMutations, mapState } from 'vuex';

import VuexRouterSync from 'vuex-router-sync';
VuexRouterSync.sync(store, router);

export default {
  name: 'monimo',
  computed: {
    ...mapState({
      window_mode: state => state.window_mode
    }),
  },
  methods: {
    ...mapMutations(['UPDATE_SEARCH_QUERY', 'SET_WINDOW_MODE']),
    getBack() {
      this.$router.go(-1);
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
  opacity: 0;
  //-webkit-user-select: none;
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
    opacity: 0.8!important;
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
</style>