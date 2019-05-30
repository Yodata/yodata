module.exports = isURL

/**
 * Checks if value is a string starting with http
 *
 * @param {string} value - the string to test
 * @returns {boolean} true if string starts with 'http'
 */
function isURL(value) {
	return String(value).startsWith('http')
}
