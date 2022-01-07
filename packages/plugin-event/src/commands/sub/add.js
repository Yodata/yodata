const { Command } = require('../../subscription')
const { prompt, uri, flags } = require('@yodata/cli-tools')

const TOPICS = [
  'profile',
  'lead',
  'website',
  'award',
  'calendar',
  'contact',
  'franchise',
  'listing',
  'marketingprogram',
  'marketingcampaign',
  'marketingpreferences',
  'servicearea',
  'transaction'
]

function normalizeTarget (target) {
  const input = String(target)
  if (input.includes('amazonaws.com')) {
    if (input.startsWith('https://sqs')) {
      return input.replace('https:', 'aws-sqs:')
    }
    if (input.startsWith('https://sns')) {
      return input.replace('https:', 'aws-sns:')
    }
  } else if (input.startsWith('arn:aws:lambda')) {
    const functionName = input.split(':').pop()
    return `aws-lambda://${functionName}`
  } else {
    return input
  }
}

class AddSubscriptionCommand extends Command {
  async run () {
    // pusher subscription (on inbox)
    if (this.prop.push) {
      const subscription = {
        host: `${this.profile.hostname}/profile/card#me`,
        object: '/inbox/',
        target: normalizeTarget(this.prop.push)
      }
      const result = await this.addSubscription(subscription)
      this.print(this.formatSubscriptionList(result))
      return result
    }

    const target = await prompt('subscriber shortname i.e. https://{shortname}.dev.yodata.io/profile/card#me', {
      filter: value => {
        const input = String(value)
        if (!input.includes('://')) {
          const subhost = uri.domainSibling(value, this.profile.hostname)
          return `${subhost}/profile/card#me`
        }
        return normalizeTarget(input)
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
  push: flags.string({
    type: 'string',
    name: 'path',
    description: 'the push target '
  }),
  topic: {
    type: 'string',
    name: 'topic'
  }
})

module.exports = AddSubscriptionCommand
