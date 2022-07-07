const { Command, normalizeTarget } = require('../../subscription')
const { flags } = require('@yodata/cli-tools')
const { URL } = require('node:url')
class AddSubscriptionCommand extends Command {
  async run () {
    // pusher subscription (on inbox)
    const { push, sub, pub, replace, version, verbose } = await this.props()
    if (push) {
      const subscription = {
        host: this.host,
        object: '/inbox/',
        target: normalizeTarget(push)
      }
      await this.addSubscription(subscription)
      return subscription
    }

    const subscription = {
      type: 'Subscription',
      version,
      host: this.host,
      agent: this.agent,
      instrument: new URL('profile/card#me', this.profile.hostname).href,
      subscribes: sub,
      publishes: pub,
      lastModifiedDate: Date.now().toString(),
      lastModifiedBy: new URL('profile/card#me', this.profile.hostname).host
    }

    const cmd = replace ? this.replaceSubscription.bind(this) : this.addSubscription.bind(this)
    await cmd(subscription, this.target)
      .then(async result => {
        if (Array.isArray(result) && result.length > 0) {
          await this.print(`\n${this.target}\n`, { output: 'text' })
          if (verbose) {
            return this.print(this.formatSubscriptionList(result))
          }
        } else {
          this.print(this.target = ' - NO SUBSCRIPTIONS', { output: 'text' })
        }
      })
      .catch(this.handleError.bind(this))
  }
}

AddSubscriptionCommand.flags = Command.mergeFlags({
  replace: flags.boolean({
    type: 'boolean',
    description: 'replace the current subscription (dont merge topics)'
  }),
  version: flags.integer({
    type: 'integer',
    char: 'v',
    description: 'the subscription version',
    default: 0
  }),
  verbose: flags.boolean({
    type: 'boolean',
    description: 'display the full subscription list after the change'
  })

})

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

module.exports = AddSubscriptionCommand
