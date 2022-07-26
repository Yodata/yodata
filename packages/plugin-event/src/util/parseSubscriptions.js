const assert = require('node:assert')
const getValue = require('@yodata/get-value')

/**
 * takes an array of subscription summary strings and returns an array of subscription objects
 *
 * @param {string[]} subs summary strings
 * @return {object[]} subs
 */
function parseSubscriptions (subs) {
  assert(Array.isArray(subs), 'subscriptions must be an array of strings')
  const result = subs.reduce(reducer, [])
  return Object.values(result)
}

function reducer (result, value, index, initialValue) {
  if (!result && index === 0) {
    result = initialValue || {}
    return result
  } else {
    const [vendor, direction, topic, version, instrument, lastModifiedBy, lastModifiedDate] = value.split('|')
    const subscription = getValue(vendor, result) || {
      type: 'Subscription',
      agent: vendor,
      version: String(version),
      subscribes: [],
      publishes: []
    }
    if (String(instrument).length > 0) {
      subscription.instrument = instrument
    }
    if (String(lastModifiedBy).length > 0) {
      subscription.lastModifiedBy = lastModifiedBy
    }
    if (String(lastModifiedDate).length > 0) {
      subscription.lastModifiedDate = lastModifiedDate
    }
    subscription[direction].push(topic)
    result[vendor] = subscription
    return result
  }
}

module.exports = parseSubscriptions
