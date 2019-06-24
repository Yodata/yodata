const { Command, addToCollection } = require('@yodata/cli-tools')
const Conf = require('conf')

/**
 * @typedef SubscriptionItem
 * @property {string} object - subscription path
 * @property {string} [agent] - pod subscriber
 * @property {string} [target] - push subscriber
 *
 */

class SubscriptionCommand extends Command {
  constructor (argv, config) {
    super(argv, config)
    this.store = new Conf()
  }

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
      .catch(error => {
        console.error(error)
      })
  }

  async update (items) {
    return this.client.set('/settings/subscriptions', { items })
  }

  async removeSubscription (index) {
    return this.getSubscriptions()
      .then(items => items.splice(index, 1))
      .then(items => this.update(items))
      .catch(this.handleError)
  }
}

module.exports = SubscriptionCommand
