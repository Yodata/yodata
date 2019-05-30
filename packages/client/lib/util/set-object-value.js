'use strict'
const set = require('lodash/set')
const curry = require('lodash/curry')

module.exports = setObjectValue
/**
 * Set value of object[key] = value
 *
 * @param {string} key - property to be updated
 * @param {*} value - value to be applied
 * @param {object} [object] = the object to be udated
 */
function setObjectValue(key, value, object) {
	if (arguments.length === 2) {
		return data => set(data, key, value)
	}

	return set(object, key, value)
}
