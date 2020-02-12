const { Command } = require('@yodata/cli-tools')
const Inbox = require('../..')
const pm = require('p-map')

class InboxResetCommand extends Command {
  async run () {
    const inbox = new Inbox(this.client)
    const client = this.client
    const result = await inbox.list().then(items => {
      const { index } = items
      return pm(items, async item => {
        return this.client.delete()
      })
    })
    this.print(result)
  }
}
InboxResetCommand.description = 'reset inbox'

module.exports = InboxResetCommand
