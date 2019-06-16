const {Command} = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxStoreCommand extends Command {
  async run() {
    const inbox = new Inbox(this.client)
    const data = inbox.store.store
    this.print(data)
  }
}
InboxStoreCommand.description = 'display inbox data'

module.exports = InboxStoreCommand
