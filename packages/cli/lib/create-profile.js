const createClient = require('./yodata-client')

/**
 * Create a profile
 *
 * @name createProfile
 * @param {string} profileURI - url to write the profile to
 * @param {string} key - api-key to use for writing
 * @param {object} profile - JSON profile data
 * @returns {Promise<object>} - profile content
 */
module.exports = async function (profileURI, key, profile) {
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
