const { Command } = require('../../subscription')
const { select, flags } = require('@yodata/cli-tools')

class SubscribersCommand extends Command {
  async run () {
    return this.client
      .data('/settings/subscriptions', 'data.items', [])
      .then(select([ 'agent', 'target', 'object' ]))
      .then(this.formatSubscriptionList)
      .then(res => this.print(res))
      .catch(console.error)
  }
}

SubscribersCommand.description = 'list event subscribers'
SubscribersCommand.aliases = [ 'subs', 'subscribers' ]
SubscribersCommand.flags = Command.mergeFlags({
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'table',
    options: [
      'yaml',
      'json',
      'table'
    ]
  })
})

module.exports = SubscribersCommand
