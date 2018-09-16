import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

let routes = [{
	path: '/home',
	component: () =>
		import ('./Home.vue'),
}, {
	path: '/results/:query',
	props: true,
	component: () =>
		import ('./Results.vue'),

}, {
	path: '/anime/:id',
	props: true,
	component: () =>
		import ('./Anime-Profile.vue'),
}, {
	path: '/anime/:episode_id/watch/:episode_index/:links',
	props: true,
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