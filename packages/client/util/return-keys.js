const pick = require('lodash/pick')

module.exports = generateReturnKeysFn

/**
 * Returns a function which receives an object and
 * returns an object of keys found on object
 *
 * @param {string[]} keys - the key to be returned
 * @returns {function} function handler
 */
function generateReturnKeysFn(keys) {
	return async value => {
		return pick(value, keys)
	}
}
