const { Command } = require('@yodata/cli-tools')
const Inbox = require('../..')
const pm = require('p-map')

class InboxResetCommand extends Command {
  async run () {
    const inbox = new Inbox(this.client)
    const result = await inbox.list().then(items => {
      return pm(items, async item => {
        return item.id
      })
    })
    this.print(result)
  }
}
InboxResetCommand.description = 'reset inbox'

module.exports = InboxResetCommand
