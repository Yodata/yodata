const { URL } = require('url')
const config = require('@yodata/config')

module.exports = pathResolve

/**
 * Resolve a path relative to a base url (defaults to the current profile pod url
 *
 * @param {string} pathname - the path or href to resolve
 * @param {string} [base] - base url to resolve with @default profile.pod.url
 * @returns {string} resulting href
 */
function pathResolve(pathname, base = config.getProfileValue('pod.url')) {
	return new URL(pathname, base).href
}
