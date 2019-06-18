const { Command } = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxResetCommand extends Command {
  async run () {
    const inbox = new Inbox(this.client)
    inbox.reset()
    this.print('ok')
  }
}
InboxResetCommand.description = 'reset inbox'

module.exports = InboxResetCommand
