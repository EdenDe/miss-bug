export default {
	props: [],
	template: `
    <section class="bug-sort">
      <select v-model="sortBy" @change="onSort">
        <option value="-1">Newest</option>
        <option value="1">Latest</option>
      </select>
    </section>
  `,

	data() {
		return {
			sortBy: -1,
		}
	},
	methods: {
		onSort() {
			this.$emit('sortList', +this.sortBy)
		},
	},
}
