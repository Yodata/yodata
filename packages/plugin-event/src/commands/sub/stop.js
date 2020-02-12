const { Command } = require('../../subscription')
const { flags, prompt } = require('@yodata/cli-tools')

class StopSubscriptionCommand extends Command {
  async run () {
    const { subscriber, topic } = this.props()
    if (typeof subscriber === 'undefined' && typeof topic === 'undefined') {
      this.error('subscriber or topic required.')
    } else {
      const subs = await this.getSubscriptions()
      if (Array.isArray(subs)) {
        const matches = subs.filter(value => {
          const { object, agent } = value
          const matchesSubscriber = (typeof subscriber === 'undefined') || String(agent).includes(subscriber)
          const matchesTopic = (typeof topic === 'undefined') || String(object).includes(topic)
          return (matchesSubscriber && matchesTopic)
        })
        if (matches.length === 0) {
          return this.print('no subscriptions matched')
        } else {
          await this.print(matches)
          const confirm = await prompt(`are you sure you want to stop ${matches.length} subscriptions?`, { type: 'confirm' })
          if (confirm) {
            const result = new Set(subs)
            matches.forEach(match => result.delete(match))
            await this.client.addToCollection('/settings/subscriptions', 'stopped', matches)
            const response = await this.update(Array.from(result))
            this.print(response)
          }
        }
      }
    }
  }
}

StopSubscriptionCommand.description = 'disables matching subscription(s)'
StopSubscriptionCommand.flags = Command.mergeFlags({
  subscriber: flags.string({
    name: 'subscriber',
    char: 's',
    description: 'filter by subscriber'
  }),
  topic: flags.string({
    name: 'topic',
    char: 't',
    description: 'filter by topic'
  })
})

module.exports = StopSubscriptionCommand
