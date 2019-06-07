const { filter, matches, curry } = require('lodash')

module.exports = curry(findInCollection)

/**
 * Filter items that match value in collection
 *
 * @param {object} value - object to find
 * @param {object[]} collection - array of objects to search
 * @returns {object[]} matching objects
 */
function findInCollection(value, collection) {
	return filter(collection, matches(value))
}
