<template>
  <div id="app" tabindex="0">
    <div class="fullscreen" style="display: none;">
      <button class="buttons" @click="fullscreen()">
        <Maximize2Icon v-if="window_mode !== 'fullscreen'" />
        <Minimize2Icon v-else/>
      </button>
      <button @click="close()" class="buttons">
        <XCircleIcon/>
      </button>
    </div>
    <alert :visibility.sync="notificationVisibility" :persistent="notification.persist">
      {{notification.message}}
      <div slot="buttons" class="buttons">
        <button>Now</button>
        <button @click="notificationVisibility = false">Later</button>
      </div>
    </alert>
    <alert :visibility.sync="showHelpUs" :persistent="false" :duration="20">
      Want to help keep this app alive ?
      <div slot="buttons" class="buttons">
        <button style="width: 80px;">Yeah 😎</button>
        <button @click="showHelpUs = false">Meh 😤</button>
      </div>
    </alert>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
<script>
import { router } from './routes';
import store from './store';
import { mapMutations, mapState } from 'vuex';
import { Maximize2Icon, Minimize2Icon, XCircleIcon } from 'vue-feather-icons'
import Alert from '@/components/alert';

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
  data:() => ({
    showHelpUs: true,
  }),
  mounted() {
    if (this.newVersionAvailable) {
      this.SET_NOTIFICATION({ message: 'New version exists. Want to update ?', type: 'info', persist: true });
    }
  },
  computed: {
    ...mapState({
      window_mode: state => state.window_mode,
      notification: state => state.notification,
    }),
    notificationVisibility: {
      get() {
        return !!this.notification.message;
      },
      set(val) {
        if (!val) this.SET_NOTIFICATION({ message: null, type: null });
      },
    },
    newVersionAvailable() {
      return true; //@Shpetim must use this variable to display a popup
    },
  },
  methods: {
    ...mapMutations(['UPDATE_SEARCH_QUERY', 'SET_WINDOW_MODE', 'SET_NOTIFICATION']),
    getBack() {
      this.$router.go(-1);
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