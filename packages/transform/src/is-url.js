module.exports = isURL

/**
 * true if value is a string that begins with 'http'
 *
 * @param {string} string
 * @returns {boolean}
 */
function isURL(string) {
	return String(string).startsWith('http')
}
