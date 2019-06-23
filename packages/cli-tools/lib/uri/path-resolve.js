const { URL } = require('url')

module.exports = pathResolve

/**
 * Resolve a path relative to a base url (defaults to the current profile pod url
 *
 * @param {string} pathname - the path or href to resolve
 * @param {string} [base] - base url to resolve
 * @returns {string} resulting href
 */
function pathResolve (pathname, base) {
  return new URL(pathname, base).href
}
