import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Axios from 'axios';
import './routes';

Axios.defaults.headers.common.Accept = 'application/json';
Axios.defaults.baseURL = `$https://monimo-api.herokuapp.com/`;
Vue.$http = Axios;

Object.defineProperty(Vue.prototype, '$http', {
	get() {
		return Axios;
	},
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
