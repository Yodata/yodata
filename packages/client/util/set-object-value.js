'use strict'
const setValue = require('set-value')

/**
 * Set value of object[key] = value
 *
 * @param {string} key - property to be updated
 * @param {*} value - value to be applied
 * @param {object} [object] = the object to be udated
 * @returns {object} the modified value
 */
function setObjectValue (key, value, object) {
  if (arguments.length === 2) {
    return data => setValue(data, key, value)
  }

  return setValue(object, key, value)
}

module.exports = setObjectValue
