/** @format */
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

/**
 * @typedef SubscriptionItem
 * @property {string} type - Subscription
 * @property {string} version = the subscription version 0.1,2,3,...
 * @property {string} [lastModifiedDate] - the date the subscription was last modified
 * @property {string} [lastModifiedBy] - the user who last modified the subscriptiontitle of the subscription
 * @property {string} [instrument] - the service used by the host to create the Subscriptio
 * @property {string} agent - the subscriber - https://app.example.com/profile/card#me
 * @property {string} host - the target host - https://hostname.example.com
 * @property {string[]} subscribes - the agent will receive events on these topics
 * @property {string[]} publishes - the agent is authroized to publish these topics
 * @property {string} [target] - for push subscriptions the push target URL/ARN
 * @property {'/inbox/'} [object] - for push subscriptions /inbox/
 */

const { URL } = require('url')
const { Command, flags, print } = require('@yodata/cli-tools')
const { removeSubscription } = require("./removeSubscription")
const { addSubscription } = require("./addSubscription")
const { replaceSubscription } = require("./replaceSubscription")
const SUBSCRIPTION_PATH = '/settings/subscriptions'
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
    'website',
    'subscription'
]
const TOPIC_SHORT_CODE = {
    award: 'award',
    calendar: 'calendar',
    contact: 'contact',
    franchise: 'franchise',
    lead: 'lead',
    listing: 'listing',
    marketingcampaign: 'campaign',
    marketingpreferences: 'mpref',
    marketingprogram: 'mprog',
    profile: 'profile',
    servicearea: 'servicearea',
    transaction: 'trn',
    website: 'web',
    subscription: 'subscription'
}

const baseFlags = Command.mergeFlags({
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
    type: flags.string({
        type: 'string',
        name: 'type',
        description: 'update only this type of subOrganization',
        parse: value => {
            if (typeof value === 'string' && value.length > 0) {
                return value.split(',')
            }
        },
        default: [ 'RealEstateAgent', 'RealEstateOrganization' ]
    }),
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
        parse: (value, context) => {
            // console.log({ host: value, context })
            if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
                return value + ':'
            } else {
                return value
            }
        }
    }),
    version: flags.integer({
        type: 'integer',
        description: 'the subscription version',
        default: 0
    }),
    output: { ...flags.output, ...{ default: 'table' } },
    force: flags.boolean({
        type: 'boolean',
        description: 'force the subscription non-standard topic',
        default: false
    })
})

function parseTopicList(input = '') {
    return input.split(',').map(value => {
        if (TOPICS.includes(value)) {
            return value === 'subscription' ? 'yodata/subscription' : `realestate/${value}`
        } else {
            throw new Error(`UNKNOWN TOPIC:${value}`)
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
    async run() {
        this.error('child of SubscriptionCommand must implement async run()')
    }

    get target() {
        const url = this.client.resolve(this.prop.host || SUBSCRIPTION_PATH, this.profile.hostname)
        const location = new URL(url)
        if (location.pathname === '/profile/card' || location.pathname === '/') {
            location.pathname = SUBSCRIPTION_PATH
        }
        return location.href
    }

    get host() {
        return new URL(this.target).origin
    }

    get agent() {
        const agent = this.client.resolve(this.prop.agent, this.profile.hostname)
        return new URL('/profile/card#me', agent).href
    }

    /**
     *
     *
     * @returns {Promise<SubscriptionItem[]>}
     * @memberof SubscriptionCommand
     */
    async getSubscriptions(target = this.target) {
        return this.client.data(target, 'data.items', [])
            .catch(this.handleError.bind(this))
    }

    /**
   * merge/adds the topics in the subscription
   * @param {SubscriptionItem} subscription - a subscription to be add/merged
   * @param {string<url>} target - href to the subscription file
   * @returns
   */
    async addSubscription(subscription, target = this.target) {
        return this.getSubscriptions(target)
            .then(subs => addSubscription(subs, subscription))
            .then(items => this.update(items, target))
            .catch(this.handleError.bind(this))
    }

    async replaceSubscription(item, target = this.target) {
        return this.getSubscriptions(target)
            .then(subs => replaceSubscription(subs, item))
            .then(items => this.update(items, target))
            .catch(this.handleError.bind(this))
    }

    async update(items, target = this.target) {
        return this.client
            .set(target, 'items', items)
            .then(() => items)
            .catch(this.handleError.bind(this))
    }

    async removeSubscription(item, target = this.target) {
        return this.getSubscriptions(target)
            .then(subs => removeSubscription(subs, item))
            .then(items => this.update(items, target))
            .catch(this.handleError.bind(this))
    }

    static parseTopicList(input = '') {
        return input.split(',').map(value => {
            if (TOPICS.includes(value)) {
                return value === 'subscription' ? 'yodata/subscription' : `realestate/${value}`
            } else {
                throw new Error(`UNKNOWN TOPIC:${value}, use --force if you know what you are doing`)
            }
        })
    }

    formatSubscriptionList(subs) {
        if (Array.isArray(subs)) {
            return subs.map((sub, index) => {
                const { agent, object, subscribes, publishes, target } = sub
                let SUBSCRIBES = Array.isArray(subscribes) ? subscribes : [ object ]
                let PUBLISHES = Array.isArray(publishes) ? publishes : []
                SUBSCRIBES = SUBSCRIBES.map(topic => {
                    const topicname = String(topic).replace('yodata/', '').replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
                    return TOPIC_SHORT_CODE[ topicname ] || topicname
                }).sort()
                PUBLISHES = PUBLISHES.map(topic => {
                    const topicname = String(topic).replace('yodata/', '').replace('realestate/', '').replace('/event/topic/', '').replace('/', '')
                    return TOPIC_SHORT_CODE[ topicname ] || topicname
                }).sort()

                const AGENT = target ? String(target) : new URL(agent).hostname.split('.').shift()
                return { AGENT, SUBSCRIBES, PUBLISHES }
            })
        }
    }

    static mergeFlags(flags) {
        return { ...baseFlags, ...flags }
    }

    handleError(error) {
        const { message, stack, statusCode, statusMessage, url } = error
        if (statusCode) {
            console.error([ statusCode, statusMessage, url ].join('  '))
        } else {
            console.error(message + '\n' + stack)
        }
        throw error
    }
}

exports.Command = SubscriptionCommand
exports.baseFlags = baseFlags
