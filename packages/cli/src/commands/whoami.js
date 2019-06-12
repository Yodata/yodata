const { Command } = require('@oclif/command')
const store = require('@yodata/config')

const EMPTY =
`A girl is no one.

$ yodata register - to configure your first pod.
`
class WhoamiCommand extends Command {
  async run () {
    if (store.isEmpty()) {
      this.log(EMPTY)
    } else {
      this.log(store.currentProfile)
    }
  }
}

WhoamiCommand.description = 'Get the current profile name'
WhoamiCommand.aliases = ['who']

module.exports = WhoamiCommand
