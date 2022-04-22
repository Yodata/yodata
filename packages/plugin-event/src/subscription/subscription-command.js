/** @format */
const { URL } = require('url')
const { Command, flags } = require('@yodata/cli-tools')
const SETTINGS_SUBSCRIPTIONS = '/settings/subscriptions'
const TOPICS = [
  'award',
  'calendar',
  'contact',
  'franchise',
  'lead',
  'listing',
  'marketingcampaign',
  'marketingpreferences',
  'marketingprogram',
  'profile',
  'servicearea',
  'transaction',
  'website'
]

function parseTopicList (input = '') {
  return input.split(',').map(value => {
    if (TOPICS.includes(value)) {
      return `realestate/${value}`
    } else {
      throw new Error(`UNKNOWN TOPIC:${value}, use --force if you know what you are doing`)
    }
  })
}

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
  async getSubscriptions (target = SETTINGS_SUBSCRIPTIONS) {
    return this.client.data(target, 'data.items', [])
  }

  async addSubscription (item, target = SETTINGS_SUBSCRIPTIONS) {
    return this.getSubscriptions(target)
      .then(subs => addSubscription(subs, item))
      .then(items => this.update(items, target))
      .catch(this.handleError)
  }

  async upsertSubscription (item, target = SETTINGS_SUBSCRIPTIONS) {
    return this.getSubscriptions(target)
      .then(subs => upsertSubscription(subs, item))
      .then(items => this.update(items, target))
      .catch(this.handleError)
  }

  async update (items, target = SETTINGS_SUBSCRIPTIONS) {
    return this.client
      .set(target, 'items', items)
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

  parseTopicList (input = '') {
    return input.split(',').map(value => {
      if (TOPICS.includes(value)) {
        return `realestate/${value}`
      } else {
        throw new Error(`UNKNOWN TOPIC:${value}, use --force if you know what you are doing`)
      }
    })
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
    if (Array.isArray(subs)) {
      return subs.map((sub, index) => {
        const { agent, object, subscribes, publishes, target } = sub
        let SUBSCRIBES = Array.isArray(subscribes) ? subscribes : [object]
        let PUBLISHES = Array.isArray(publishes) ? publishes : []
        SUBSCRIBES = SUBSCRIBES.map(topic => {
          return String(topic).replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
        }).sort()
        PUBLISHES = PUBLISHES.map(topic => {
          return String(topic).replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
        }).sort()

        const AGENT = target ? String(target) : new URL(agent).hostname.split('.').shift()
        // console.log({ AGENT, target, agent })
        return { '#': index, AGENT, SUBSCRIBES, PUBLISHES }
      })
    }
  }
}

module.exports = SubscriptionCommand

/**
 * updates an esiting subscription by adding the sub and pub topics
 * does not create duplicates and keeps the arrays pub/sub arrays sorted
 * @param {object[]} subs - the subscription items list to be up dated
 * @param {*} object
 * @returns
 */
function addSubscription (subs = [], object = {}) {
  const existingSubscriptionFound = subs.findIndex(item => {
    return ((item.agent === object.agent && item.target === object.target))
  })
  if (existingSubscriptionFound !== -1) {
    const current = subs[existingSubscriptionFound]
    const version = current.version ? Number(current.version) + 1 : object.version
    const subscribes = new Set([...object.subscribes, ...current.subscribes])
    const publishes = new Set([...object.publishes, ...current.publishes])
    current.version = String(version)
    current.subscribes = Array.from(subscribes).sort()
    current.publishes = Array.from(publishes).sort()
  } else {
    subs.push(object)
  }
  return subs
}

/**
 * REPLACE an existing subscription without merging subscriptions
 * @param {object[]} subs
 * @param {*} object
 * @returns the array with the updated subscriptions
 */
function upsertSubscription (subs = [], object = {}) {
  const existingSubscriptionFound = subs.findIndex(item => {
    return ((item.agent === object.agent && item.target === object.target))
  })
  if (existingSubscriptionFound) {
    const current = subs[existingSubscriptionFound]
    object.version = (Number(current.version) + 1).toString()
    subs[existingSubscriptionFound] = object
  } else {
    subs.push(object)
  }
  return subs
}

function removeSubscription (subs = [], object = {}) {
  const existingSubscriptionFound = subs.findIndex(item => {
    return ((item.agent === object.agent && item.target === object.target))
  })
  if (existingSubscriptionFound) {
    const current = subs[existingSubscriptionFound]
    object.version = (Number(current.version) + 1).toString()
    subs[existingSubscriptionFound] = object
  } else {
    subs.push(object)
  }
  return subs
}

SubscriptionCommand.flags = Command.mergeFlags({
  agent: flags.string({
    type: 'string',
    description: 'the subscriber, i.e. myapp:',
    required: true,
    parse: value => {
      if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
        return value + ':'
      } else {
        return value
      }
    }
  }),
  host: flags.string({
    type: 'string',
    description: 'the host or subscription file location i.e nv301: or nv301:/settings/default-subscriptions.json',
    parse: value => {
      if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
        return value + ':'
      } else {
        return value
      }
    }
  }),
  sub: flags.string({
    type: 'string',
    name: 'subscribes',
    description: 'the agent will be subscribe to these topics (csv)',
    parse: parseTopicList,
    default: []
  }),
  pub: flags.string({
    type: 'string',
    name: 'pub',
    description: 'the agent will be authorized to publish to these topics (csv)',
    parse: parseTopicList,
    default: []
  }),
  replace: flags.boolean({
    type: 'boolean',
    description: 'replace the current subscription (dont merge topics'
  }),
  push: flags.string({
    type: 'string',
    name: 'path',
    description: 'the push target '
  }),
  output: flags.string({
    default: 'text'
  })
})
