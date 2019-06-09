const sortBy = require('lodash/sortBy')

module.exports = sortInboxItems

/**
 *
 * @param {string[]} keys
 * @param {object[]} items
 */
function sortInboxItems (keys = ['timestamp'], items) {
  if (arguments.length === 1) {
    return async items => sortInboxItems(keys, items)
  }

  return sortBy(items, keys)
}
