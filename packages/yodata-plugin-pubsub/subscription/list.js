'use strict'

const request = require('../../client/lib/request')
const select = require('../../client/lib/util/select')

module.exports = listSubscriptions

/**
 * @typedef Subscription
 * @property {string} object - pod/path of scription
 * @property {string} [agent] - profile uri of the subscriber
 * @property {string} [target] - subscription delivery target
 *
 * Returns any current /settings/subscriptions
 *
 * @returns {Promise<Subscription[]>} - List subscriptions for the current pod.
 */
async function listSubscriptions() {
	return request
		.data('/settings/subscriptions', 'data.items', [])
		.then(select(['agent', 'object', 'target']))
		.catch(() => {
			return []
		})
}
