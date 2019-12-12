const { Command, addToCollection } = require('@yodata/cli-tools')

/**
 * @typedef SubscriptionItem
 * @property {string} object - subscription path
 * @property {string} [agent] - pod subscriber
 * @property {string} [target] - push subscriber
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
      .then(subs => addToCollection(subs, item))
      .then(items => this.update(items))
      .catch(this.handleError)
  }

  async update (items) {
    return this.client.set('/settings/subscriptions', 'items', items)
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

  formatSubscriptionList (subs) {
    const BASE_TOPIC = '/settings/subscriptions'
    if (Array.isArray(subs)) {
      return subs.map((sub, index) => {
        const topic = String(sub.object).replace(BASE_TOPIC, '')
        const agent = sub.agent || sub.target
        const context = sub.context
        return { '#': index, TOPIC: topic, SUBSCRIBER: agent, CONTEXT: context }
      })
    }
  }
}

module.exports = SubscriptionCommand
