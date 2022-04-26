
/**
 * True if value is a valid curie 'prefix:path/to'
 *
 * @param {*} value
 * @returns {boolean}
 */
function isCurie (value) {
  return (
    typeof value === 'string' &&
    !value.includes('://') &&
    value.split(':').length === 2 &&
    value.length > 3
  )
}

module.exports = isCurie
