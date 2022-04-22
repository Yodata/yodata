const { Command } = require('../../subscription')
const { uri, flags } = require('@yodata/cli-tools')
const { profileURI } = require('../../util')
const SETTINGS_SUBSCRIPTIONS = '/settings/subscriptions'

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
  } else if (input.startsWith('http') && input.endsWith('profile/card#me')) {
    return input
  } else {
    return input
  }
}

class AddSubscriptionCommand extends Command {
  async run () {
    // the current pod
    const profileHostName = this.profile.hostname
    let
      commandHostName
    // a host is declared in the command
    if (this.prop.host) {
      commandHostName = uri.resolve(this.prop.host, profileHostName)
    } else {
      commandHostName = profileHostName
    }

    // pusher subscription (on inbox)
    if (this.prop.push) {
      const subscription = {
        host: `${commandHostName}/profile/card#me`,
        object: '/inbox/',
        target: normalizeTarget(this.prop.push)
      }
      await this.addSubscription(subscription)
      this.print(subscription.host + 'OK')
      return subscription
    }

    const agentHostName = uri.resolve(this.prop.agent, profileHostName)

    const subscription = {
      type: 'Subscription',
      version: '0',
      host: new URL(commandHostName).origin,
      agent: profileURI(agentHostName),
      subscribes: this.prop.sub,
      publishes: this.prop.pub
    }
    const target = uri.resolve(SETTINGS_SUBSCRIPTIONS, commandHostName)
    const result = this.prop.replace
      ? await this.upsertSubscription(subscription, target)
      : await this.addSubscription(subscription, target)

    // this.print(this.formatSubscriptionList(result))
    this.print(result)
  }
}
AddSubscriptionCommand.description =
  `add or update a subscription
  examples:
  # add profile subscription for myapp on the current host
  yodata sub:add --agent myapp --sub profile

  # add reliance subscription for contact and lead events from host ma301
  yodata sub:add --sub contact,lead --agent reliance --host ma301
  `
AddSubscriptionCommand.flags = Command.mergeFlags({
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

module.exports = AddSubscriptionCommand
