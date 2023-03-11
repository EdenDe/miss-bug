const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

//=BUGS
app.get('/api/bug', (req, res) => {
	bugService
		.query(req.query)
		.then(bugs => {
			res.send(bugs)
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot load bugs')
		})
})

app.get('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	var visitedBugs = req.cookies.visitedBugIds || []

	if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId))
		return res.status(401).send('Wait for a bit')
	if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

	res.cookie('visitedBugIds', visitedBugs, {
		maxAge: 60 * 60 * 7,
	})

	bugService
		.getById(bugId)
		.then(bug => {
			res.send(bug)
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot load bug')
		})
})

app.put('/api/bug/:bugId', (req, res) => {
	const loggedinUser = userService.validateToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send('Cannot update bug')

	const { _id, title, description, severity, labels, owner } = req.body
	const bug = { _id, title, description, severity, labels, owner }

	bugService
		.save(bug, loggedinUser)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			console.log('Cannot save bug, Error:', err)
			res.status(400).send('Cannot save bug')
		})
})

app.post('/api/bug', (req, res) => {
	const loggedinUser = userService.validateToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send('Cannot add bug')

	const { title, description, severity, labels } = req.body
	const bug = { title, description, severity, labels }

	bugService
		.save(bug, loggedinUser)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			console.log('Cannot save bug, Error:', err)
			res.status(400).send('Cannot save bug')
		})
})

app.delete('/api/bug/:bugId', (req, res) => {
	const loggedinUser = userService.validateToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send('Cannot add bug')

	const { bugId } = req.params
	bugService
		.remove(bugId, loggedinUser)
		.then(() => {
			res.send('OK, deleted')
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot remove bug')
		})
})

//USERS
app.get('/api/user', (req, res) => {
	userService
		.query()
		.then(users => {
			res.send(users)
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot load users')
		})
})

app.get('/api/user/:userId', (req, res) => {
	const { userId } = req.params
	userService
		.getById(userId)
		.then(user => {
			res.send(user)
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot load user')
		})
})

app.post('/api/user', (req, res) => {
	const { username, fullname, password } = req.body
	const user = { username, fullname, password }
	console.log(user)

	userService
		.save(user)
		.then(savedUser => {
			res.send(savedUser)
		})
		.catch(err => {
			console.log('Cannot save user, Error:', err)
			res.status(400).send('Cannot save user')
		})
})

app.put('/api/user/:userId', (req, res) => {
	const { _id, username, fullname, password } = req.body
	const user = { _id, username, fullname, password }

	userService
		.save(user)
		.then(savedUser => {
			res.send(savedUser)
		})
		.catch(err => {
			console.log('Cannot save user, Error:', err)
			res.status(400).send('Cannot save user')
		})
})

app.delete('/api/user/:userId', (req, res) => {
	const { userId } = req.params
	userService
		.remove(userId, loggedinUser)
		.then(() => {
			res.send('OK, deleted')
		})
		.catch(err => {
			console.log('Error:', err)
			res.status(400).send('Cannot remove user')
		})
})

//AUTH
app.post('/api/auth/logout', (req, res) => {
	res.clearCookie('loginToken')
	res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
	const credentials = req.body
	userService.checkLogin(credentials).then(user => {
		if (user) {
			const loginToken = userService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		} else {
			res.status(401).send('Invalid Credentials')
		}
	})
})

app.post('/api/auth/signup', (req, res) => {
	const credentials = req.body
	userService.save(credentials).then(user => {
		if (user) {
			const loginToken = userService.getLoginToken(user)
			res.cookie('loginToken', loginToken)
			res.send(user)
		} else {
			res.status(401).send('Invalid Credentials')
		}
	})
})

app.listen(3030, () => console.log('Server ready at port 3030!'))
