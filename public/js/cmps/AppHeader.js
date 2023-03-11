'use strict'

import { userService } from '../services/user.service.js'
import LoginSignup from './LoginSignup.js'

export default {
	template: `
        <header class="app-header flex justify-between full">
					<nav class="main-menu flex align-center">
						<RouterLink to="/">Miss Bug</RouterLink>  
					</nav>
            <section class="user-preview flex align-center" v-if="loggedinUser">
                <RouterLink :to="'/user/' + loggedinUser._id">
                    {{ loggedinUser.fullname }}
                </RouterLink>
								<button class="btn btn-logout fa logout" @click="onLogout"></button>
            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
            </section>
        </header>
    `,
	data() {
		return {
			loggedinUser: userService.getLoggedInUser(),
		}
	},
	methods: {
		changeLoginStatus() {
			this.loggedinUser = userService.getLoggedInUser()
		},
		onLogout() {
			userService.logout().then(() => {
				this.loggedinUser = null
			})
		},
	},
	components: {
		LoginSignup,
	},
}
