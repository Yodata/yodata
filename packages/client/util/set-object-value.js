'use strict'
const set = require('lodash/set')

module.exports = setObjectValue
/**
 * Set value of object[key] = value
 *
 * @param {string} key - property to be updated
 * @param {*} value - value to be applied
 * @param {object} [object] = the object to be udated
 * @returns {object} the modified value
 */
function setObjectValue(key, value, object) {
	if (arguments.length === 2) {
		return data => set(data, key, value)
	}

	return set(object, key, value)
}
