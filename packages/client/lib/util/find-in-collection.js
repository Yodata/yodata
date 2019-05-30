const { filter, matches, curry } = require('lodash')

module.exports = curry(findInCollection)

/**
 * Filter items that match value in collection
 *
 * @param {object} value
 * @param {object[]} collection
 * @returns {object[]}
 */
function findInCollection(value, collection) {
	return filter(collection, matches(value))
}
