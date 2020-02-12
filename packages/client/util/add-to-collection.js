
module.exports = addToCollection

/**
 * Uniquely adds item to collection (array)
 * uses isEqual on objects
 *
 * @param {object[]} collection - array of objects
 * @param {object} item - object to match
 * @returns {object[]} new collection value
 */
function addToCollection (collection = [], item) {
  const next = new Set(collection)
  if (Array.isArray(item)) {
    item.forEach(item => next.add(item))
  } else {
    next.add(item)
  }
  return Array.from(next)
}
