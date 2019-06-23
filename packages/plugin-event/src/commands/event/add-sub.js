const { Command } = require('../../event-command')
const { normalizeSubscription } = require('../../subscription/normalize-subscription')
const { addToCollection } = require('@yodata/cli-tools')

class AddSubCommand extends Command {
  async run () {
    const target = '/settings/subscriptions'
    const subscription = normalizeSubscription(this.props())
    const data = await this.client.data(target) || { items: [] }
    data.items = addToCollection(data.items, subscription)
    await this.client.put(target, data)
    this.print(data)
  }
}

AddSubCommand.description = 'create a subscription'
// EventSubscriptionsCommand.aliases = [ 'event:sub', 'event:subs' ]
AddSubCommand.flags = {
  agent: {
    type: 'string',
    description: 'the subscriber profile url'
  },
  topic: {
    type: 'string',
    name: 'topic'
  }
}

module.exports = AddSubCommand
