import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

let routes = [{
	path: '/home',
	component: () => import('./Home.vue'),
}, {
	path: '/anime/:id',
	component: () => import('./Anime-Profile.vue'),
}, {
	path: '/anime/:id/watch/:src',
	component: () => import('./Player.vue'),
}, {
	path: '/*',
	redirect: '/home',
}];

export const router = new VueRouter({
	routes,
});
