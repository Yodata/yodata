'use strict'
const assert = require('assert-plus')
const getInboxItems = require('./list')

module.exports = getInboxItemByIndex

/**
 * Get inbox item by index.
 *
 * @param {number} index
 * @returns {Promise<any>}
 */
async function getInboxItemByIndex(index) {
	assert.number(index)
	const items = await getInboxItems()
	return items[index]
}
