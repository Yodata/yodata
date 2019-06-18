const { Command } = require('@yodata/cli-tools')
const Inbox = require('../..')

class InboxStoreCommand extends Command {
  async run () {
    const inbox = new Inbox(this.client)
    const result = {
      hostname: inbox.client.hostname,
      next: inbox.store.get('next')
    }
    this.print(result)
  }
}
InboxStoreCommand.description = 'display inbox data'

module.exports = InboxStoreCommand
