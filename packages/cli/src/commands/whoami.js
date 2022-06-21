const { Command } = require('@yodata/cli-tools')
const store = require('@yodata/config')

const EMPTY =
  `
$ yodata register - to configure your first pod.
`
class WhoamiCommand extends Command {
  async run () {
    if (store.isEmpty()) {
      this.log(EMPTY)
    } else {
      this.print(this.profile)
    }
  }
}

WhoamiCommand.description = 'Get the current profile name'
WhoamiCommand.aliases = ['who']
WhoamiCommand.flags = Command.flags

module.exports = WhoamiCommand
