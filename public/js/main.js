import { router } from './router/index.js'
import appHeader from './cmps/AppHeader.js'
import userMsg from './cmps/UserMsg.js'

const options = {
	template: `
	<section class="main-layout">
    <app-header />
		<main class="router-view full"> 
    	<router-view />
		</main>
	</section>
	<user-msg />
    `,
	router,
	components: {
		appHeader,
		userMsg,
	},
}

const app = Vue.createApp(options)
app.use(router)
app.mount('#app')
