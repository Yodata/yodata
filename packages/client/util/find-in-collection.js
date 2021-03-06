const filter = require('lodash.filter')
const matches = require('lodash.matches')

module.exports = function find (value, collection) {
  switch (arguments.length) {
    case 1:
      return collection => findInCollection(value, collection)
    case 2:
      return findInCollection(value, collection)
    default:
      throw new Error('findInCollecton params')
  }
}

/**
 * Filter items that match value in collection
 *
 * @param {object} value - object to find
 * @param {object[]} collection - array of objects to search
 * @returns {object[]} matching objects
 */
function findInCollection (value, collection) {
  return filter(collection, matches(value))
}
