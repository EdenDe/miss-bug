'use strict'

import { userService } from '../services/user.service.js'

export default {
	props: ['bug'],
	template: `
	<article class="bug-preview flex flex-column justify-center">
    <span>🐛</span>
    <h4>{{bug.title}}</h4>
    <p>{{bug.description}}</p>
    <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
    <div class="actions">
      <router-link  :to="'/bug/' + bug._id">Details</router-link>
      <router-link v-if="hasPermission" :to="'/bug/edit/' + bug._id"> Edit</router-link>
    </div>
    <button v-if="hasPermission" @click="onRemove(bug._id)" class="btn fa trash-can"></button>
  </article>`,
	methods: {
		onRemove(bugId) {
			this.$emit('removeBug', bugId)
		},
	},
	computed: {
		hasPermission() {
			const user = userService.getLoggedInUser()
			if (!user) return false
			if (!user.isAdmin && user._id !== this.bug.owner._id) return false
			return true
		},
	},
}
