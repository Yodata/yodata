const { Command } = require('../../subscription')
const { select } = require('@yodata/cli-tools')
const BASE_TOPIC = '/event/topic/'

class SubscribersCommand extends Command {
  async run () {
    return this.client
      .data('/settings/subscriptions', 'data.items', [])
      .then(select([ 'agent', 'object', 'target' ]))
      .then(subs => {
        if (Array.isArray(subs)) {
          return subs.map(sub => {
            const topic = String(sub.object).replace(BASE_TOPIC, '')
            const agent = sub.agent || sub.target
            return { TOPIC: topic, SUBSCRIBER: agent }
          })
        }
        return subs
      })
      .then(res => this.print(res))
      .catch(console.error)
  }
}

SubscribersCommand.description = 'list event subscribers'
SubscribersCommand.aliases = [ 'subs', 'subscribers' ]
SubscribersCommand.flags = Command.flags

module.exports = SubscribersCommand
