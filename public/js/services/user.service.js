const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	getLoggedInUser,
	login,
	logout,
	signup,
	get,
	query,
	remove,
}

function getLoggedInUser() {
	const str = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
	return JSON.parse(str)
}

function login(credentials) {
	return axios
		.post('/api/auth/login', credentials)
		.then(res => res.data)
		.then(user => {
			sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
			return user
		})
		.catch(console.log)
}

function logout() {
	return axios
		.post('/api/auth/logout')
		.then(() => {
			sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
		})
		.catch(console.log)
}

function signup(credentials) {
	return axios
		.post('/api/auth/signup', credentials)
		.then(res => res.data)
		.then(user => {
			sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
			return user
		})
		.catch(console.log)
}

function get(userId) {
	return axios
		.get(`/api/user/${userId}`)
		.then(res => res.data)
		.catch(console.log)
}

function query() {
	return axios
		.get(`/api/user`)
		.then(res => res.data)
		.catch(console.log)
}

function remove(userId) {
	return axios
		.delete(`/api/user/${userId}`)
		.then(res => res.data)
		.catch(console.log)
}
