const hasValue = require('@yodata/has-value')
const { validateSubscription } = require('./validateSubscription')

/**
 * @typedef SubscriptionObject
 * @property {"Subscription"} type - const Subscription
 * @property {string<uri>} agent - profileID of the subscriber/producer
 * @property {string[]} subscribes - list of topics the agent will receive events from
 * @property {string[]} publishes - list of topics the agent is allowed to publish
 * @property {string} version - subscription version string
 * @property {string<url>} [host] - orgin of the host/publisher
 * @property {string<url>} [instrument] - url of the pod/service
 * @property {string} [lastModifiedBy] - event agent
 * @property {string} [lastModifiedDate] - event date
 */

/**
 * @typedef PushSubscriptionObject
 * @property {string} host - the host (publisher) pod
 * @property {string<uri>} target URI to receive the data
 * @property {string} object - path to container or resource to watch i.e. /inbox/ or /settings/subscriptions
 */

/**
 * @function isPushSubscription - returns true if the subscription is a push subscription
 * @param {object<any>} subscription
 * @returns {boolean}
 */
function isPushSubscription (subscription) {
  return (
    hasValue(subscription, 'target', value => (typeof value === 'string' && value.length > 0))
    // && hasValue(subscription, 'object', value => (typeof value === 'string' && value.length > 0 && value.startsWith('/')))
  )
}

/**
 * @function isStandardSubscription
 * @param {object<any>} subscription
 * @returns {boolean} true if the subscription is a standard subscription
 */
function isStandardSubscription (subscription) {
  return (
    hasValue(subscription, 'type', 'Subscription') &&
    hasValue(subscription, 'agent', value => (typeof value === 'string' && value.length > 0)) &&
    hasValue(subscription, 'subscribes', value => (Array.isArray(value))) &&
    hasValue(subscription, 'publishes', value => (Array.isArray(value)))
  )
}

/**
 * extractSubscriptionValues - a reducer function for reflex subscriptions
 *
 * @param {string[]} results aggregator value
 * @param {SubscriptionObject|PushSubscriptionObject} subscription  - current subscription valu
 * @param {number} index - current position in the array
 * @param {array} initialValue - the initialValue
//  * @returns {object<k,v>} - @example ['v|ace-fullcopy|lead|publish']: {data}
 */
function extractSubscriptionValues (results, subscription, index, initialValue = []) {
  if (!Array.isArray(results)) {
    results = initialValue
  }
  let {
    agent,
    subscribes = [],
    publishes = [],
    lastModifiedDate = null,
    lastModifiedBy = null,
    object,
    target,
    instrument,
    version,
    vendor
  } = subscription
  if (isPushSubscription(subscription)) {
    vendor = `s|${target}`
    subscribes = [object]
    publishes = []
  } else if (isStandardSubscription(subscription)) {
    vendor = agent
  } else {
    const error = new Error('SUBSCRIPTION_FORMAT_ERROR')
    error.object = subscription
    error.abort = true
    throw error
  }
  subscribes.forEach(topic => {
    const direction = 'subscribes'
    const key = [vendor, direction, topic, version, instrument, lastModifiedBy, lastModifiedDate].join('|')
    results.push(key)
  })
  publishes.forEach(topic => {
    const direction = 'publishes'
    const key = [vendor, direction, topic, version, instrument, lastModifiedBy, lastModifiedDate].join('|')
    results.push(key)
  })
  return results.sort()
}

function getSubscriptions (items = []) {
  return items.reduce(extractSubscriptionValues, [])
}

exports.getSubscriptions = getSubscriptions

exports.isPushSubscription = isPushSubscription
exports.extractSubscriptionValues = extractSubscriptionValues
exports.validateSubscription = validateSubscription
