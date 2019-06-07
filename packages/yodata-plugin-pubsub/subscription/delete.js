'use strict'
const assert = require('assert-plus')
const request = require('../../client/lib/request')

module.exports = removeSubscription

/**
 *
 *
 * @param {object} props
 * @param {number} props.index
 * @returns {Promise}
 */
async function removeSubscription({ index }) {
	assert.number(index)
	const target = '/settings/subscriptions'
	const data = await request.data(target) || { items: [] }
	data.items.splice(index, 1)
	await request.putData(target, data)
	return data.items
}
