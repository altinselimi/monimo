<template>
	<div class="select-btn-wrapper">
		<button>
			<input type="button" class="input-activator" @blur="show_options = false" @focus="show_options = true" />
			CLICK ME
		</button>
		<ul class="options">
			<li v-for="(option, index) in (options || [])" :key="index" :slot-props="{option}" @click="$emit('input', option.value ? option.value : option)">{{option}}</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: ['options'],
	data: () => ({
		show_options: false,
	}),
};
</script>
<style lang="scss">
.select-btn-wrapper {
	>ul.options {
		position: absolute;
		bottom: 0;
		left: 0;
	}
	>button {
		position: relative;
		border: none;
		background-color: transparent;
		font-size: 1rem;
	}
	>button>input {
		opacity: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		top:0;
		left:0;
		z-index: 2;
	}
}
</style>