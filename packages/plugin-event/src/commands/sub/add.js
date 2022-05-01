const { Command, normalizeTarget } = require('../../subscription')
const { flags } = require('@yodata/cli-tools')
class AddSubscriptionCommand extends Command {
  async run () {
    // pusher subscription (on inbox)
    if (this.prop.push) {
      const subscription = {
        host: this.host,
        object: '/inbox/',
        target: normalizeTarget(this.prop.push)
      }
      await this.addSubscription(subscription)
      return subscription
    }

    const subscription = {
      type: 'Subscription',
      version: '0',
      host: this.host,
      agent: this.agent,
      instrument: 'https://www.npmjs.com/package/@yodata/cli',
      subscribes: this.prop.sub,
      publishes: this.prop.pub
    }

    const cmd = this.prop.replace ? this.replaceSubscription.bind(this) : this.addSubscription.bind(this)
    const result = await cmd(subscription, this.target)
        .then(async result => {
          if (Array.isArray(result) && result.length > 0) {
            if (this.prop.verbose) {
              await this.print(this.target, {output: 'text'})
              return this.print(this.formatSubscriptionList(result))
            } else {
              return this.print(this.target + ' - UPDATED', {output: 'text'})
            }
          } else {
            return this.print(this.target = ' - NO SUBSCRIPTIONS', {output: 'text'})
          }

        })
        .catch(this.handleError.bind(this))
    }
}
AddSubscriptionCommand.description =
  `add topics to an existing subscription or creates a new one
  examples:
  # add profile subscription for coolapp on the current host

  $ yodata sub:add --agent coolapp --sub profile

  # add lead and contact pub and sub on host nv301

  $ yodata sub:add --sub contact,lead --pub contact,lead --agent reliance --host nv301

  # to REPLACE a subscription rather than add topics to it, use the --replace flag
  # if this command were executed following the previous command, the reliance subscription
  # will only have contact pub/sub permissions on the host.

  $ yodata sub:add --sub contact --pub contact --agent reliace --host nv301 --replace
  `

AddSubscriptionCommand.flags = Command.mergeFlags({
  replace: flags.boolean({
    type: 'boolean',
    description: 'replace the current subscription (dont merge topics'
  }),
  verbose: flags.boolean({
    description: 'dispaly all subscriptions for the target after the subscription is reoved.',
    default: false
  })
})

module.exports = AddSubscriptionCommand
