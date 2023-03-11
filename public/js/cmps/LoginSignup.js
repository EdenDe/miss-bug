import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export default {
	props: [],
	template: `
  <section class="login-signup">
		<main class="modal"> 
			<form  @submit.prevent="onLogin">
					<h2>Login</h2>
					<input type="text" v-model="credentials.username" placeholder="Username" />
					<input type="password" v-model="credentials.password" placeholder="Password" />
					<button class="btn">Login</button>
			</form>
			<hr />
			<form @submit.prevent="onSignup">
					<h2>Signup</h2>
					<input type="text" v-model="signupInfo.fullname" placeholder="Full name"/>
					<input type="text" v-model="signupInfo.username" placeholder="Username" />
					<input type="password" v-model="signupInfo.password" placeholder="Password" />
					<button class="btn">Signup</button>
			</form>
		</main>
		<div class="login-signup screen"></div>
  </section>
  `,
	data() {
		return {
			credentials: {
				username: '',
				password: '',
			},
			signupInfo: {
				fullname: '',
				username: '',
				password: '',
			},
		}
	},
	methods: {
		onLogin() {
			userService
				.login(this.credentials)
				.then(user => {
					this.$emit('onChangeLoginStatus')
				})
				.catch(err => {
					console.log('Cannot signup', err)
					showErrorMsg(`Cannot signup`)
				})
		},
		onSignup() {
			userService
				.signup(this.signupInfo)
				.then(user => {
					this.$emit('onChangeLoginStatus')
				})
				.catch(err => {
					console.log('Cannot signup', err)
					showErrorMsg(`Cannot signup`)
				})
		},
	},
}
