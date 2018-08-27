import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import './registerServiceWorker'
import Axios from 'axios';
import './routes';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

Axios.defaults.headers.common.Accept = 'application/json';

Vue.$http = Axios;

Object.defineProperty(Vue.prototype, '$http', {
	get() {
		return Axios;
	},
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
