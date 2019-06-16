const {Command, flags} = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxNextCommand extends Command {
  async run() {
    const inbox = new Inbox(this.client)
    this.print(inbox.next())
  }
}
InboxNextCommand.description = 'advance to the next page of inbox messages'
InboxNextCommand.flags = Command.mergeFlags({
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
})

module.exports = InboxNextCommand
