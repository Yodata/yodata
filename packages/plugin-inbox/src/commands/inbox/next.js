const {Command, flags} = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxNextCommand extends Command {
  async run() {
    const inbox = new Inbox(this.client)
    this.print(inbox.next(this.props()))
  }
}
InboxNextCommand.description = 'advance to the next page of inbox messages'
InboxNextCommand.flags = Command.mergeFlags({
  format: flags.string({
    options: [
      'link',
      'full',
    ],
  }),
  from: flags.string({
    description: 'starting point',
  }),
  by: flags.string({
    description: 'query type (timestamp/token)',
    options: [
      'timestamp',
      'token',
    ],
  }),
  output: flags.string({
    char: 'o',
    description: 'output format',
    default: 'table',
  }),
})

module.exports = InboxNextCommand
