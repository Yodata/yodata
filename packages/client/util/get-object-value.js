const get = require('./get-value')
const curry = require('just-curry-it')

/**
 * Returns object value
 *
 * @param {string|array} key - keyname or [keyname, defaultValue]
 * @param {object} object - object (datasource)
 * @returns {any} value of object[key]
 */
function getObjectValue (key, object) {
  let k
  let defaultValue

  if (Array.isArray(key)) {
    k = key[0]
    defaultValue = key[1]
  } else {
    k = key
  }

  return get(object, k, defaultValue)
}

module.exports = curry(getObjectValue)
