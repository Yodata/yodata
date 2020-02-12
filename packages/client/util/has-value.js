
const getvalue = require('get-value')

/**
 * tests an object property
 *
 * @param {object} object - the item to query
 * @param {string} key - the search key
 * @param {function|*} [comparator] - a value or function called with a vaule and returns a boolean
 * @returns {boolean} returns true when object[key] === comparator
 */
module.exports = function hasValue (object, key, comparator) {
  const value = getvalue(object, key)
  switch (typeof comparator) {
    case 'undefined':
      return typeof value !== 'undefined'
    case 'function':
      return comparator(value)
    default:
      return (value === comparator)
  }
}
