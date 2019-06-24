
/**
 *
 *
 * @param {*} pathstring
 * @returns {string} pathstring with a guaranteed ending slash
 */
module.exports = function pathify (pathstring) {
  return String(pathstring).endsWith('/') ? pathstring : pathstring + '/'
}
