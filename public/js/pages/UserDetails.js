import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import BugList from '../cmps/BugList.js'

export default {
	template: `
   <section class="user-details flex flex-column main-layout" v-if="user">
      <h5 v-if="isMyProfile">{{user.fullname}} Profile</h5>  
			<RouterLink v-if="loggedinUser.isAdmin" class="user-list-link" to="/user">To user list</RouterLink>
  
			<bug-list v-if="bugs" :bugs="bugs"></bug-list>

			<div class="flex page-btns">
					<button class="btn" @click="getPage(-1)">Prev</button>
					<button class="btn" @click="getPage(1)">Next</button>
			</div>

		</section>
  `,

	data() {
		return {
			bugs: null,
			loggedinUser: userService.getLoggedInUser(),
			user: null,
			filterBy: { page: 0 },
			sortBy: -1,
		}
	},
	created() {
		this.loadUser()
	},
	computed: {
		userId() {
			return this.$route.params.userId
		},
		isMyProfile() {
			if (!this.loggedinUser) return false
			return this.loggedinUser._id === this.user._id
		},
	},
	watch: {
		userId() {
			if (this.userId) {
				this.loadUser()
				this.loadBugs()
			}
		},
	},
	methods: {
		loadUser() {
			userService.get(this.userId).then(user => {
				this.user = user
				this.filterBy.user = user._id
				this.loadBugs()
			})
		},
		loadBugs() {
			bugService.query(this.filterBy, this.sortBy).then(bugs => {
				this.bugs = bugs
			})
		},
		getPage(diff) {
			this.filterBy.page += diff
			if (this.filterBy.page < 0) this.filterBy.page = 0
			this.loadBugs()
		},
	},
	components: {
		BugList,
	},
}
