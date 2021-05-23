const { isDeepStrictEqual } = require('util')
module.exports = function arrayContainsObject (object, array) {
  let result = false
  if (Array.isArray(array)) {
    const matcher = v => isDeepStrictEqual(object, v)
    result = array.some(matcher)
  }
  return result
}
