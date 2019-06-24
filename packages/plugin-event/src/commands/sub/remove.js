const { Command } = require('../../subscription')
const { prompt, uri } = require('@yodata/cli-tools')

class RemoveSubscriptionCommand extends Command {
  async run () {
    const subs = await this.getSubscriptions()
    this.print(this.formatSubscriptionList(subs))

    const target = await prompt('index', {
      type: 'number',
      choices: Object.keys(subs)
    })
    const result = await this.removeSubscription(target)
    this.print(result)
  }
}

RemoveSubscriptionCommand.description = 'remove a subscription'
RemoveSubscriptionCommand.flags = Command.mergeFlags({
  output: {
    default: 'table'
  }
})

module.exports = RemoveSubscriptionCommand
