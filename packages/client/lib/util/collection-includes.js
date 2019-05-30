const isEqual = require('lodash/fp/isEqual')
const find = require('lodash/find')

module.exports = collectionIncludes

/**
 *
 *
 * @param {object[]} collection
 * @param {object} item
 */
function collectionIncludes(collection, item) {
	const result = find(collection, isEqual(item))
	return typeof result !== 'undefined'
}
