const createApiKey = require('./create-api-key')
const createProfile = require('./create-profile')
const logger = require('./logger')

module.exports = async props => {
	const {agent, key} = await createApiKey(props)
	const profile = await createProfile(agent, key, props)

	return {
		agent,
		key,
		profile
	}
}
