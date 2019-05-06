'use strict'
const find = require('../util/find-fp')
const kindOf = require('kind-of')
const getSubscriptions = require('./get')
const update = require('./update')
const pick = require('lodash/pick')
const set = require('lodash/set')

module.exports = addSubscription

/**
 *
 *
 * @param {Subscription} props
 * @returns {Promise}
 *
 * @typedef Subscription
 * @property {string} agent - subscriber profile URI
 * @property {string} object - subscription path
 * @property {string} [target] - URI where the notification should be sent
 * @property {object} [scope] - additional scope information
 * @property {string} [topic] - topic level subscription
 * @property {string} [context] - subscription context
 * @property {object} config - deprecated
 * @property {boolean} isExclusive - deprecated
 * @property {boolean} needsContext - deprecated
 */
async function addSubscription(props) {
	const currentSubscriptions = await getSubscriptions()
	const subscription = normalizeSubscription(props)
	const preExistingSubscription = exists(currentSubscriptions, subscription)
	if (preExistingSubscription) {
		const isMatch = matches(subscription)
		currentSubscriptions.items = currentSubscriptions.items.map(item => {
			return isMatch(item) ? subscription : item
		})
	} else {
		currentSubscriptions.items.push(subscription)
	}
	return update(currentSubscriptions)
}

function normalizeSubscription(props) {
	const subscription = pick(props, ['agent', 'object', 'target', 'scope', 'config', 'isExclusive', 'needsContext'])
	const { topic, context } = props
	if (topic) {
		subscription.object = '/inbox/'
	}
	if (context) {
		set(subscription, ['scope', topic, 'context'], context)
	}
	return subscription
}

function exists(currentSubscriptions, subscription) {
	const { agent, object, target } = subscription
	return find({ agent, object, target })(currentSubscriptions['items'])
}

function matches(subscription) {
	const { agent, object, target } = subscription
	return function (item) {
		console.log('test.match', { subscription, item })
		return (kindOf(item) === 'object' && item.agent === agent && item.object === object && item.target === target)
	}
}
