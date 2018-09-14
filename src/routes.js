import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

let routes = [{
	path: '/home',
	component: () =>
		import ('./Home.vue'),
}, {
	path: '/results/:search',
	props:true,
	component: () =>
		import ('./Results.vue'),
	
}, {
	path: '/anime/:id',
	component: () =>
		import ('./Anime-Profile.vue'),
}, {
	path: '/anime/:id/watch/:episode/:src',
	component: () =>
		import ('./Player.vue'),
}, {
	path: '/*',
	redirect: '/home',
}];

export const router = new VueRouter({
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
	routes,
});