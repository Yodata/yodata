/**
 * @typedef Subscription
 * @property {string<'Subscription'>} type Subscription
 * @property {string<number>} version - numberic version of the subscription
 * @property {string[]} subscribes - array of subscriptions topics
 * @property {string[]} publishes - array of subscriptions topics
 * @property {string<uri>} agent - the receipient for this subscription
 *
 */

/**
 * @function validateSubscription
 * @param {Subscription} subscription
 * @returns {boolean} true if the subscription is valid, false otherwise
 */
function validateSubscription (subscription) {
  try {
    const { target, agent, subscribes, publishes } = subscription
    if (!(typeof agent === 'string' || typeof target === 'string')) {
      throw new Error(`INVALID_AGENT: ${agent}`)
    }
    if (!Array.isArray(publishes) || typeof target === 'string') {
      throw new Error(`INVALID_PUBLISHES_VALUE: ${publishes}`)
    }
    if (!Array.isArray(subscribes) || typeof target === 'string') {
      throw new Error(`INVALID_SUBSCRIBES_VALUE: ${publishes}`)
    }
    return true
  } catch (error) {
    console.error(error.message + '\n' + JSON.stringify(subscription))
    return false
  }
}

module.exports = validateSubscription
