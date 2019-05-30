const config = require('@yodata/config')

module.exports = resetInbox

/**
 * Reset the inbox of the active profile.
 * @params {object} props
 * @params {boolean} props.cache - reset cached data
 * @params {boolean} props.cache - reset cached data
 * @returns {object} the state of the inbox after reset
 */
function resetInbox() {
	config.profile.delete('inbox')
	console.log('inbox cleaned')
	config.profile.delete('cache')
	console.log('cache cleared')
	return config.profileGet('inbox')
}
