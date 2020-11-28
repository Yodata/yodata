/** @format */

const { Command } = require('@yodata/cli-tools')

/**
 * @typedef SubscriptionItem
 * @property {string} object - subscription path
 * @property {string} [agent] - pod subscriber
 * @property {string} [target] - push subscriber
 * @property {string[]} subscribes
 * @property {string[]} publishes
 *
 */

class SubscriptionCommand extends Command {
  async run () {
    this.error('child of SubscriptionCommand must implement async run()')
  }

  /**
   *
   *
   * @returns {Promise<SubscriptionItem[]>}
   * @memberof SubscriptionCommand
   */
  async getSubscriptions () {
    return this.client.data('/settings/subscriptions', 'data.items', [])
  }

  async addSubscription (item) {
    return this.getSubscriptions()
      .then(subs => addSubscription(subs, item))
      .then(items => this.update(items))
      .catch(this.handleError)
  }

  async update (items) {
    return this.client
      .set('/settings/subscriptions', 'items', items)
      .then(() => items)
      .catch(this.handleError)
  }

  async removeSubscription (index) {
    const update = this.update.bind(this)
    return this.getSubscriptions()
      .then(items => {
        items.splice(index, 1)
        return items
      })
      .then(update)
  }

  // {
  //   v2 subscription format
  //   "type": "Subscription" ,
  //   "version": "3",
  //   "agent": "https://ace-staging.bhhs.hsfaffiliates.com/profile/card#me",
  //   "instrument": "https://forevercloudstore.bhhs.dev.yodata.io",
  //   "host": "https://staging.bhhs.hsfaffiliates.com",
  //   "subscribes": [
  //       "realestate/contact",
  //       "realestate/lead",
  //       "realestate/website",
  //       "realestate/marketingprogram"
  //   ],
  //   "publishes": [
  //       "realestate/contact",
  //       "realestate/lead"
  //   ]
  // }

  formatSubscriptionList (subs) {
    const BASE_TOPIC = '/settings/subscriptions'
    if (Array.isArray(subs)) {
      return subs.map((sub, index) => {
        const { agent, object, subscribes, publishes } = sub
        let SUBSCRIBES = Array.isArray(subscribes) ? subscribes : [object]
        let PUBLISHES = Array.isArray(publishes) ? publishes : []
        SUBSCRIBES = SUBSCRIBES.map(topic => {
          return String(topic).replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
        }).sort()
        PUBLISHES = PUBLISHES.map(topic => {
          return String(topic).replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
        }).sort()

        const AGENT = String(agent)
          .replace('https://', '')
          .replace('.hsfaffiliates.com/profile/card#me', '')
        return { '#': index, AGENT, SUBSCRIBES, PUBLISHES }
      })
    }
  }
}

module.exports = SubscriptionCommand

function addSubscription (subs = [], update = {}) {
  const next = removeSubscription(subs, update)
  next.push(update)
  return next
}

function removeSubscription (subs = [], object = {}) {
  return subs.reduce((result, item) => {
    if (!(item.agent === object.agent && item.target === object.target)) result.push(item)
    return result
  }, [])
}
