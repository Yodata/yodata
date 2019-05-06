'use strict'
const subscriptions = require('./list')
const find = require('../util/find-fp')

module.exports = findSubscription


/**
 *
 *
 * @param {object} subscription
 * @param {string} subscription.agent
 * @param {string} subscription.object
 * @param {string} [subscription.target]
 *
 * @returns
 */
async function findSubscription(subscription) {
	return subscriptions()
		.then(find(subscription))
}
