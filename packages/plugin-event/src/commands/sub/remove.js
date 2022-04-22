const { Command } = require('../../subscription')
const { uri } = require('@yodata/cli-tools')
class RemoveSubscriptionCommand extends Command {
  async run () {
    const host = this.prop.host ? uri.resolve(this.prop.host, this.profile.hostname) : this.profile.hostname
    const target = uri.resolve(SETTINGS_SUBSCRIPTIONS, host)
    const subs = await this.getSubscriptions(target)
    this.print(this.formatSubscriptionList(subs))
  }
}

RemoveSubscriptionCommand.description = 'remove a subscription'

module.exports = RemoveSubscriptionCommand
