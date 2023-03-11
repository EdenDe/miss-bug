'use strict'
import { bugService } from '../services/bug.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'
import BugSort from '../cmps/BugSort.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
	template: `
    <section class="main-layout bug-index">
        <div class="subheader flex justify-between align-center">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> 
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
				<bug-sort @sortList="sortList"/>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
				<div class="flex page-btns">
					<button class="btn" @click="getPage(-1)">Prev</button>
					<button class="btn" @click="getPage(1)">Next</button>
				</div>
    </section>
    `,
	data() {
		return {
			bugs: null,
			filterBy: { page: 0 },
			sortBy: -1,
		}
	},
	created() {
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy, this.sortBy).then(bugs => {
				this.bugs = bugs
			})
		},
		setFilterBy(filterBy) {
			this.filterBy = filterBy
			this.loadBugs()
		},
		removeBug(bugId) {
			bugService.remove(bugId).then(() => this.loadBugs())
		},
		getPage(diff) {
			this.filterBy.page += diff
			if (this.filterBy.page < 0) this.filterBy.page = 0
			this.loadBugs()
		},
		sortList(sortBy) {
			this.sortBy = sortBy
			this.loadBugs()
		},
	},
	components: {
		bugList,
		BugSort,
		bugFilter,
	},
}
