import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

export default {
	template: `
    <ul class="user-list">
      <li v-for="user in users" :key="user._id" class="flex justify-between">
        <RouterLink :to="'/user/'+user._id">
          {{user.fullname}}
        </RouterLink>
        <button class="btn fa trash-can" @click="onRemove(user._id)"></button>
      </li>
    </ul>
  `,
	data() {
		return {
			users: [],
		}
	},
	methods: {
		onRemove(userId) {
			bugService.query({ user: userId }).then(bugs => {
				if (bugs.length > 0) {
					showErrorMsg('user delete failed')
					return
				}
				userService
					.remove(userId, bugs)
					.then(res => {
						showSuccessMsg('user deleted successfully')
					})
					.catch(err => {
						console.log(err)
						showErrorMsg('user delete failed')
					})
			})
		},
	},
	computed: {},
	created() {
		userService.query().then(res => (this.users = res))
	},
	components: {},
	emits: [],
}
