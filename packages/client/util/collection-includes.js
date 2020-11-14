const isEqual = require('lodash.isequal')
const find = require('lodash.find')

module.exports = collectionIncludes

/**
 * Returns true if item is found in collection
 *
 * @param {object[]} collection - array to search
 * @param {object} item - item to find
 * @returns {*} results
 */
function collectionIncludes (collection, item) {
  const result = find(collection, value => isEqual(item, value))
  return typeof result !== 'undefined'
}
