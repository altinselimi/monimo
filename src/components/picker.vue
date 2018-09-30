<template>
	<div class="select-btn-wrapper">
		<button @click="$refs.triggerInput.focus()">
			<input ref="triggerInput" type="button" class="input-activator" @blur="closeMenu()" @focus="show_options = true" />
			<slot name="activator">CLICK ME</slot>
		</button>
		<div style="position: relative;" @click.self>
			<ul class="options" :class="{'show-options': show_options, 'drop-left': left}" :style="`min-height: ${(optionsLength * 33) + 10}px`">
				<li v-for="(option, index) in (options || [])" :key="index" :slot-props="{option}" @click="updateSelection(option)" :class="{'active': isActive(option)}">
					<span class="check-icon" v-show="isActive(option)">
						<check-icon></check-icon>
					</span>
					<span>{{option.label ? option.label : option}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { CheckIcon } from 'vue-feather-icons'
export default {
	props: ['options', 'model', 'left'],
	data: () => ({
		show_options: false,
	}),
	components: {
		CheckIcon,
	},
	computed: {
		optionsLength() {
			let options = this.options || [];
			return parseInt(options.length);
		},
		isValidObject() {
			return this.options[0].hasOwnProperty('value');
		},
	},
	methods: {
		updateSelection(option) {
			this.$emit('update:model', this.isValidObject ? option.value : option);
		},
		isActive(option) {
			return this.isValidObject ? this.model === option.value : this.model === option;
		},
		closeMenu() {
			setTimeout(() => {
				this.show_options = false;
			}, 100);
		},
	},
};
</script>
<style lang="scss">
.select-btn-wrapper {
	position: relative;
	ul.options {
		position: absolute;
		list-style: none;
		top: 100%;
		left: 0;
		&.drop-left {
			left: auto;
			right: 0;
		}
		width: 100%;
		height: 100%;
		display: none;
		flex-direction: column;
		border: solid 1px rgba(black, .1);
		background-color: rgba(white, .6);
		backdrop-filter: blur(5px);
		border-radius: 8px;
		padding: 5px;
		margin: 0px;
		max-height: 300px;
		min-width: 150px;
		&.show-options {
			display: flex;
		}
		li {
			padding: 5px;
			position: relative;
			align-items: center;
			padding-left: 15px;
			border-top: solid 1px rgba(black, .1);
			&:first-child {
				border-top-color: transparent;
			}
		}
	}
	.check-icon {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		height: 100%;
		svg {
			width: 13px;
			height: 13px;
			stroke: black;
			stroke-width: 2px;
		}
	}

	>button {
		position: relative;
		border: none;
		background-color: transparent;

		font-size: 1rem; //border-radius: 4px;
		//box-shadow: 0px 0px 5px -1px white;
	}
	>button>input {
		opacity: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
}
</style>