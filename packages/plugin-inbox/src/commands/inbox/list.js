const {Command, flags} = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxListCommand extends Command {
  async run() {
    const inbox = new Inbox(this.client)
    const result = await inbox.list(this.props()).catch(error => this.error(error))
    this.print(result)
  }
}
InboxListCommand.description = 'list inbox items'
InboxListCommand.aliases = ['inbox:ls']

InboxListCommand.flags = Command.mergeFlags({
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

module.exports = InboxListCommand
