const includes = require('./collection-includes')

module.exports = addToSet

/**
 * Uniquely adds item to collection (array)
 * uses isEqual on objects
 *
 * @param {object[]} collection
 * @param {object} item
 * @returns {object[]}
 */
function addToSet(collection = [], item) {
	if (includes(collection, item)) {
		return collection
	}

	collection.push(item)
	return collection
}
