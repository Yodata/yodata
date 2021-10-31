const getvalue = require('get-value')

/**
 *
 * @param {object} object - The object to search for key
 * @param {string} key - The key to search for
 * @param {function<boolean>|string|number} comparator - value to compare with or function that returns a boolean or string or numeric value
 * @returns
 */
module.exports = function has (object, key, comparator) {
  const value = getvalue(object, key)
  switch (typeof comparator) {
    case 'undefined':
      return typeof value !== 'undefined'
    case 'function':
      return comparator(value)
    default:
      return value === comparator
  }
}
