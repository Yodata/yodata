const { Command } = require('../../subscription')
const { select, flags } = require('@yodata/cli-tools')

// {
//   v2 subscription format
//   "type": "Subscription" ,
//   "version": "3",
//   "agent": "https://ace-staging.bhhs.hsfaffiliates.com/profile/card#me",
//   "instrument": "https://forevercloudstore.bhhs.dev.yodata.io",
//   "host": "https://staging.bhhs.hsfaffiliates.com",
//   "subscribes": [
//       "realestate/contact",
//       "realestate/lead",
//       "realestate/website",
//       "realestate/marketingprogram"
//   ],
//   "publishes": [
//       "realestate/contact",
//       "realestate/lead"
//   ]
// }

class SubscribersCommand extends Command {
  async run () {
    return this.client
      .data('/settings/subscriptions', 'data.items', [])
      .then(select(['agent', 'target', 'object', 'context', 'subscribes', 'publishes']))
      .then(this.formatSubscriptionList)
      .then(res => this.print(res))
      .catch(this.handleError)
  }
}

SubscribersCommand.description = 'list event subscribers'
SubscribersCommand.aliases = ['subs', 'subscribers']
SubscribersCommand.flags = Command.mergeFlags({
  output: flags.string({
    description: 'format output',
    char: 'o',
    default: 'table',
    options: [
      'yaml',
      'json',
      'table',
      'text'
    ]
  })
})

module.exports = SubscribersCommand
