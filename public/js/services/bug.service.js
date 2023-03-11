export const bugService = {
	query,
	getById,
	getEmptyBug,
	save,
	remove,
}

function query(filterBy = {}, sortBy) {
	return axios
		.get(`/api/bug`, {
			params: { ...filterBy, sortBy },
		})
		.then(res => res.data)
}

function getById(bugId) {
	return axios
		.get(`/api/bug/${bugId}`)
		.then(res => res.data)
		.catch(err => {
			throw err.response.data
		})
}

function getEmptyBug() {
	return {
		title: '',
		severity: '',
		description: '',
		labels: [],
	}
}

function remove(bugId) {
	return axios.delete(`/api/bug/${bugId}`).then(res => res.data)
}

function save(bug) {
	console.log(bug)
	if (bug._id) {
		return axios.put(`/api/bug/${bug._id}`, bug).then(res => res.data)
	} else {
		return axios.post(`/api/bug`, bug).then(res => res.data)
	}
}
