<template>
	<header>
		<nav>
			<div style="cursor: pointer;" @click="$router.go(-1)" v-if="!ifHome"><v-icon>arrow_back_ios</v-icon></div>
			<div class="logo-wrap">
				<a tabindex="0" @click="$router.push('/home')" class="logo">
					<span>MONIMO</span>
					<span class="sublogo">your anime best fren</span>
				</a>
			</div>
			<div class="search">
				<a tabindex="0" @click="showSearch()" :style="`opacity: ${!show_search ? 1 : 0}`">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</a>
				<form v-show="show_search" @submit.prevent>
					<input type="text" v-model="search" ref="searchInput" placeholder="Anime name" @blur="hideSearch()" @keydown.enter="searchAnimes()">
					<button type="button" @click="searchAnimes()">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</button>
				</form>
			</div>
		</nav>
	</header>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
let timeouts = 0;
let timeout;
export default {
	props:['ifHome'],
	computed: {
		search: {
			get() {
				return this.$store.state.search_query;
			},
			set(value) {
				this.UPDATE_SEARCH_QUERY(value);
			},
		},
	},
	data: () => ({
		show_search: false,
	}),
	methods: {
		showSearch() {
			if (timeouts) clearTimeout(timeout);
			this.show_search = true;
			setTimeout(() => {
				this.$refs.searchInput.focus();
			});
		},
		showButton(){
			this.goBack = true;
		},
		hideSearch() {
			timeout = setTimeout(() => {
				this.show_search = false
			}, 1000);
			timeouts++;
		},
		surpriseMe() {
			this.$http.get('/surprise-anime').then(res => {
				console.log('Result:', res);
			}).catch(err => {
				throw err;
			});
		},
		...mapActions(['getAnimes']),
		...mapMutations(['UPDATE_SEARCH_QUERY']),
		searchAnimes() {
			this.getAnimes({ order: 'relevance_desc', search: this.search });
			if(this.$router.currentRoute.path !== '/home') {
				this.$router.push('/home');
			}
		},
	},
}
</script>
<style lang="scss">
header {
	backdrop-filter: blur(21px);
	background-color: rgba(black, .75);
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
	.search{
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	form {
		display: flex;
		align-items: stretch;
		position: absolute;
		right:0px;
		button {
			height: 100%;
			background: rgba(black, .8);
			svg {
				stroke: white;
			}
			border: none;
		}
	}
	input {
		background: rgba(black, .8);
		border: none;
		outline: dashed 1px rgba(white, .3);
		outline-offset: 2px;
		font-size: 1rem;
		padding: 5px;
		color: white;
	}
	nav {
		display: flex;
		align-items: center;
		flex: 1;
		>div.logo-wrap {
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
			flex-direction: column;
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