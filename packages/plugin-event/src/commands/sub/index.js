const { Command, baseFlags } = require('../../subscription')
class SubscribersCommand extends Command {
  async run () {
    this._props = await this.props()
    const { query } = await this.props()
    const target = this.target
    const doc = await this.client.data(target, undefined, { version: '0', items: [] }).catch(this.handleError.bind(this))
    const result = doc.items.filter(
      item => {
        const { agent = '', subscribes = [], publishes = [] } = item
        return (
          String(query) === '*' ||
            agent.includes(query) ||
            subscribes.toString().includes(query) ||
            publishes.toString().includes(query)
        )
      }
    )
    if (Array.isArray(result) && result.length > 0) {
      await this.print(`${this.target} version: ${doc.version}\n`)
      return this.print(this.formatSubscriptionList(result))
    } else {
      console.log(`NO SUBSCRIPTIONS - ${this.target}`)
    }
  }
}

SubscribersCommand.description = 'display all authorized publishers and subscribers on the host pod'
SubscribersCommand.aliases = ['subs', 'subscribers']
SubscribersCommand.args = [
  {
    name: 'host',
    description: 'the target pod',
    parse: value => {
      if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
        return value + ':'
      } else if (value === '.') {
        return '/settings/subscriptions'
      } else {
        return value
      }
    }
  },
  {
    name: 'query',
    description: 'filter results by agent or topic',
    type: 'string',
    default: '*'
  }
]

SubscribersCommand.flags = {
  output: { ...baseFlags.output, ...{ default: 'table' } }
}

module.exports = SubscribersCommand
