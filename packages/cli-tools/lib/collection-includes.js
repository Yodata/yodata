const { deepEqual } = require('fast-equals')

/**
 * Returns true if item is found in collection
 *
 * @param {object[]} collection - array to search
 * @param {object} item - item to find
 * @returns {*} results
 */
function collectionIncludes (collection, item) {
  const result = collection.find(v => deepEqual(v, item))
  return typeof result !== 'undefined'
}

module.exports = collectionIncludes
