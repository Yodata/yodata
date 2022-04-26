const { Command } = require('../../subscription')
const { uri, flags } = require('@yodata/cli-tools')
const { profileURI } = require('../../util')
const SETTINGS_SUBSCRIPTIONS = '/settings/subscriptions'

class RemoveSubscriptionCommand extends Command {
  async run () {
    const host = this.prop.host ? uri.resolve(this.prop.host, this.profile.hostname) : this.profile.hostname
    const target = uri.resolve(SETTINGS_SUBSCRIPTIONS, host)
    const agent = profileURI(uri.resolve(this.prop.agent, this.profile.hostname))
    const subscription = {
      type: 'Subscription',
      version: '0',
      host: new URL(host).origin,
      agent: agent,
      subscribes: this.prop.sub,
      publishes: this.prop.pub
    }
    // console.log({ props: this.prop, host, target, subscription })
    const result = await this.removeSubscription(subscription, target)
    // await this.print(target)
    this.print(this.formatSubscriptionList(result))
  }
}

RemoveSubscriptionCommand.description =
  `remove a subscription or topic
  examples:
  # remove profile subscription for myapp on the current host
  yodata sub:remove --agent myapp --sub profile

  # remoe reliance subscription for contact and lead events from host ma301
  yodata sub:remove --sub contact,lead --agent reliance --host ma301
  `
RemoveSubscriptionCommand.flags = Command.mergeFlags({
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
    parse: value => Command.parseTopicList(value),
    default: []
  }),
  pub: flags.string({
    type: 'string',
    name: 'pub',
    description: 'the agent will be authorized to publish to these topics (csv)',
    parse: value => Command.parseTopicList(value),
    default: []
  }),
  output: flags.string({
    default: 'table'
  })
})

module.exports = RemoveSubscriptionCommand
