const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
	query,
	getById,
	remove,
	save,
}

const PAGE_SIZE = 3

function query(critiria) {
	const filterBy = {
		title: critiria.title || '',
		severity: critiria.severity || 1,
		labels: critiria.labels || [],
		page: critiria.page || 0,
		user: critiria.user || null,
	}
	const sortBy = critiria.sortBy || -1

	let bugs = gBugs
	if (filterBy.user) {
		bugs = gBugs.filter(bugs => bugs.owner._id === filterBy.user)
	}

	const regex = new RegExp('^' + filterBy.title, 'i')

	bugs = bugs.filter(
		bug =>
			(!filterBy.labels.length || filterBy.labels.some(label => bug.labels.includes(label))) &&
			regex.test(bug.title) &&
			bug.severity >= filterBy.severity
	)

	bugs = bugs.sort((a, b) => (a.createdAt - b.createdAt) * sortBy)

	if (filterBy.page) {
		const startIdx = filterBy.page * PAGE_SIZE
		bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
	}

	return Promise.resolve(bugs)
}

function getById(bugId) {
	const bug = gBugs.find(bug => bug._id === bugId)
	if (!bug) return Promise.reject('Unknonwn bug')
	return Promise.resolve(bug)
}

function remove(bugId, owner) {
	const idx = gBugs.findIndex(bug => bug._id === bugId)
	if (idx === -1) return Promise.reject('Unknonwn bug')

	if (owner._id !== gBugs[idx].owner._id && !owner.isAdmin) return Promise.reject('No permission')

	gBugs.splice(idx, 1)
	return _saveBugsToFile()
}

function save(bug, owner) {
	var savedBug
	if (bug._id) {
		savedBug = gBugs.find(currBug => currBug._id === bug._id)
		if (!savedBug) return Promise.reject('Unknonwn bug')

		if (owner._id !== bug.owner._id && !owner.isAdmin) return Promise.reject('No permission')

		for (let key in bug) {
			savedBug[key] = bug[key]
		}
	} else {
		savedBug = bug
		savedBug._id = _makeId()
		savedBug.createdAt = Date.now()
		savedBug.owner = owner

		gBugs.push(savedBug)
	}
	return _saveBugsToFile().then(() => {
		return savedBug
	})
}

function _makeId(length = 5) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function _saveBugsToFile() {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify(gBugs, null, 2)
		fs.writeFile('data/bug.json', data, err => {
			if (err) return reject(err)
			resolve()
		})
	})
}
