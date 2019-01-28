const createClient = require('./yodata-client')

module.exports = async (profileURI, key, profile) => {
	const client = createClient(key)
	const payload = {
		'#me': {
			id: profileURI,
			name: profile.name,
			email: profile.email,
			inbox: '/inbox/',
			outbox: '/outbox/'
		}
	}
	const body = JSON.stringify(payload)
	return client.put(profileURI, {headers: {'Content-Type': 'application/json'}, body})
		.then(() => {
			return payload
		})
		.catch(error => {
			console.error(error)
			throw error
		})
}
