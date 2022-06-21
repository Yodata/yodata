const { Command, flags } = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxListCommand extends Command {
  async run () {
    const inbox = new Inbox(this.client)
    const result = await inbox.list(await this.props())
    this.print(result)
  }
}
InboxListCommand.description = 'list inbox items'
InboxListCommand.aliases = ['inbox:ls']

InboxListCommand.flags = Command.mergeFlags({
  format: flags.string({
    options: [
      'link',
      'full'
    ]
  }),
  from: flags.string({
    description: 'starting point'
  }),
  by: flags.string({
    description: 'query type (timestamp/token)',
    options: [
      'timestamp',
      'token'
    ]
  }),
  hours: flags.integer({
    char: 'H',
    description: 'get messages in the last X hours'
  }),
  output: flags.string({
    char: 'o',
    description: 'output format',
    default: 'table'
  })
})

module.exports = InboxListCommand

// .then(items => {
//   return items.contains.map(message => ({
//     index: message.index,
//     time: message.timestamp ? new Date(message.timestamp).toISOString() : '',
//     topic: message.topic,
//     id: message.id ? message.id.split('/inbox/')[1] : '',
//   }))
// })
