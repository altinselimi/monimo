<template>
	<ul class="categories-carousel">
		<li v-for="genre in categories" :class="{'selected': genre.selected}">
			<a tabindex="0" @click="$emit('addCategory', genre)">
				{{genre.name}}
			</a>
		</li>
	</ul>
</template>
<script>
export default {
	props: ['categories'],
};
</script>
<style lang="scss">
$blue: #03A9F4;
ul.categories-carousel {
	overflow-x: auto;
	padding: 0px;
	margin: 0px;
	list-style: none;
	flex-wrap: nowrap;
	display: flex;
	align-items: center;
	a {
		text-transform: capitalize;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20px;
	}
	li {
		//backdrop-filter: blur(21px);
		background-color: rgba(black, .85);
		color: white;
		flex: 1;
		flex-basis: 150px;
		flex-shrink: 0;
		text-align: center;
		border-radius: 40px;
		margin: 10px;
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		>a {
			width: 100%;
			height: 100%;
			padding: 10px 5px;
		}
		&.selected::after {
			content: '';
			position: absolute;
			top: calc(50% - 5px);
			left: 15px;
			width: 10px;
			height: 10px;
			border-radius: 100%;
			background-color: $blue;
		}
	}
}
</style>