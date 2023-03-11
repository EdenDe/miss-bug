'use strict'

export default {
	template: `
  <section class="bug-filter">
		<div class="flex justify-center"> 
			<input type="search" v-model="filterBy.title" placeholder="Search">
			<div class="flex flex-column align-center"> 
				<label class=" "> Min Severity:</label>
				<input v-model="filterBy.severity" type="range" min="1" max="3" :title="filterBy.severity">
			</div>
		</div>
		<ul class="clean-list flex"> 
			<li v-for="label in labels">
				<input :id="label+'Check'" type="checkbox" v-model="filterBy.labels" :value="label">
				<label :for="label+'Check'">{{label}}</label>
			</li>
		</ul>
  </section>
    `,
	data() {
		return {
			filterBy: null,
			labels: ['Important', 'Frontend', 'Backend'],
		}
	},
	created() {
		this.filterBy = {
			title: '',
			severity: 1,
			labels: [],
			page: 0,
		}
	},
	watch: {
		filterBy: {
			handler() {
				this.setFilterBy()
			},
			deep: true,
		},
	},
	methods: {
		setFilterBy() {
			this.$emit('setFilterBy', this.filterBy)
		},
	},
}
