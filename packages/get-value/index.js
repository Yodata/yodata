const get = require('get-value')

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

/**
 * Returns object value
 *
 * @param {string|array} key - keyname or [keyname, defaultValue]
 * @param {object} object - object (datasource)
 * @returns {any} value of object[key]
 */
module.exports = function (key, object) {
  if (arguments.length === 1) {
    return object => getObjectValue(key, object)
  } else {
    return getObjectValue(key, object)
  }
}
