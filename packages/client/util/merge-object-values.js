'use strict'
const merge = require('lodash/merge')

module.exports = mergeObjectValues
/**
 * Functional object apply deep
 *
 * @param {object} values - new values to be applied
 * @param {object} [object] - object to be updated
 * @returns {object|function} merged result
 */
function mergeObjectValues(values, object) {
	if (arguments.length === 1) {
		return data => merge(data, values)
	}

	return merge(object, values)
}
