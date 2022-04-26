const { Command } = require('../../subscription')
const { select, flags, uri } = require('@yodata/cli-tools')
const SETTINGS_SUBSCRIPTIONS = '/settings/subscriptions'

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
    const query = this.prop.query
    const host = this.prop.host
      ? uri.resolve(this.prop.host, this.profile.hostname)
      : this.profile.hostname

    const target = uri.resolve(SETTINGS_SUBSCRIPTIONS, host)

    this.client
      .data(target, 'data.items', [])
      .then((items = []) => {
        return items.filter(
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
      })
      .then(async result => {
        if (Array.isArray(result) && result.length > 0) {
          return result
        } else {
          throw new Error('no subscriptions')
        }
      })
      .then(select(['agent', 'target', 'object', 'context', 'subscribes', 'publishes']))
      .then(data => this.print(this.formatSubscriptionList(data)))
      .catch(error => {
        console.log(error.message)
      })
  }
}

SubscribersCommand.description = 'list event subscribers'
SubscribersCommand.aliases = ['subs', 'subscribers']
SubscribersCommand.args = [
  {
    name: 'host',
    description: 'the target pod',
    parse: value => {
      if (!String(value).startsWith('http') && !value.includes(':') && !value.includes('.')) {
        return value + ':'
      } else {
        return value
      }
    }
  }
]
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
  }),
  query: flags.string({
    char: 'q',
    name: 'query',
    description: 'filter results by agent or topic',
    type: 'string',
    default: '*'
  })
})

module.exports = SubscribersCommand
