<template>
  <div id="app" tabindex="0">
    <router-view></router-view>
  </div>
</template>
<script>
import { router } from './routes';
import store from './store';

import VuexRouterSync from 'vuex-router-sync';
VuexRouterSync.sync(store, router);

export default {
  name: 'monimo',
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
  outline-offset: 2px;
  //display: inline-block;
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
  background-color:#353535;
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0,0,0,0);
    -webkit-border-radius: 100px;
}

::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.09);
}

::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.5);
    -webkit-border-radius: 100px;
}
::-webkit-scrollbar-thumb:active {
    background: rgba(0,0,0,0.61); 
    -webkit-border-radius: 100px;
}

/* add vertical min-height & horizontal min-width */
::-webkit-scrollbar-thumb:vertical {
  min-height: 10px;
}
::-webkit-scrollbar-thumb:horizontal {
  min-width: 10px;
}
body>*{
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(0,0,0,0);
    -webkit-border-radius: 100px;
}

::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.09);
}

::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.5);
    -webkit-border-radius: 100px;
}
::-webkit-scrollbar-thumb:active {
    background: rgba(0,0,0,0.61); 
    -webkit-border-radius: 100px;
}

/* add vertical min-height & horizontal min-width */
::-webkit-scrollbar-thumb:vertical {
  min-height: 10px;
}
::-webkit-scrollbar-thumb:horizontal {
  min-width: 10px;
}
}
</style>