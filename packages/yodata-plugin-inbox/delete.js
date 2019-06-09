'use strict'
const assert = require('assert-plus')
const getInboxItems = require('./list')

module.exports = removeInboxItemByIndex

/**
 *
 *
 * @param {object} props
 * @param {number} props.index
 * @returns {Promise}
 */
async function removeInboxItemByIndex ({ index }) {
  assert.number(index)
  const items = await getInboxItems()
  items.splice(index, 1)
  return items
}
