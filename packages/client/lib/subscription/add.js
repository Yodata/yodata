'use strict'
const findFp = require('../util/find-fp')
const kindOf = require('kind-of')
const getSubscriptions = require('./get')
const update = require('./update')
const pick = require('lodash/pick')
const set = require('lodash/set')
const find = require('lodash/find')
const merge = require('lodash/merge')
const assert = require('assert-plus')

module.exports = async props => addSubscription(props).catch(console.error)

/**
 *
 *
 * @param {Subscription} props
 * @returns {Promise}
 *
 * @typedef Subscription
 * @property {string} [agent] - subscriber profile URI
 * @property {string} [object] - subscription path
 * @property {string} [target] - URI where the notification should be sent
 * @property {object} [scope] - additional scope information
 * @property {string} [topic] - topic level subscription
 * @property {string} [context] - subscription context
 * @property {object} [config] - deprecated
 * @property {boolean} [isExclusive] - deprecated
 * @property {boolean} [needsContext] - deprecated
 */
async function addSubscription(props) {
	const subscriptions = await getSubscriptions()
	const subscription = normalizeSubscription(props)
	const found = findSubscription(subscriptions, subscription)
	if (found) {
		if (subscription.scope) {
			if (found['scope']) {
				merge(found['scope'] || {}, subscription.scope)
			} else {
				// @ts-ignore
				found.scope = subscription.scope
			}
		}
	} else {
		subscriptions.items.push(subscription)
	}
	assert.string(subscription.object, 'subscription.object')
	return update(subscriptions)
}

function normalizeSubscription(props) {
	const subscription = pick(props, ['agent', 'object', 'target', 'scope', 'config', 'isExclusive', 'needsContext', 'id'])
	const { topic, context } = props
	if (topic) {
		if (!subscription.object) {
			subscription.object = `/event/topic/${topic}`
		}
	}
	if (context) {
		set(subscription, ['scope', topic, 'context'], context)
	}
	if (kindOf(subscription.target) === 'string') { // if target, agent must be deleted
		delete subscription.agent
	}
	return subscription
}

function findSubscription(subscriptions, subscription) {
	const collection = subscriptions['items']
	const { id, object, agent, target } = subscription
	if (id) {
		return find(collection, { id })
	} else {
		return find(collection, { object, agent, target })
	}
}
