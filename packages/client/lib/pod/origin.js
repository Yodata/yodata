const getPodUrl = require('./url')

module.exports = getPodOrigin

/**
 * Returns the URL>origin of the current pod
 * @returns {string} - origin of the current pod
 */
function getPodOrigin() {
	const url = getPodUrl()
	return url.origin
}
