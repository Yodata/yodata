const { Command } = require('../../subscription')
const { prompt, uri } = require('@yodata/cli-tools')

class AddSubscriptionCommand extends Command {
  async run () {
    const object = await prompt('enter topic or subscription path', {
      filter: value => {
        const input = String(value)
        if (input.startsWith('/')) {
          return input
        }
        return `/event/topic/${input}`
      }
    })
    const target = await prompt('subscriber profileid or target URL', {
      filter: value => {
        const input = String(value)
        if (input.endsWith(':')) {
          const subhost = uri.domainSibling(value.slice(0, -1), this.profile.hostname)
          return `${subhost}/profile/card#me`
        }
        return input
      }
    })
    const context = await prompt('transformation context url?')
    const { hostname } = this.profile
    const subscription = {
      host: hostname,
      object: object
    }
    if (String(target).endsWith('profile/card#me')) {
      subscription.agent = target
    } else {
      subscription.target = target
    }
    if (typeof context === 'string' && context.startsWith('http')) {
      subscription.context = context
    }
    const result = await this.addSubscription(subscription)
    this.print(this.formatSubscriptionList(result))
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
