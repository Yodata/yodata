const sortBy = require('lodash/sortBy')

module.exports = sortContainerItems

/**
 *
 * @param {string[]} keys
 * @param {object[]} items
 */
function sortContainerItems (keys = ['timestamp'], items) {
  if (arguments.length === 1) {
    return async items => sortContainerItems(keys, items)
  }

  return sortBy(items, keys)
}
