const { Command } = require('../../subscription')
const { prompt, uri } = require('@yodata/cli-tools')

const TOPICS = [
  'profile',
  'lead',
  'website',
  'award',
  'calendar',
  'contact',
  'franchise',
  'listing',
  'marketing',
  'servicearea',
  'transaction'
]

class AddSubscriptionCommand extends Command {
  async run () {
    const target = await prompt('subscriber shortname i.e. https://{shortname}.dev.yodata.io/profile/card#me', {
      filter: value => {
        const input = String(value)
        if (!input.includes('://')) {
          const subhost = uri.domainSibling(value, this.profile.hostname)
          return `${subhost}/profile/card#me`
        }
        return input
      }
    })
    const subscribes = await prompt('select subscription topics', {
      type: 'checkbox',
      choices: TOPICS,
      filter: value => {
        const input = Array.from(value).map(v => `realestate/${v}`)
        return input
      }
    })

    const publishes = await prompt('select publish topics', {
      type: 'checkbox',
      choices: TOPICS,
      filter: value => {
        const input = Array.from(value).map(v => `realestate/${v}`)
        return input
      }
    })
    const { hostname } = this.profile
    const subscription = {
      type: 'Subscription',
      version: '0',
      host: hostname
    }
    if (String(target).endsWith('profile/card#me')) {
      subscription.agent = target
    } else {
      // subscription.target = target
      subscription.agent = target // fix max's bug
    }
    Object.assign(subscription, { subscribes, publishes })
    const result = await this.addSubscription(subscription)
    this.print(this.formatSubscriptionList(result))
    // this.print(subscription)
  }
}

AddSubscriptionCommand.description = 'add a new subscriber'
AddSubscriptionCommand.flags = Command.mergeFlags({
  output: {
    default: 'text'
  },
  agent: {
    type: 'string',
    description: 'the subscriber profile url'
  },
  topic: {
    type: 'string',
    name: 'topic'
  }
})

module.exports = AddSubscriptionCommand
