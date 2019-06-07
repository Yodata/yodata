'use strict'

const request = require('../../client/lib/request')
const addToCollection = require('../../client/lib/util/add-to-collection')
const { normalizeSubscription } = require('./normalize-subscription')

module.exports = addSubscription

/**
 *
 *
 * @param {Subscription} props
 * @returns {Promise}
 *
 * @typedef Subscription
 * @property {string} object - subscription path
 * @property {string} [agent] - subscriber profile URI
 * @property {string} [target] - URI where the notification should be sent
 */
async function addSubscription(props) {
	const target = '/settings/subscriptions'
	const subscription = normalizeSubscription(props)
	const data = await request.data(target) || { items: [] }
	data.items = addToCollection(data.items, subscription)
	await request.putData(target, data)
	return data.items
}
