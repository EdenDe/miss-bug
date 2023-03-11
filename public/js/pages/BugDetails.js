'use strict'

import { bugService } from '../services/bug.service.js'

export default {
	template: `
    <section class="bug-details flex justify-center flex-column ">
			<template v-if="bug">
					<h1>{{bug.title}}</h1>
					<p>{{bug.description}}</p>
					<span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
			</template>
			<div v-else> {{error}} </div>
      <router-link to="/bug">Back</router-link>
    </section>
    `,
	data() {
		return {
			bug: null,
			error: null,
		}
	},
	created() {
		const { bugId } = this.$route.params
		if (bugId) {
			bugService
				.getById(bugId)
				.then(bug => {
					this.bug = bug
				})
				.catch(err => (this.error = err))
		}
	},
}
