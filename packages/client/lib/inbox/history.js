const config = require('@yodata/config')

exports.list = getInboxHistory
exports.add = addToHistory
exports.last = getLastHistoryValue
exports.update = updateInboxHistory
exports.back = back

/**
 * Gets the inbox history
 * @returns {string[]} history of inbox next tokens
 */
function getInboxHistory() {
	const currentValue = config.profileGet('inbox.history')
	return Array.isArray(currentValue) ? currentValue : []
}

function addToHistory(value) {
	const history = getInboxHistory()
	if (!history.includes(value)) {
		history.push(value)
		config.profileSet('inbox.history', history)
	}

	return history
}

/**
 * Returns token from the last fetched inbox page
 * @returns {string|undefined} last inbox.history value
 */
function getLastHistoryValue() {
	const history = getInboxHistory()
	if (history.length > 0) {
		return history[history.length - 1]
	}

	return ''
}

/**
 * Update inbox history last and next value
 *
 * @param {string} last
 * @param {string} next
 * @param {any} next
 */
function updateInboxHistory(last, next) {
	addToHistory(last)
	config.profileSet('inbox.last', last)
	config.profileSet('inbox.next', next)
}

function back(count = 1) {
	const history = config.profile.get('inbox.history', [])
	history.splice(-count)
	config.profile.set('inbox.history', history)
	config.profile.set('inbox.last', getLastHistoryValue())
	config.profile.set('inbox.next', '')
}
