const createApiKey = require('./create-api-key')
const createProfile = require('./create-profile')

/**
 * @returns {Promise<SignupResponse>} SignupResponse
 *
 * @typedef SignupResponse
 * @property {string} agent agent uri
 * @property {string} key - api access secret
 * @property {object} profile -profile content
 */
module.exports = async props => {
	const {agent, key} = await createApiKey(props)
	const profile = await createProfile(agent, key, props)

	return {
		agent,
		key,
		profile
	}
}
