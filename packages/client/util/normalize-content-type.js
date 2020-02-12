/**
 * returns a normalized content=type value
 *
 * @param {string} input
 * @returns {string}
 */
module.exports = function normalizeContentType (input) {
  if (typeof input !== 'string') throw new TypeError('expected string input')
  const value = String(input).toLowerCase()
  if (value.includes('yaml')) return 'application/x-yaml'
  if (value.includes('yml')) return 'application/x-yaml'
  if (value.includes('json')) return 'application/json'
  if (value.includes('jpeg')) return 'image/jpeg'
  if (value.includes('jpg')) return 'image/jpeg'
  return value
}
