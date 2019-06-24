const includes = require('./collection-includes')

module.exports = addToSet

/**
 * Uniquely adds item to collection (array)
 * uses isEqual on objects
 *
 * @param {object[]} collection - array of objects
 * @param {object} item - object to match
 * @returns {object[]} new collection value
 */
function addToSet (collection = [], item) {
  if (!includes(collection, item)) {
    collection.push(item)
  }
  return collection
}
