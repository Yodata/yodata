const { Command, baseFlags } = require('../../subscription')
const {flags} = require('@yodata/cli-tools')


class RemoveSubscriptionCommand extends Command {
  async run() {
    const host = this.host
    const target = this.target
    const agent = this.agent
    const subscription = {
      type: 'Subscription',
      instrument: 'https://www.npmjs.com/package/@yodata/cli',
      version: '0',
      host,
      agent,
      subscribes: this.prop.sub,
      publishes: this.prop.pub
    }
    // console.log({ props: this.prop, host, target, subscription })
    const result = await this.removeSubscription(subscription, target)
      .then(async result => {
        if (Array.isArray(result) && result.length > 0) {
          if (this.prop.verbose) {
            await this.print(this.target, { output: 'text' })
            return this.print(this.formatSubscriptionList(result))
          } else {
            this.print(this.target + ' - UPDATED', { output: 'text' })
          }
        } else {
          this.print(`${this.target} - NO SUBSCRIPTIONS`, { output: 'text' })
        }

      })
      .catch(this.handleError.bind(this))
    // await this.print(target)

  }
}

RemoveSubscriptionCommand.description =
  `remove a subscription entirely
  examples:
  # remove profile subscription for coolapp on the current host
  yodata sub:remove --agent coolapp --sub profile

  # remove a subscription for coolapp on host nv301
  yodata sub:remove --agent coolapp --host nv301
  `
RemoveSubscriptionCommand.flags = Command.mergeFlags({
  verbose: flags.boolean({
    description: 'dispaly all subscriptions for the target after the subscription is reoved.',
    default: false
  })
})



module.exports = RemoveSubscriptionCommand
