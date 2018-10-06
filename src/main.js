import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Axios from 'axios';
import './routes';
import store from './store';

Axios.defaults.headers.common.Accept = 'application/json';
//Axios.defaults.headers.common["User-Agent"] = "monimo"; currently returning error
let baseURL = `http://localhost:6069/`;
if (process.env.NODE_ENV !== 'production') {
	//baseURL = 'http://localhost:6069';
}
console.log('Env:', process.env.NODE_ENV);
console.log('BaseUrl:', baseURL);
Axios.defaults.baseURL = baseURL;
Vue.$http = Axios;

function renderVue() {
	Object.defineProperty(Vue.prototype, '$http', {
		get() {
			return Axios;
		},
	});

	Vue.config.productionTip = false

	new Vue({
		render: h => h(App),
	}).$mount('#app')
};

async function bootstrapApp() {
	let result;
	try {
		result = await store.dispatch('getLastReleases');
		store.commit('SET_REGION_BLOCKED', false);
	} catch (err) {
		store.commit('SET_REGION_BLOCKED', true);
	}
	renderVue();
};

bootstrapApp();