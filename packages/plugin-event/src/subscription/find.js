'use strict'

const getSubscriptionList = require('./list')

module.exports = findSubscription

async function findSubscription (term) {
  const subscriptions = await getSubscriptionList()
  return subscriptions.filter(includes(term))
}

function includes (term) {
  return function (value) {
    switch (typeof value) {
      case 'string':
        return value.includes(term)
      case 'object':
        return JSON.stringify(value).includes(term)
      default:
        return false
    }
  }
}
