
const config = require('@yodata/config')
const list = require('./list')

module.exports = getNextInboxPage

/**
 * Fetch the next page of inbox items
 * @returns {Promise<object[]>} - page of inbox items
 */
async function getNextInboxPage() {
	const from = config.profile.get('inbox.next')
	return list({ from })
}
