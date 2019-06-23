const { Command } = require('../../event-command')
const { select } = require('@yodata/cli-tools')

class EventSubscriptionsCommand extends Command {
  async run () {
    const baseTopic = this.baseTopic
    return this.client
      .data('/settings/subscriptions', 'data.items', [])
      .then(select([ 'agent', 'object', 'target' ]))
      .then(subs => {
        if (Array.isArray(subs)) {
          return subs.map(sub => {
            const topic = String(sub.object).replace(baseTopic, '')
            const agent = sub.agent || sub.target
            return { TOPIC: topic, SUBSCRIBER: this.shortenUrl(agent) }
          })
        }
        return subs
      })
      .then(res => this.print(res))
      .catch(console.error)
  }
}

EventSubscriptionsCommand.description = 'list event subscribers'
EventSubscriptionsCommand.aliases = [ 'event:sub', 'event:subs' ]
EventSubscriptionsCommand.flags = Command.flags

module.exports = EventSubscriptionsCommand
