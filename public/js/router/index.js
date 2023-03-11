import bugApp from '../pages/BugIndex.js'
import bugEdit from '../pages/BugEdit.js'
import bugDetails from '../pages/BugDetails.js'
import UserDetails from '../pages/UserDetails.js'
import UserList from '../cmps/UserList.js'

const routes = [
	//=BUGS
	{
		path: '/',
		redirect: '/bug',
	},
	{
		path: '/bug',
		component: bugApp,
	},
	{
		path: '/bug/edit/:bugId?',
		component: bugEdit,
	},
	{
		path: '/bug/:bugId',
		component: bugDetails,
	},
	//USERS
	{
		path: '/user',
		component: UserList,
	},
	{
		path: '/user/:userId',
		component: UserDetails,
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/bug',
	},
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
